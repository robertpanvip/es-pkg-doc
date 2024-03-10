import {Application, TSConfigReader} from "typedoc";
import path from 'node:path'
import fs from 'node:fs';
import HtmlToMdService from 'turndown'
import beautify from "js-beautify";
import {renderServer} from "./render";
import * as JSX from "./render/jsx";
import {packageJson} from "./render/utils/json";
import {genCases} from "./utils/case";
import {htmlTableToMd} from "./utils/table.ts";

// 定义全局函数
global.JSX = JSX;

process.env["NODE_ENV"] = "production";

/**
 * 生成doc文档的配置项
 */
export interface DocOptions {
    /** 包名称 */
    name?: string,
    /** 作者 */
    author?: string,
    /** 仓库地址 */
    repository?: string,
    /** 描述 */
    desc?: string
    /** 编译文件的入口 */
    entry: string,
    /** 编译文件的 ts配置路径 */
    tsconfig?: string,
    /** 编译后输出的文件夹 */
    outDir: string,
    /** 编译后输出的类型 @default md*/
    outType?: "html" | "md" | ["html", "md"],
    /** 编译后输出的文件名称 @default README*/
    outName?: string,
    /** 生成用法 例子的目录 @default case */
    caseDir?: string;
    /**是否保留为原始htmlTable @default false */
    keepHtmlTable?: boolean
}

/**
 * 默认 EsPkgDoc的主函数
 */
export async function bootstrap(config: DocOptions) {
    const name = config.name || packageJson.name;
    if (!config.caseDir) {
        config.caseDir = path.join(config.entry, 'case')
    }
    global.doc = {
        name,
        desc: config.desc || packageJson.description,
        author: config.author || packageJson.author,
        repository: config.repository || packageJson.repository?.url,
        cases: genCases(config.caseDir, name || "", config.entry),
        ...config,
    }
    const outName = config.outName || 'README';
    let outType: string[] = (config.outType || ["md"]) as string[];
    if (!Array.isArray(outType)) {
        outType = [outType]
    }
    try {
        fs.statSync(config.entry)
    } catch (e) {
        console.error(`${config.entry} not found`)
        return
    }
    const app = await Application.bootstrap({
        entryPoints: [config.entry],
        tsconfig: config.tsconfig,
        excludeExternals: true,
    });
    app.options.addReader(new TSConfigReader());
    const project = await app.convert();
    const result = renderServer(project!)
    const template = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="./style.css" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
  <!--ssr-outlet-->
  </body>
  <!--ssr-script-->
</html>`
    let html = template
        .replace(`<!--ssr-outlet-->`, beautify.html(result.html, {indent_size: 2}))

    if (outType.includes('html')) {
        fs.writeFileSync(path.join(config.outDir, `${outName}.html`), html)
    }

    if (outType.includes('md')) {
        const htmlToMdService = new HtmlToMdService({})
        if (!config.keepHtmlTable) {
            htmlTableToMd(htmlToMdService)
        } else {
            htmlToMdService.keep(["table", "tbody", "thead", "tr", "td", "th"])
        }
        html = html.replaceAll("var(--color-icon-background)", "#f2f4f8")
            .replaceAll("var(--color-text)", "#222")
            .replaceAll(/data-source-[^\s]+=""/g, '')
            .replaceAll(/class--[^\s]+=""/g, '')
            .replaceAll(/\s+class="[^"]*"\s+/g, ' ')
            .replaceAll('<wbr>', "").replaceAll('</wbr>', "");
        const markdown = htmlToMdService.turndown(html)
        fs.writeFileSync(path.join(config.outDir, `${outName}.md`), markdown)
    }
}

export default bootstrap