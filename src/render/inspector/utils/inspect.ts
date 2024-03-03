
import queryString from 'querystring'
import {
    isNativeTagFiber,
    isReactSymbolFiber,
    isForwardRef,
    getDirectParentFiber,
    getFiberName,
    getElementFiberUpward,
} from './fiber'
import {DebugSource} from "@jsx/jsx-runtime.ts";
import {Fiber} from "../infer.ts";

type Source = DebugSource
export interface CodeInfo {
    lineNumber: string,
    columnNumber: string,
    /**
     * code source file relative path to dev-server cwd(current working directory)
     * need use with `react-dev-inspector/plugins/babel`
     */
    relativePath?: string,
    /**
     * code source file absolute path
     * just need use with `@babel/plugin-transform-react-jsx-source` which auto set by most framework
     */
    absolutePath?: string,
}

/**
 * props that injected into react nodes
 *
 * like <div data-inspector-line="2" data-inspector-column="3" data-inspector-relative-path="xxx/ooo" />
 * this props will be record in fiber
 */
export interface CodeDataAttribute {
    'data-inspector-line': string,
    'data-inspector-column': string,
    'data-inspector-relative-path': string,
}

/**
 * react fiber property `_debugSource` created by `@babel/plugin-transform-react-jsx-source`
 *     https://github.com/babel/babel/blob/v7.16.4/packages/babel-plugin-transform-react-jsx-source/src/index.js
 *
 * and injected `__source` property used by `React.createElement`, then pass to `ReactElement`
 *     https://github.com/facebook/react/blob/v18.0.0/packages/react/src/ReactElement.js#L189
 *     https://github.com/facebook/react/blob/v18.0.0/packages/react/src/ReactElement.js#L389
 *     https://github.com/facebook/react/blob/v18.0.0/packages/react/src/ReactElement.js#L447
 *
 * finally, used by `createFiberFromElement` to become a fiber property `_debugSource`.
 *     https://github.com/facebook/react/blob/v18.0.0/packages/react-reconciler/src/ReactFiber.new.js#L648-L649
 */
export const getCodeInfoFromDebugSource = (fiber?: Fiber): CodeInfo | undefined => {
    if (!fiber?._debugSource) return undefined

    const {
        fileName,
        lineNumber,
        columnNumber,
    } = fiber._debugSource as Source & { columnNumber?: number }

    if (fileName && lineNumber) {
        return {
            lineNumber: String(lineNumber),
            columnNumber: String(columnNumber ?? 1),

            /**
             * `fileName` in `_debugSource` is absolutely
             * ---
             *
             * compatible with the incorrect `fileName: "</xxx/file>"` by [rspack](https://github.com/web-infra-dev/rspack)
             */
            absolutePath: fileName.match(/^<.*>$/)
                ? fileName.replace(/^<|>$/g, '')
                : fileName,
        }
    }

    return undefined
}

/**
 * code location data-attribute props inject by `react-dev-inspector/plugins/babel`
 */
export const getCodeInfoFromProps = (fiber?: Fiber): CodeInfo | undefined => {
    if (!fiber?.pendingProps) return undefined

    const {
        'data-inspector-line': lineNumber,
        'data-inspector-column': columnNumber,
        'data-inspector-relative-path': relativePath,
    } = fiber.pendingProps as CodeDataAttribute

    if (lineNumber && columnNumber && relativePath) {
        return {
            lineNumber,
            columnNumber,
            relativePath,
        }
    }

    return undefined
}

export const getCodeInfoFromFiber = (fiber?: Fiber): CodeInfo | undefined => (
    getCodeInfoFromProps(fiber)
    ?? getCodeInfoFromDebugSource(fiber)
)

/**
 * give a `base` dom fiber,
 * and will try to get the human friendly react component `reference` fiber from it;
 *
 * rules and examples see below:
 * *******************************************************
 *
 * if parent is html native tag, `reference` is considered to be as same as `base`
 *
 *  div                                       div
 *    └─ h1                                     └─ h1  (<--base) <--reference
 *      └─ span  (<--base) <--reference           └─ span
 *
 * *******************************************************
 *
 * if parent is NOT html native tag,
 *   and parent ONLY have one child (the `base` itself),
 *   then `reference` is considered to be the parent.
 *
 *  Title  <--reference                       Title
 *    └─ h1  (<--base)                          └─ h1  (<--base) <--reference
 *      └─ span                                 └─ span
 *                                              └─ div
 *
 * *******************************************************
 *
 * while follow the last one,
 *   "parent" is considered to skip continuous Provider/Customer/ForwardRef components
 *
 *  Title  <- reference                       Title  <- reference
 *    └─ TitleName [ForwardRef]                 └─ TitleName [ForwardRef]
 *      └─ Context.Customer                       └─ Context.Customer
 *         └─ Context.Customer                      └─ Context.Customer
 *          └─ h1  (<- base)                          └─ h1  (<- base)
 *            └─ span                             └─ span
 *                                                └─ div
 *
 *  Title
 *    └─ TitleName [ForwardRef]
 *      └─ Context.Customer
 *         └─ Context.Customer
 *          └─ h1  (<- base) <- reference
 *    └─ span
 *    └─ div
 */
export const getReferenceFiber = (baseFiber?: Fiber): Fiber | undefined => {
    if (!baseFiber) return undefined

    const directParent = getDirectParentFiber(baseFiber)
    if (!directParent) return undefined

    const isParentNative = isNativeTagFiber(directParent)
    const isOnlyOneChild = !directParent.child!.sibling

    let referenceFiber = (!isParentNative && isOnlyOneChild)
        ? directParent
        : baseFiber

    // fallback for cannot find code-info fiber when traverse to root
    const originReferenceFiber = referenceFiber

    while (referenceFiber) {
        if (getCodeInfoFromFiber(referenceFiber)) return referenceFiber

        referenceFiber = referenceFiber.return!
    }

    return originReferenceFiber
}

export const getElementCodeInfo = (element: HTMLElement): CodeInfo | undefined => {
    const fiber: Fiber | undefined = getElementFiberUpward(element)

    //const referenceFiber = getReferenceFiber(fiber)
    return getCodeInfoFromFiber(fiber)
}

export const gotoEditor = (source?: CodeInfo) => {
    if (!source) return

    const {
        lineNumber,
        columnNumber,
        relativePath,
        absolutePath,
    } = source

    const isRelative = Boolean(relativePath)

    const launchParams = {
        file: (isRelative ? relativePath : absolutePath)+`:${lineNumber}:${columnNumber}`,
        lineNumber,
        colNumber: columnNumber,
    }

    /**
     * api in 'react-dev-inspector/plugins/webpack/middlewares' launchEditorMiddleware
     */
    const apiRoute = isRelative
        ? `/__open-in-editor/relative`
        : `/__open-in-editor`

    fetch(`${apiRoute}?${queryString.stringify(launchParams)}`)
}

export const getNamedFiber = (baseFiber?: Fiber): Fiber | undefined => {
    let fiber = baseFiber

    // fallback for cannot find code-info fiber when traverse to root
    let originNamedFiber: Fiber | undefined

    while (fiber) {
        let parent = fiber.return ?? undefined
        let forwardParent: Fiber | undefined

        while (isReactSymbolFiber(parent)) {
            if (isForwardRef(parent)) {
                forwardParent = parent
            }
            parent = parent?.return ?? undefined
        }

        if (forwardParent) {
            fiber = forwardParent
        }

        if (getFiberName(fiber)) {
            if (!originNamedFiber) originNamedFiber = fiber

            if (getCodeInfoFromFiber(fiber)) return fiber
        }

        fiber = parent!
    }

    return originNamedFiber
}

export const getElementInspect = (element: HTMLElement): {
    fiber?: Fiber,
    name?: string,
    title: string,
} => {
    const fiber = getElementFiberUpward(element)
    const referenceFiber = getReferenceFiber(fiber)

    const namedFiber = getNamedFiber(referenceFiber)

    const fiberName = getFiberName(namedFiber)
    const nodeName = element.nodeName.toLowerCase()

    const title = fiberName
        ? `${nodeName} in <${fiberName}>`
        : nodeName

    return {
        fiber: referenceFiber,
        name: fiberName,
        title,
    }
}