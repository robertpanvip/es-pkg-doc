import {DefaultThemeRenderContext} from "./DefaultThemeRenderContext";
import {DebugInfo, JSX, sm} from "./jsx";
import {Options, PageEvent, ProjectReflection} from "typedoc";
import path from "node:path";
import {buildSync} from 'esbuild'
import { fileURLToPath } from 'node:url'
import {resolveDefaultFile} from "./utils/paths";

export function renderServer(project: ProjectReflection) {
    if(!project){
        console.error("Project is null")
        throw new Error("Project is null")
    }

    let code=''
    if(process.env["NODE_ENV"] !== "production"){
        const __dirname = path.dirname(fileURLToPath(import.meta.url))
        const entry = resolveDefaultFile(path.join(__dirname, "./inspector/mounted"))
        const res = buildSync({
            entryPoints: [entry],
            bundle: true,
            write: false, // 不写入文件
            format: 'iife',
            target: 'es2021',
            loader: {
                '.ts': 'tsx',
            },
        })
        code = res.outputFiles[0].text
    }

    const page = new PageEvent(PageEvent.BEGIN, project!)
    const themeContext = new DefaultThemeRenderContext({url: '', options: new Options(), page: page});
    const templateOutput = themeContext.tableTemplate(page);
    const html = JSX.renderToString(templateOutput);
    const debug: Record<string, DebugInfo> = {}
    sm.forEach((item, key) => {
        debug[key] = item
    })
    return {
        html: html,
        effects: () => {
            return `<script> ${code} ;window.debug=${JSON.stringify(debug)}</script>`
        }
    }
}

export default renderServer