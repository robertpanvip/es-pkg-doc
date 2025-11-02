import {Type} from "ts-morph";

export type PropertiesDoc = {
    name: string;
    isOptional?: boolean;
    type: string;
    docs: JSDoc[]
}

export type JSDocTag = {
    tag: string,
    name?: string,
    text: string
}

export type JSDoc = {
    comment: string;
    description: string;
    tags: JSDocTag[]
}
export type Exports = {
    component: ComponentMsg,
    name: string,
    doc: JSDoc[],
    isDefaultExport: boolean,
    type: string,
    kind: string;
}
export type ToExports = Record<string, Exports[]>
export type ComponentMsg = {
    isReact: boolean;
    props?: Type;
    ref?: Type,
    properties?: PropertiesDoc[]
    refProperties?: PropertiesDoc[]
}


/**
 * 生成doc文档的配置项
 */
export type DocOptions = {
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
    /**是否保留为原始htmlTable @default false */
    keepHtmlTable?: boolean
}