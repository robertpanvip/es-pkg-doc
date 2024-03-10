import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
import type { DeclarationReflection } from "typedoc";
import { anchorIcon } from "./anchor-icon";
import { classNames } from "../utils/lib";
import { JSX } from "../jsx";
export const memberSignatures = (context: DefaultThemeRenderContext, props: DeclarationReflection) => (
    <>
        <ul class={classNames({ "tsd-signatures": true}, context.getReflectionClasses(props))}>
            {props.signatures?.map((item) => (
                <>
                    <li class="tsd-description">{context.memberSignatureBody(item)}</li>
                    <li class="tsd-signature tsd-anchor-link">
                        <a id={item.anchor} class="tsd-anchor"></a>
                        {context.memberSignatureTitle(item)}
                        {anchorIcon(context, item.anchor)}
                    </li>
                </>
            ))}
        </ul>
    </>
);
