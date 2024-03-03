/**
 * Custom JSX module designed specifically for TypeDoc's needs.
 * When overriding a default TypeDoc theme output, your implementation must create valid {@link Element}
 * instances, which can be most easily done by using TypeDoc's JSX implementation. To use it, set up
 * your tsconfig with the following compiler options:
 * ```json
 * {
 *     "jsx": "react",
 *     "jsxFactory": "JSX.createElement",
 *     "jsxFragmentFactory": "JSX.Fragment"
 * }
 * ```
 * @module
 */

import {escapeHtml} from "./html";
import type {
    IntrinsicElements,
    JsxElement,
    JsxChildren,
    JsxComponent,
    JsxNode,
} from "./jsx.elements";
import {JsxFragment as Fragment} from "./jsx.elements";

export type {
    JsxElement as Element,
    JsxChildren as Children,
    JsxComponent,
} from "./jsx.elements";
export {JsxFragment as Fragment} from "./jsx.elements";
export {
    JsxNode
}

interface FunctionComponent<P = NonNullable<unknown>> {
    (props: P, context?: any): JsxNode;
}

/**
 * Used to inject HTML directly into the document.
 */
export function Raw(_props: { html: string }) {
    // This is handled specially by the renderElement function. Instead of being
    // called, the tag is compared to this function and the `html` prop will be
    // returned directly.
    return null;
}

/**
 * TypeScript's rules for looking up the JSX.IntrinsicElements and JSX.Element
 * interfaces are incredibly strange. It will find them if they are included as
 * a namespace under the createElement function, or globally, or, apparently, if
 * a JSX namespace is declared at the same scope as the factory function.
 * Hide this in the docs, hopefully someday TypeScript improves this and allows
 * looking adjacent to the factory function and we can get rid of this phantom namespace.
 * @hidden
 */
export declare namespace JSX {
    export {
        IntrinsicElements,
        JsxElement as Element,
        JsxChildren,
        JsxNode,
        FC
    };
}

const voidElements = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
]);

const blockElements = new Set([
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "div",
    "section",
    "nav",
    "details",
    "p",
    "ul",
    "ol",
    "li",
]);

export type FC<P = NonNullable<unknown>> = FunctionComponent<P>;

function guid(inputString: string): string {
    let hash = 0;

    for (let i = 0; i < inputString.length; i++) {
        const char = inputString.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash &= hash; // Convert to 32-bit integer
    }

    // Convert to positive 4-digit number
    const positiveID = (hash & 0x7FFFFFFF) % 10000;

    // Ensure the ID is always 4 digits
    return String(10000 + positiveID).substring(1);
}

// eslint-disable-next-line @typescript-eslint/ban-types
type Getter = Function

type DebugSelf = {
    stringify: [Getter],
    getDisplayName: [Getter],
    toStyleClass: [Getter],
    getKindClass: [Getter],
    wbr: [Getter],
    join: [Getter],
    classNames: [Getter],
    hasTypeParameters: [Getter],
    renderTypeParametersSignature: [Getter],
    camelToTitleCase: [Getter],
    renderName: [Getter],
    getHierarchyRoots: [Getter],
}
export type DebugInfo = {
    __self?: DebugSelf,
    __source?: DebugSource,
}
export type DebugSource = { fileName?: string, lineNumber?: number, columnNumber?: number }
export const sm = new Map<string, DebugInfo>()

/**
 * JSX factory function to create an "element" that can later be rendered with {@link renderElement}
 * @param tag
 * @param props
 * @param children
 */
export function createElement(
    tag: typeof Fragment | string | JsxComponent<any>,
    props: object | null,
    ...children: JsxChildren[]
): JsxElement {
    const {
        __self,
        __source = {},
        ...rest
    } = props as DebugInfo || {}
    const uid = `${__source.fileName || ""}${__source.lineNumber || 0}${__source.columnNumber || 0}`
    const id = __source ? `data-source-${guid(uid)}` : ""
    sm.set(id, {
        __self,
        __source
    })
    // 获取当前语法树的源文件
    return {
        tag,
        props: {
            ...rest,
            [id]: ""
        },
        children
    };
}

let renderPretty = true;
let renderEscaped = true;

export function setRenderSettings(options: { pretty: boolean, escaped: boolean }) {
    renderPretty = options.pretty;
    renderEscaped = options.escaped;
}

export const effectCache = new Map<number, (() => void)[]>();

export const render = function render(node: JsxNode,container:Element):void {
    if (Array.isArray(node)) {
        node.forEach((item)=>render(item,container))
        return
    }
    renderElement(node)
}

export const renderToString = function render(node: JsxNode): string {
    if (Array.isArray(node)) {
        return node.map(renderToString).join('')
    }
    return renderElement(node)
}

export const renderElement = function renderElement(
    element: JsxElement | null | undefined | string | number | boolean,
): string {
    if (!element || typeof element === "boolean") {
        return "";
    }
    if (typeof element === "string" || typeof element === "number") {
        return renderEscaped ? escapeHtml(element.toString()) : element.toString();
    }

    const {tag, props, children} = element;

    if (typeof tag === "function") {
        if (tag === Raw) {
            return String((props as any).html);
        }
        const ele = tag(Object.assign({children}, props))
        //currentJsxNode = element;
        const res = renderToString(ele);
        //currentJsxNode = null;
        return res;
    }

    let html = "";

    if (tag !== Fragment) {
        if (blockElements.has(tag) && renderPretty && html) {
            html += "\n";
        }
        html += "<";
        html += tag;

        for (const [key, val] of Object.entries(props ?? {})) {
            if (val == null) continue;

            if (typeof val == "boolean") {
                if (val) {
                    html += " ";
                    html += key;
                }
            } else {
                html += " ";
                html += key;
                html += '="';
                html += (
                    typeof val === "string" ? val : JSON.stringify(val)
                ).replaceAll('"', "&quot;");
                html += '"';
            }
        }
    }

    let hasChildren = false;
    if (children) {
        hasChildren = true;
        if (tag !== Fragment) html += ">";
        html += renderToString(children);
    }

    if (tag !== Fragment) {
        if (!hasChildren) {
            if (voidElements.has(tag)) {
                html += "/>";
            } else {
                html += "></";
                html += tag;
                html += ">";
            }
        } else {
            html += "</";
            html += tag;
            html += ">";
        }
    }

    return html;
};
