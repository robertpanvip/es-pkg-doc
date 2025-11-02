import {JSDocableNode, Symbol as MorphSymbol, Node, EnumMember, PropertySignature, TypeElementTypes} from "ts-morph";
import {DocOptions, JSDoc, PropertiesDoc} from "./type";
import {packageJson} from "./render/utils/json";
import fs from 'node:fs'
import log from "./utils/log";
import {main} from "./check";

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


/**
 * 默认 EsPkgDoc的主函数
 */
export async function bootstrap(config: DocOptions) {
    const name = config.name || packageJson.name;
    const doc = {
        name,
        desc: config.desc || packageJson.description,
        author: config.author || packageJson.author,
        repository: config.repository || packageJson.repository?.url,
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
        log.error(`${config.entry} not found`)
        return
    }
    main(doc.entry, doc.tsconfig!, outName + ".md");
}
export default bootstrap;
