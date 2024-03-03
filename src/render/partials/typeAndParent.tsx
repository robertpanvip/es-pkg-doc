import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
import { ArrayType, ReferenceType, SignatureReflection, Type } from "typedoc";
import { JSX } from "../jsx";

export const typeAndParent = (context: DefaultThemeRenderContext, props: Type): JSX.Element => {
    if (!props) return <>void</>;

    if (props instanceof ArrayType) {
        return (
            <>
                {context.typeAndParent(props.elementType)}
                []
            </>
        );
    }

    if (props instanceof ReferenceType && props.reflection) {
        const refl = props.reflection instanceof SignatureReflection ? props.reflection.parent : props.reflection;
        const parent = refl?.parent;

        return (
            <>
                {parent?.url ? <a href={context.urlTo(parent)}>{parent.name}</a> : parent?.name}.
                {refl?.url ? <a href={context.urlTo(refl)}>{refl.name}</a> : refl?.name}
            </>
        );
    }

    return <>{props.toString()}</>;
};
