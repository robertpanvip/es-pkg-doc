import express, {RequestHandler} from 'express';
import fs from 'node:fs';
import path from 'node:path';
import {createServer as createViteServer, ViteDevServer} from 'vite';
import {openBrowser, printServerUrls} from './utils/openBrowser.ts';
import {Application, TSConfigReader} from "typedoc";
import {sm} from "@jsx/jsx-runtime.ts";

const cwd = process.cwd();


async function createSsrMiddleware(server: ViteDevServer): Promise<RequestHandler> {

    // 注册 Vite Middlewares
    // 主要用来处理客户端资源
    return async (req, res, next) => {
        const url = req.originalUrl;

        if (url.startsWith("/___source")) {
            const id = req.query["id"] as string;
            console.log('___update', id);
            const info = sm.get(id)
            return res.status(200).send(info)
        }
        if (!(url.endsWith("/") || url.endsWith("index.html"))) {
            return next();
        }
        try {

            // 1. 读取 index.html
            let template = fs.readFileSync(
                path.join(cwd, 'index.html'),
                'utf-8'
            )
            // 2. 应用 Vite HTML 转换。这将会注入 Vite HMR 客户端，
            //    同时也会从 Vite 插件应用 HTML 转换。
            //    例如：@vitejs/plugin-react-refresh 中的 global preambles
            template = await server.transformIndexHtml(url, template)
            const entry = path.join(cwd, '/src/render/index.ts');
            const {default: render} = await server.ssrLoadModule(entry)
            const file = path.join(cwd, './components/index.tsx');
            const app = await Application.bootstrap({
                entryPoints: [file],
                tsconfig: path.join(cwd, './components/tsconfig.json'),
                excludeExternals: true,
            });
            app.options.addReader(new TSConfigReader());
            const project = await app.convert();

            const scope = await render(project!) as { html: string, effects: () => string }
            // 5. 注入渲染后的应用程序 HTML 到模板中。
            const html = template
                .replace(`<!--ssr-outlet-->`, scope.html)
                .replace(`<!--ssr-script-->`, scope.effects)

            // 6. 返回渲染后的 HTML。
            res.status(200).set({'Content-Type': 'text/html'}).end(html)
        } catch (e) {
            // 如果捕获到了一个错误，让 Vite 来修复该堆栈，这样它就可以映射回
            // 你的实际源码中。
            server.ssrFixStacktrace(e as Error)
            console.error(e as Error)
            res.status(500).end((e as Error).message)
        }

    };
}

async function createServer() {
    const app = express();
    const port = 3000
    const server = app.listen(port, () => {
        const url = `http://localhost:${port}`
        printServerUrls(
            {
                local: [url],
                network: [""]
            },
            url,
            console.info,
        )
        openBrowser(url, true, console)
    });
    const vite = await createViteServer({
        root: './',
        base: "./",
        mode: "server",
        clearScreen: false,
        appType: "custom",
        server: {
            middlewareMode: true,
            hmr: {server},
        },
    })
    server.on("close", async () => {
        await vite.close();
        server.emit("vite:close");
    });
    // 加入 Vite SSR 中间件
    app.use(await createSsrMiddleware(vite));
    app.use(vite.middlewares)

}

createServer().catch(console.error);