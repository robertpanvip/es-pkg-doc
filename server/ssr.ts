import express, {RequestHandler} from 'express';
import fs from 'node:fs';
import path from 'node:path';
import {createServer as createViteServer, ViteDevServer} from 'vite';
import {openBrowser, printServerUrls} from './utils/openBrowser';
import {Application, ProjectReflection, TSConfigReader} from "typedoc";
import {sm} from "../src/render/jsx";
import {isPathInside} from './utils/path';
import * as JSX from "../src/render/jsx";
import {packageJson} from "../src/render/utils/json";
import {genCases} from "../src/utils/case.ts";

const cwd = process.cwd();



// 定义全局函数
global.JSX = JSX;
global.doc = {
    name: packageJson.name,
    desc: packageJson.description,
    author: packageJson.author,
    repository: packageJson.repository?.url,
    cases: genCases(
        path.join(cwd,'./components/case'),
        packageJson.name,
        path.join(cwd,'./components/index.tsx'),
    ),
}

type Render = (p: ProjectReflection | null) => { html: string, effects: () => string }

enum RenderType {
    HTML,
    RENDER,
    TYPEDOC
}

type Task<T> = {
    task: Promise<T> | null,
    gen(server?: ViteDevServer, url?: string): Promise<T>
}

const transformIndexTask: Task<string> = {
    task: null,
    async gen(server, url) {
        // 1. 读取 index.html
        let template = fs.readFileSync(
            path.join(cwd, 'index.html'),
            'utf-8'
        )
        // 2. 应用 Vite HTML 转换。这将会注入 Vite HMR 客户端，
        //    同时也会从 Vite 插件应用 HTML 转换。
        //    例如：@vitejs/plugin-react-refresh 中的 global preambles
        template = await server!.transformIndexHtml(url!, template)
        return template;
    }
}
let changed: RenderType | null = null

const getRenderTask: Task<Render> = {
    task: null,
    async gen(server) {
        const entry = path.join(cwd, '/src/render/index.ts');
        const {default: render} = await server!.ssrLoadModule(entry, {fixStacktrace: true})
        return render
    }
}

const typedocTask: Task<ProjectReflection> = {
    task: null,
    async gen() {
        const file = path.join(cwd, './components/index.tsx');
        const app = await Application.bootstrap({
            entryPoints: [file],
            tsconfig: path.join(cwd, './components/tsconfig.json'),
            excludeExternals: true,
        });
        app.options.addReader(new TSConfigReader());
        const project = await app.convert();
        return project!
    }
}

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

            if ([RenderType.HTML].includes(changed!)) {
                transformIndexTask.task = transformIndexTask.gen(server, url)
            }

            const template = await transformIndexTask.task || '';
            if ([RenderType.RENDER].includes(changed!)) {
                getRenderTask.task = getRenderTask.gen(server)
            }

            const render = await getRenderTask.task
            if ([RenderType.TYPEDOC].includes(changed!)) {
                typedocTask.task = typedocTask.gen()
            }
            const project = await typedocTask.task
            const scope = await render!(project!)
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
    const vite = await createViteServer({
        root: './',
        base: "./",
        mode: "server",
        appType: 'custom',
        server: {middlewareMode: true},
        logLevel: 'info', // 可以尝试设置为 'debug' 查看更详细的日志
    })

    const server = app.listen(port, () => {
        transformIndexTask.task = transformIndexTask.gen(vite, "/")
        getRenderTask.task = getRenderTask.gen(vite)
        typedocTask.task = typedocTask.gen();
        const url = `http://localhost:${port}`;
        printServerUrls(
            {
                local: [url],
                network: [""]
            },
            url,
            console.info,
        )
        openBrowser(url, true, console);
    });

    vite.watcher.on("all", (_, watchPath) => {
        const watches = {
            [path.join(cwd, '/index.html')]: () => {
                changed = RenderType.HTML;
            },
            [path.join(cwd, '/src')]: () => {
                changed = RenderType.RENDER;
            },
            [path.join(cwd, '/components')]: () => {
                changed = RenderType.TYPEDOC;
                vite.ws.send({
                    type: 'full-reload',
                    path: watchPath
                })
            }
        };
        Object.entries(watches).forEach(([key, fn]) => {
            if (isPathInside(watchPath, key)) {
                fn()
            }
        })

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