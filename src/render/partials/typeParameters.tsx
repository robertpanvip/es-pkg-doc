import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
import type { TypeParameterReflection } from "typedoc";
import { JSX } from "../jsx";
export function typeParameters(context: DefaultThemeRenderContext, typeParameters: TypeParameterReflection[]) {
    return (
        <>
            <section class="tsd-panel">
                <h4>Type Parameters</h4>
                <ul class="tsd-type-parameter-list">
                    {typeParameters?.map((item) => (
                        <li>
                            <span>
                                <a id={item.anchor} class="tsd-anchor"></a>
                                {item.flags.isConst && <span class="tsd-signature-keyword">const </span>}
                                {item.varianceModifier && (
                                    <span class="tsd-signature-keyword">{item.varianceModifier} </span>
                                )}
                                <span class="tsd-kind-type-parameter">{item.name}</span>
                                {!!item.type && (
                                    <>
                                        <span class="tsd-signature-keyword"> extends </span>
                                        {context.type(item.type)}
                                    </>
                                )}
                                {!!item.default && (
                                    <>
                                        {" = "}
                                        {context.type(item.default)}
                                    </>
                                )}
                            </span>
                            {context.commentSummary(item)}
                            {context.commentTags(item)}
                        </li>
                    ))}
                </ul>
            </section>
        </>
    );
}
