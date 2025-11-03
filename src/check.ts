import {
    Node, Symbol as MorphSymbol,
    Type,
    SyntaxKind,
    FunctionDeclaration,
    ArrowFunction,
    FunctionExpression
} from "ts-morph"
import {ComponentMsg} from "./type";

/**
 * 返回 { isReact, props?, ref? }
 */
export function getComponent(decl: Node) {
    const sym = decl.getSymbol();
    if (!sym) return {isReact: false};

    const rawType = decl.getType();
    const candidates = collectCandidateTypes(rawType);

    for (const t of candidates) {
        const res = checkReactType(t);
        if (res.isReact) return res;
    }

    // 🟢 新增：检测普通函数组件
    if (isPotentialReactFunction(decl)) {
        const fn =
            Node.isFunctionDeclaration(decl)
                ? decl
                : Node.isVariableDeclaration(decl)
                    ? decl.getInitializer()
                    : undefined;

        if (!fn) return {isReact: false};

        const params = (fn as FunctionDeclaration).getParameters();
        const propsType = params.length ? params[0].getType() : undefined;
        return {isReact: true, props: propsType};
    }

    return {isReact: false};
}

/** 判断是否为函数式 React 组件（函数名大写 且返回 JSX） */
function isPotentialReactFunction(decl: Node): boolean {
    // 普通函数声明
    if (Node.isFunctionDeclaration(decl)) {
        const name = decl.getName();
        if (!name || !/^[A-Z]/.test(name)) return false;
        return returnsJSX(decl);
    }

    // 变量赋值 = () => JSX
    if (Node.isVariableDeclaration(decl)) {
        const init = decl.getInitializer();
        if (init && (Node.isArrowFunction(init) || Node.isFunctionExpression(init))) {
            // 变量名首字母是否大写
            const name = decl.getNameNode().getText();
            if (!/^[A-Z]/.test(name)) return false;
            return returnsJSX(init);
        }
    }

    return false;
}

/** 判断函数是否返回 JSX */
function returnsJSX(fn: FunctionDeclaration | ArrowFunction | FunctionExpression): boolean {
    const body = fn.getBody();
    if (!body) return false;

    // 1️⃣ 显式 return <div>
    const returns = body.getDescendantsOfKind(SyntaxKind.ReturnStatement);
    for (const r of returns) {
        const expr = r.getExpression();
        if (expr && isJSX(expr)) return true;
    }

    // 2️⃣ 箭头函数直接返回 JSX：() => <div/>
    if (Node.isArrowFunction(fn)) {
        const expr = fn.getBody();
        if (expr && isJSX(expr)) return true;
    }

    return false;
}

/** 判断节点是否为 JSX 元素 */
function isJSX(node: Node): boolean {
    return [
        SyntaxKind.JsxElement,
        SyntaxKind.JsxSelfClosingElement,
        SyntaxKind.JsxFragment,
    ].includes(node.getKind());
}

/** 收集所有可能的“底层”类型（展开 alias/intersection/union/typeArgs/baseTypes） */
function collectCandidateTypes(root: Type) {
    const seen = new Set<string>();
    const out: Type[] = [];

    function idOf(t: Type) {
        try {
            return t.getText();
        } catch {
            return String('id' in t.compilerType ? t.compilerType.id : Math.random());
        }
    }

    function walk(t: Type | undefined) {
        if (!t) return;
        const id = idOf(t);
        if (seen.has(id)) return;
        seen.add(id);
        out.push(t);

        if (t.isIntersection()) for (const it of t.getIntersectionTypes()) walk(it);
        if (t.isUnion()) for (const ut of t.getUnionTypes()) walk(ut);

        for (const a of t.getTypeArguments?.() ?? []) walk(a);
        for (const b of t.getBaseTypes?.() ?? []) walk(b);

        const aSym = t.getAliasSymbol?.();
        if (aSym) {
            for (const decl of aSym.getDeclarations() ?? []) {
                if (Node.isTypeAliasDeclaration(decl)) {
                    const typeNode = decl.getTypeNode?.();
                    try {
                        const declType = typeNode?.getType?.() ?? decl.getType?.();
                        if (declType) walk(declType);
                    } catch { /* empty */
                    }
                } else {
                    try {
                        const maybe = (decl as any).getType?.();
                        if (maybe) walk(maybe);
                    } catch { /* empty */
                    }
                }
            }
        }

        for (const a of t.getAliasTypeArguments?.() ?? []) walk(a);
    }

    walk(root);
    return out;
}

const getTypeArgs = (t: Type) =>
    t.getAliasTypeArguments?.()?.length
        ? t.getAliasTypeArguments()!
        : t.getTypeArguments?.() ?? [];

/** 检测单个 type 是否为 React 的某种组件类型，并抽取 props/ref */
function checkReactType(type: Type): ComponentMsg {
    if (type.isIntersection()) {
        for (const it of type.getIntersectionTypes()) {
            const r = checkReactType(it);
            if (r.isReact) return r;
        }
    }
    if (type.isUnion()) {
        for (const ut of type.getUnionTypes()) {
            const r = checkReactType(ut);
            if (r.isReact) return r;
        }
    }

    const aliasSym = type.getAliasSymbol?.();
    const sym = aliasSym ?? type.getSymbol?.();
    if (!sym) return {isReact: false};

    const name = sym.getName();


    if (name === "FC" || name === "FunctionComponent") {
        if (!isFromReact(sym)) return {isReact: false};
        const args = getTypeArgs(type);
        return {isReact: true, props: args[0]};
    }

    if (name === "ForwardRefExoticComponent") {
        if (!isFromReact(sym)) return {isReact: false};
        const args = getTypeArgs(type);
        const propsType = args[0];
        if (!propsType) return {isReact: true};
        if (propsType.isIntersection()) {
            let propsNode: Type | undefined;
            let refNode: Type | undefined;
            for (const it of propsType.getIntersectionTypes()) {
                const itSym = it.getSymbol?.();
                if (itSym && itSym.getName() === "RefAttributes" && isFromReact(itSym)) {
                    const rt = it.getTypeArguments?.()?.[0];
                    if (rt) refNode = rt;
                } else propsNode = it;
            }
            return {isReact: true, props: propsNode, ref: refNode};
        } else return {isReact: true, props: propsType};
    }

    if (name === "MemoExoticComponent" || name === "LazyExoticComponent") {
        if (!isFromReact(sym)) return {isReact: false};
        const args = getTypeArgs(type);
        const inner = args[0];
        if (inner) return checkReactType(inner);
    }

    if (name === "ComponentType" || name === "JSXElementConstructor" || name === "NamedExoticComponent") {
        if (!isFromReact(sym)) return {isReact: false};
        const args = getTypeArgs(type);
        const inner = args[0];
        if (inner) return checkReactType(inner);
    }

    return {isReact: false};
}

/** 判断一个 symbol 的声明是否来自 react 包（node_modules/react） */
function isFromReact(symbol: MorphSymbol): boolean {
    const decls = symbol.getDeclarations?.() ?? [];
    for (const d of decls) {
        const sf = d.getSourceFile?.();
        if (!sf) continue;
        const path = sf.getFilePath();
        if (path.includes("node_modules") && path.match(/[/\\]react(\/|\\|$)/)) return true;
    }
    return false;
}






