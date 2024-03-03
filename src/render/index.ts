import {DefaultThemeRenderContext} from "./DefaultThemeRenderContext.ts";
import {DebugInfo, JSX, sm} from "./jsx";
import {Options, PageEvent, ProjectReflection} from "typedoc";


import path from "node:path";
import {buildSync} from 'esbuild'

const res = buildSync({
    entryPoints: [path.join(process.cwd(), "src/render/inspector/mounted.ts")],
    bundle: true,
    write: false, // 不写入文件
    format: 'iife',
    target: 'es2021',
    loader: {
        '.ts': 'tsx',
    },
})
const code = res.outputFiles[0].text

export function renderServer(project: ProjectReflection) {
    const page = new PageEvent(PageEvent.BEGIN, project!)
    const themeContext = new DefaultThemeRenderContext({url: '', options: new Options(), page: page});
    const templateOutput = themeContext.reflectionTemplate(page);
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