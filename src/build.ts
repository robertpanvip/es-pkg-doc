import {Application, TSConfigReader} from "typedoc";
import path from 'node:path'
import fs from 'node:fs';
import HtmlToMdService from 'turndown'
import beautify from "js-beautify";
import {renderServer} from "./render";
import * as JSX from "@jsx/jsx-runtime.ts";

const cwd = process.cwd();

// 定义全局函数
global.JSX = JSX;
async function main() {
    const file = path.join(cwd, './components/index.tsx')
    const app = await Application.bootstrap({
        entryPoints: [file],
        tsconfig: path.join(cwd, './components/tsconfig.json'),
        excludeExternals: true,
    });
    app.options.addReader(new TSConfigReader());
    const project = await app.convert();
    const result= renderServer(project!)
    const template = fs.readFileSync(
        path.join(cwd, 'index.html'),
        'utf-8'
    )
    const html = template
        .replace(`<!--ssr-outlet-->`, beautify.html(result.html, {indent_size: 2}))

    fs.writeFileSync(path.join(cwd, './components/index.html'), html)

    const htmlToMdService = new HtmlToMdService()
    htmlToMdService.keep(['table', 'thead', 'tbody', 'tr', 'th', 'td'] as const)
    const markdown = htmlToMdService.turndown(html)
    fs.writeFileSync(path.join(cwd, './components/index.md'), markdown)
}

main().catch(console.log)
