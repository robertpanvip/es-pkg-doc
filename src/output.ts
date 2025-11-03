import {ComponentMsg, Exports, JSDoc, JSDocTag, PropertiesDoc, ToExports} from "./type";
import {markdownTable} from 'markdown-table';
import { pkg  } from "./util";

function getJSDocTags(doc: JSDoc[]) {
    return doc.flatMap(d => d.tags.flatMap(t => [t]));
}

/** 转义 Markdown 表格单元格中的特殊字符 */
function escapeMarkdownCell(text: string): string {
    return text
        .replace(/\|/g, "\\|")   // 竖线
        //.replace(/`/g, "\\`")    // 反引号
        .replace(/\*/g, "\\*")   // 星号
        .replace(/_/g, "\\_")    // 下划线
        .replace(/\[/g, "\\[")   // 方括号
        .replace(/\]/g, "\\]")
        //.replace(/</g, "&lt;")   // HTML 角括号可转义为实体
        //.replace(/>/g, "&gt;")
        .replace(/\r?\n/g, "<br>"); // 多行内容转成 <br>
}

function parseTag(docs: JSDocTag[], tag: string[]) {
    return docs.find(item => tag.includes(item.tag))?.text || ""
}

function toPureTable(properties: PropertiesDoc[] = []) {
    const v = properties.map(p => {
        const desc = p.docs.map(d => d.comment).join('');
        const docs = getJSDocTags(p.docs);
        const type = p.isOptional ? p.type : p.type.startsWith(':') ? p.type.replace(':', "") : p.type;
        const deprecated = parseTag(docs, ["deprecated"]);
        const defaultValue = parseTag(docs, ["default", "defaultValue"]);
        const warn = parseTag(docs, ["warn", "warning"]);
        //const example = parseTag(docs, ["example"]);
        //const see = parseTag(docs, ["see"]);
        //const version = parseTag(docs, ["version"]);
        return [
            `${deprecated ? `⚠️~~` : ""}${p.name}${deprecated ? `~~` : ""}`,
            `${deprecated ? `<span style="color:red">[${deprecated}] </span> ` : ""}${desc}${warn ? `\n⚠️ 警告：${warn}` : ''}`,
            `\`${type.replace(';', '')}\``,
            defaultValue ? `\`${defaultValue}\`` : ""
        ].map(escapeMarkdownCell)
    })
    return markdownTable([
        ["属性", "说明", "类型", "默认值"],
        ...v
    ])
}

function toTable(component: ComponentMsg, flag: boolean) {
    if (component.properties && component.properties.length !== 0) {
        return `#### ⚙️ ${cleanImportType(component.props?.getText())} API 参数
${!flag ? toPureTable(component.properties) : ""}
        `
    }
    return '';
}

function toRef(item: ComponentMsg) {
    if (item.isReact && item.ref && item.refProperties) {
        return `#### ⚙️ ${cleanImportType(item.ref?.getText())} API 参数
${toPureTable(item.refProperties)}
        `
    }
    return '';
}

function cleanImportType(typeStr?: string) {
    if (!typeStr) {
        return ''
    }
    // 正则匹配 import(...) 路径前缀
    const regex = /import\(["'].*?["']\)\./g;

// 替换为空字符串，保留类型名称
    return `\`${typeStr.replace(regex, '')}\``;
}

function toDemo(item: Exports) {
    return item.component.isReact ? `#### 🧾 示例
\`\`\`tsx
import ${item.isDefaultExport ? item.name : `{${item.name}}`} from '${pkg.name}'
function App(){
    return <${item.name} ${item.component.properties?.filter(p => !p.isOptional).map(p => `${p.name}={xxx}`) || ""} />
}
\`\`\`` : ""
}

export function toMD(v: ToExports) {
    const sorter = {default: 0, exports: 1, interface: 2} as Record<string, number>;
    const _v = Object.entries(v).sort((a, b) => sorter[a[0]] - sorter[b[0]])
    let md = `${pkg.name}
===========
${pkg.description}\n

[![NPM Version](https://img.shields.io/npm/v/@es-pkg/doc?color=33cd56&logo=npm)](https://www.npmjs.com/package/@es-pkg/doc)  [![NPM Version](https://img.shields.io/npm/dm/@es-pkg/doc.svg?style=flat-square)](https://www.npmjs.com/package/@es-pkg/doc)  [![unpacked size](https://img.shields.io/npm/unpacked-size/@es-pkg/doc?color=green)](https://www.npmjs.com/package/@es-pkg/doc)  [![Author](https://img.shields.io/badge/docs_by-robertpanvip-blue)](https://github.com/robertpanvip/es-pkg-doc.git)

## 🔧 Install
    npm install ${pkg.name}`
    md += _v.flatMap(([_, v]) => {
        return v.map(item => {
            //const propsType = cleanImportType(item.component.props?.getText());
            //const exportsHasThisRefType = _v.flatMap(c => c[1]).some(it => `\`${it.name}\`` === propsType)
            return `
### 🔖 ${item.name}

**类型**：\`${cleanImportType(item.type)}\`\n  
**简介**：${item.doc.flatMap(d => d.comment).join('') || "无说明"}
${toTable(item.component, false)}
${toRef(item.component)}
${toDemo(item)}
`;
        })
    }).join('\n');
    return md;
}