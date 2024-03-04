import {getKindClass, join, renderTypeParametersSignature, wbr} from "../utils/lib";
import type {DefaultThemeRenderContext} from "../DefaultThemeRenderContext";
import {ParameterReflection, ReflectionKind, SignatureReflection} from "typedoc";

function renderParameterWithType(context: DefaultThemeRenderContext, item: ParameterReflection) {
    return (
        <>
            {!!item.flags.isRest && <span class="tsd-signature-symbol">...</span>}
            <span class="tsd-kind-parameter">{item.name}</span>
            <span class="tsd-signature-symbol">
                {!!item.flags.isOptional && "?"}
                {!!item.defaultValue && "?"}
                {": "}
            </span>
            {context.type(item.type)}
        </>
    );
}

function renderParameterWithoutType(item: ParameterReflection, context: DefaultThemeRenderContext) {
    return (
        <>
            {!!item.flags.isRest && <span class="tsd-signature-symbol">...</span>}
            <span class="tsd-kind-parameter">{item.name}</span>
            {(item.flags.isOptional || item.defaultValue) && <span class="tsd-signature-symbol">?</span>}
            :{context.type(item.type)}
        </>
    );
}

export function memberSignatureTitle(
    context: DefaultThemeRenderContext,
    props: SignatureReflection,
    {hideName = false, arrowStyle = false}: { hideName?: boolean; arrowStyle?: boolean } = {},
) {
    const hideParamTypes = context.options.getValue("hideParameterTypesInTitle");
    const renderParam = hideParamTypes ? (item: ParameterReflection) => renderParameterWithoutType(item, context) : renderParameterWithType.bind(null, context);
    const name = props.name === 'default' ? (props.parent?.escapedName || props.name) : props.name
    return (
        <>
            {!hideName ? (
                <span class={getKindClass(props)}>{wbr(name)}</span>
            ) : (
                <>
                    {props.kind === ReflectionKind.ConstructorSignature && (
                        <>
                            {!!props.flags.isAbstract && <span class="tsd-signature-keyword">abstract </span>}
                            <span class="tsd-signature-keyword">new </span>
                        </>
                    )}
                </>
            )}
            {renderTypeParametersSignature(context, props.typeParameters)}
            <span class="tsd-signature-symbol">(</span>
            {join(", ", props.parameters ?? [], renderParam)}
            <span class="tsd-signature-symbol">)</span>
            {!!props.type && (
                <>
                    <span class="tsd-signature-symbol">{arrowStyle ? " => " : ": "}</span>
                    {context.type(props.type)}
                </>
            )}
        </>
    );
}
