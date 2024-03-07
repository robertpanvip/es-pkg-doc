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

process.env["NODE_ENV"] = "production";

/**
 * 生成doc文档的配置项
 */
export type DocOptions = {
    /** 包名称 */
    name: string,
    /** 描述 */
    desc?:string
    /** 编译文件的入口 */
    entry: string,
    /** 编译文件的 ts配置路径 */
    tsconfig?: string,
    /** 编译后输出的文件夹 */
    outDir: string,
    /** 编译后输出的类型 @default md*/
    outType?: "html" | "md" | ["html", "md"],
    /** 编译后输出的文件名称 @default README*/
    outName?: string
}

/**
 * 默认 EsPkgDoc的主函数
 * @param config DocOptions
 */
export async function doc(config: DocOptions) {
    global.doc = {
        ...config,
    }
    const outName = config.outName || 'README';
    let outType: string[] = (config.outType || ["md"]) as string[];
    if (!Array.isArray(outType)) {
        outType = [outType]
    }
    const app = await Application.bootstrap({
        entryPoints: [config.entry],
        tsconfig: config.tsconfig,
        excludeExternals: true,
    });
    app.options.addReader(new TSConfigReader());
    const project = await app.convert();
    const result = renderServer(project!)
    const template = fs.readFileSync(
        path.join(cwd, 'index.html'),
        'utf-8'
    )
    let html = template
        .replace(`<!--ssr-outlet-->`, beautify.html(result.html, {indent_size: 2}))

    if (outType.includes('html')) {
        fs.writeFileSync(path.join(config.outDir, `${outName}.html`), html)
    }


    if (outType.includes('md')) {
        const htmlToMdService = new HtmlToMdService({
            /*  defaultReplacement(content, node) {
                 const tagName = (node as HTMLElement).tagName
                 if (["SVG"].includes(tagName)) {
                     console.log("tagName", tagName);
                     const svg = `<${tagName.toLocaleLowerCase()}>${content}</${tagName.toLocaleLowerCase()}>`
                     const svgBase64Encoded = Buffer.from(svg).toString('base64');
                     return `<img src="data:image/svg+xml;base64,${svgBase64Encoded}" />`
                 }
                 return content
             } */
        })
        htmlToMdService.keep(["table", "tbody", "thead", "tr", "td", "th"])
        html = html.replaceAll("var(--color-icon-background)", "#f2f4f8")
            .replaceAll("var(--color-text)", "#222")
            .replaceAll(/data-source-[^\s]+=""/g, '')
            .replaceAll(/class--[^\s]+=""/g, '')
            .replaceAll(/\s+class="[^"]*"\s+/g, ' ')
            .replaceAll('<wbr>', "").replaceAll('</wbr>', "");
        /* .replaceAll(/<svg[^>]*>[\s\S]*?<\/svg>/gi, (match) => {
            const svgBase64Encoded = Buffer.from(match).toString('base64');
            return `<img src="data:image/svg+xml;base64,${svgBase64Encoded}" />`
        }) */

        const markdown = htmlToMdService.turndown(html)
        fs.writeFileSync(path.join(config.outDir, `${outName}.md`), markdown)
    }
}

export default doc