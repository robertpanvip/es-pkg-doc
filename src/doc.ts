import {EnumMember, JSDocableNode, Node, PropertySignature, Symbol as MorphSymbol, TypeElementTypes, Project} from "ts-morph";
import {DocOptions, JSDoc, PropertiesDoc, ToExports} from "./type";
import fs from 'node:fs'
import log from "@es-pkg/utils";
import path from 'node:path'
import {groupBy, pkg, pkg as packageJson} from "./util";
import {toMD} from "./output.ts";
import {getComponent} from "./check.ts";

export * from './type'

export function getExports(symbols: MorphSymbol[]):ToExports {
    const result = symbols.flatMap(symbol => {
        let name = symbol.getName();
        let decl = symbol.getDeclarations()?.[0];
        let isDefaultExport = false;
        if (Node.isExportAssignment(decl)) {
            const expression = decl.getExpression();
            if (symbol.getName() === 'default') {
                if (Node.isIdentifier(expression)) {
                    name = expression.getText();
                    decl = expression.getDefinitionNodes()[0];
                } else {
                    name = pkg.name;
                    decl = expression;
                }
            }
            isDefaultExport = true;
        }
        const info = getComponent(decl);
        if (info.isReact) {
            {
                const sys = info.props?.getSymbol();
                const def = sys?.getDeclarations()[0];
                if (def) {
                    info.properties = getPropertiesDoc(def);
                }
            }
            {
                const sys = info.ref?.getSymbol();
                const def = sys?.getDeclarations()[0];
                if (def) {
                    info.refProperties = getPropertiesDoc(def);
                }
            }

        }else{

            if(['TypeAliasDeclaration', "InterfaceDeclaration", "EnumDeclaration"].includes(decl.getKindName())){

                const def= decl.getType().getSymbol()?.getDeclarations()[0];

                if(def){
                    info.properties = getPropertiesDoc(def);
                    //console.log(decl.getType().getText(),def.getKindName());
                }

            }
        }
        return {
            component: info,
            name,
            doc: jsDoc(symbol),
            isDefaultExport,
            type:decl.getType().getText(),
            kind: decl.getKindName()
        };
    })
    return groupBy(result, (r) => {
        if (r.isDefaultExport) {
            return "default";
        }
        if (['TypeAliasDeclaration', "InterfaceDeclaration", "EnumDeclaration"].includes(r.kind)) {
            return 'interface'
        }
        return "exports"
    });
}

export function jsDoc(symbol?: MorphSymbol): JSDoc[] {
    if (!symbol) {
        return [];
    }

    // 1. 获取符号的所有声明，尝试找到带 JSDoc 的节点
    const declarations = symbol.getDeclarations();
    let targetNode: JSDocableNode | null = null;

    for (const decl of declarations) {
        targetNode = getJSDocableNodeFromDeclaration(decl);
        if (targetNode) break; // 找到第一个带 JSDoc 的节点即可
    }
    if (!targetNode) {
        return [];
    }

    // 2. 提取 JSDoc 信息（取第一个 JSDoc 块）
    const jsDocs = targetNode.getJsDocs();
    if (jsDocs.length === 0) {
        return [];
    }
    return jsDocs.map(doc => (
        {
            tags: doc.getTags().map(tag => {
                const compilerNode = tag.compilerNode;
                return ({
                    tag: tag.getTagName(),
                    name: (compilerNode as unknown as { name?: { text: string } }).name?.text,
                    text: tag.getCommentText() || "" // 标签完整文本（如 "@param {string} name 名称"）
                })
            }),
            comment: doc.getComment() as string || '', // 原始注释文本（包括换行等格式）
            description: doc.getDescription() || '' // 描述文本（不含标签的部分）
        }
    ));
}

// 辅助函数：从声明中找到最原始的 JSDocableNode（处理引用嵌套）
function getJSDocableNodeFromDeclaration(decl: Node): JSDocableNode | null {
    // 1. 优先处理 ExportAssignment（如 export default XXX）
    if (Node.isExportAssignment(decl)) {
        const expression = decl.getExpression(); // 获取导出的表达式（通常是标识符）
        if (Node.isIdentifier(expression)) {

            // 从标识符追溯原始定义（如变量声明）
            const definitions = expression.getDefinitionNodes();
            for (const def of definitions) {
                const node = def.getParent()?.getParent();
                if (node) {
                    const jsDocNode = getJSDocableNodeFromDeclaration(node);
                    if (jsDocNode) return jsDocNode;
                }
            }
        }
        // 若导出的是函数表达式（如 export default () => {}），直接处理表达式
        return getJSDocableNodeFromDeclaration(expression);
    }
    if (Node.isJSDocable(decl)) {
        return decl;
    }
    // 如果是标识符（如引用其他变量），追溯其定义
    if (Node.isIdentifier(decl)) {

        const symbol = decl.getSymbol();
        if (!symbol) return null;
        // 递归查找标识符指向的原始声明
        const definitions = symbol.getDeclarations();
        for (const def of definitions) {
            if (def.getSymbol() === symbol) {
                return null
            }
            const jsDocNode = getJSDocableNodeFromDeclaration(def);
            if (jsDocNode) return jsDocNode;
        }
    }

    // 其他情况（如导出语句），检查子节点是否有 JSDocableNode
    for (const child of decl.getChildren()) {
        const jsDocNode = getJSDocableNodeFromDeclaration(child);
        if (jsDocNode) return jsDocNode;
    }

    return null;
}

function dealMembers(members: (EnumMember | PropertySignature | TypeElementTypes)[]) {
    return members.map((child, index) => {
        // 获取属性名（处理标识符或字符串字面量键）
        const propName = "getName" in child ? child.getName() : child.getText();
        let type = child.getText().replace(propName, '');
        if (!type && Node.isEnumMember(child)) {
            type = `= ${index}`
        }
        return {
            name: propName,
            isOptional: child.getSymbol()?.isOptional(),
            type: type,
            docs: jsDoc(child.getSymbol())
        }
    })
}

export function getPropertiesDoc(decl: Node) {
    let docs: PropertiesDoc[] = []
    if (Node.isEnumDeclaration(decl)) {
        const members = decl.getMembers();
        docs = dealMembers(members)
    } else if (Node.isInterfaceDeclaration(decl)) {
        const members = decl.getMembers();
        docs = dealMembers(members)
    } else if (Node.isTypeLiteral(decl)) {
        const properties = decl.getProperties(); // 直接获取所有属性签名（PropertySignature）
        docs = dealMembers(properties)
    }
    return docs
}

function getMergedConfig(config: DocOptions) {
    const name = config.name || packageJson.name;
    const doc = {
        name,
        desc: config.desc || packageJson.description,
        author: config.author || packageJson.author,
        repository: config.repository || packageJson.repository?.url,
        ...config,
    }
    const outType: string[] = (config.outType || ["md"]) as string[];
    if (!Array.isArray(outType)) {
        doc.outType = [outType] as unknown as ["html", "md"]
    }
    return doc
}

export function setup(config: DocOptions): string {
    const _config = getMergedConfig(config)
    try {
        fs.statSync(_config.entry)
    } catch (e) {
        log.error(`${_config.entry} not found`)
        return "";
    }
    const project = new Project({
        tsConfigFilePath: _config.tsconfig!,
    });
    const sourceFile = project.addSourceFileAtPath(_config.entry);
    const exports = sourceFile.getExportSymbols();
    const v = getExports(exports);
    return toMD(v);
}


/**
 * 默认 EsPkgDoc的主函数
 */
export function bootstrap(config: DocOptions) {
    const outName = config.outName || 'README';
    const md = setup(config);
    fs.writeFileSync(path.join(config.outDir, `${outName}.md`), md)
}

export default bootstrap;
