import {classNames, getDisplayName, wbr} from "../utils/lib";
import type {DefaultThemeRenderContext} from "../DefaultThemeRenderContext";
import {DeclarationReflection, ReferenceReflection, ReflectionType} from "typedoc";
import {anchorIcon} from "./anchor-icon";
import {JSX} from "../jsx";
import {commentSummary} from "./comment";

function defaultValue(props: DeclarationReflection) {
    const value = props.comment?.blockTags.filter(
        (tag) => ["@default", "@defaultValue"].includes(tag.tag)
    );
    if (props.defaultValue) {
        return props.defaultValue;
    }
    return value
        ?.flatMap((value) => value.content.map((item) => {
            const text = item.text;
            const matches = text?.match(/```ts\s*(.*?)\s*```/)
            return matches?.[1] || ""
        }))
        .join("");
}

function renderTable(
    context: DefaultThemeRenderContext,
    props: DeclarationReflection,
) {
    return <table>
        <thead>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>说明</th>
            <th>默认值</th>
        </tr>
        </thead>
        <tbody>
        {props.groups?.map((item) =>
            item.children.map(
                (item) => !item.hasOwnDocument && context.member(item, true)
            )
        )}
        </tbody>
    </table>
}

export function member(
    context: DefaultThemeRenderContext,
    props: DeclarationReflection,
    inTable: boolean = false
) {
    context.page.pageHeadings.push({
        link: `#${props.anchor}`,
        text: getDisplayName(props),
        kind: props.kind,
        classes: context.getReflectionClasses(props),
    });

    let result;
    if (props.signatures) {
        result = context.memberSignatures(props);
    } else if (props.hasGetterOrSetter()) {
        result = context.memberGetterSetter(props);
    } else if (props instanceof ReferenceReflection) {
        result = context.memberReference(props);
    } else {
        if (props.type?.type !== 'union' && props.type instanceof ReflectionType) {
            if (props.type.declaration.children?.length) {
                result = renderTable(context, props.type.declaration)
            }else{
                result = context.memberDeclaration(props);
            }
        } else {
            result = context.memberDeclaration(props);
        }
    }
    if (inTable) {
        return (
            <tr>
                <td>
                    {props.isDeprecated() ? (
                        <del class="tsd-kind-property">
                            ⚠️{wbr(props.escapedName || props.name)}
                        </del>
                    ) : (
                        <span
                            class={classNames({
                                deprecated: props.isDeprecated(),
                                "tsd-kind-property": true,
                            })}
                        >
              {wbr(props.escapedName || props.name)}
            </span>
                    )}
                </td>
                <td>
                    <a id={props.anchor} class="tsd-anchor"></a>
                    {result}
                </td>
                <td>{context.commentSummary(props)}</td>
                <td>{defaultValue(props)}</td>
            </tr>
        );
    }

    return (
        <section
            class={classNames(
                {"tsd-panel": true, "tsd-member": true},
                context.getReflectionClasses(props)
            )}
        >
            <div class="tsd-panel-content">
                <br/>
                {commentSummary(context, props)}
                {!!props.name && (
                    <h4 class="tsd-anchor-link">
                        <a id={props.anchor} class="tsd-anchor"></a>
                        {context.reflectionFlags(props)}
                        <span class={classNames({deprecated: props.isDeprecated()})}>
                             {wbr(props.escapedName || props.name)}
                         </span>
                        {anchorIcon(context, props.anchor)}
                    </h4>
                )}
                {result}
                {props.groups && (
                    renderTable(context, props)
                )}
            </div>
        </section>
    );
}
