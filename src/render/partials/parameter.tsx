import { classNames, getKindClass, wbr } from "../utils/lib";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
import { DeclarationReflection, ReflectionType } from "typedoc";
import { JSX } from "../jsx";
export const parameter = (context: DefaultThemeRenderContext, props: DeclarationReflection) => (
    <>
        <ul class="tsd-parameters">
            {!!props.signatures && (
                <li class="tsd-parameter-signature">
                    <ul class={classNames({ "tsd-signatures": true }, context.getReflectionClasses(props))}>
                        {props.signatures.map((item) => (
                            <>
                                <li class="tsd-signature" id={item.anchor}>
                                    {context.memberSignatureTitle(item, {
                                        hideName: true,
                                    })}
                                </li>
                                <li class="tsd-description">
                                    {context.memberSignatureBody(item, {
                                        hideSources: true,
                                    })}
                                </li>
                            </>
                        ))}
                    </ul>
                </li>
            )}
            {!!props.indexSignature && (
                <>
                    <li class="tsd-parameter-index-signature">
                        <h5>
                            <span class="tsd-signature-symbol">[</span>
                            {props.indexSignature?.parameters?.map((item) => (
                                <>
                                    {!!item.flags.isRest && <span class="tsd-signature-symbol">...</span>}
                                    <span class={getKindClass(item)}>{item.name}</span>
                                    {": "}
                                    {context.type(item.type)}
                                </>
                            ))}
                            <span class="tsd-signature-symbol">{"]: "}</span>
                            {context.type(props.indexSignature.type)}
                        </h5>
                        {context.commentSummary(props.indexSignature)}
                        {context.commentTags(props.indexSignature)}
                        {props.indexSignature.type instanceof ReflectionType &&
                            context.parameter(props.indexSignature.type.declaration)}
                    </li>
                </>
            )}
            {props.children?.map((item) => (
                <>
                    {item.signatures ? (
                        <li class="tsd-parameter">
                            <h5>
                                {!!item.flags.isRest && <span class="tsd-signature-symbol">...</span>}
                                <span class={getKindClass(item)}>{wbr(item.name)}</span>
                                <span class="tsd-signature-symbol">{!!item.flags.isOptional && "?"}:</span>
                                function
                            </h5>

                            {context.memberSignatures(item)}
                        </li>
                    ) : item.type ? (
                        <>
                            {/* standard type */}
                            <li class="tsd-parameter">
                                <h5>
                                    {context.reflectionFlags(item)}
                                    {!!item.flags.isRest && <span class="tsd-signature-symbol">...</span>}
                                    <span class={getKindClass(item)}>{wbr(item.name)}</span>
                                    <span class="tsd-signature-symbol">
                                        {!!item.flags.isOptional && "?"}
                                        {": "}
                                    </span>
                                    {context.type(item.type)}
                                </h5>
                                {context.commentSummary(item)}
                                {context.commentTags(item)}
                                {!!item.children && context.parameter(item)}
                                {item.type instanceof ReflectionType && context.parameter(item.type.declaration)}
                            </li>
                        </>
                    ) : (
                        <>
                            {/* getter/setter */}
                            {item.getSignature && (
                                <>
                                    {/* getter */}
                                    <li class="tsd-parameter">
                                        <h5>
                                            {context.reflectionFlags(item.getSignature)}
                                            <span class="tsd-signature-keyword">get </span>
                                            <span class={getKindClass(item)}>{wbr(item.name)}</span>
                                            <span class="tsd-signature-symbol">(): </span>
                                            {context.type(item.getSignature.type)}
                                        </h5>

                                        {context.commentSummary(item.getSignature)}
                                        {context.commentTags(item.getSignature)}
                                    </li>
                                </>
                            )}
                            {item.setSignature && (
                                <>
                                    {/* setter */}
                                    <li class="tsd-parameter">
                                        <h5>
                                            {context.reflectionFlags(item.setSignature)}
                                            <span class="tsd-signature-keyword">set </span>
                                            <span class={getKindClass(item)}>{wbr(item.name)}</span>
                                            <span class="tsd-signature-symbol">(</span>
                                            {item.setSignature.parameters?.map((item) => (
                                                <>
                                                    {item.name}
                                                    <span class="tsd-signature-symbol">: </span>
                                                    {context.type(item.type)}
                                                </>
                                            ))}
                                            <span class="tsd-signature-symbol">): </span>
                                            {context.type(item.setSignature.type)}
                                        </h5>

                                        {context.commentSummary(item.setSignature)}
                                        {context.commentTags(item.setSignature)}
                                    </li>
                                </>
                            )}
                        </>
                    )}
                </>
            ))}
        </ul>
    </>
);
