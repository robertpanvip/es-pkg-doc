import type {DefaultThemeRenderContext} from "../DefaultThemeRenderContext";
import {Raw} from "../jsx";
import {Reflection, ReflectionKind} from "typedoc";
import {camelToTitleCase} from "../utils/lib";
import {JSX} from "../jsx";

// Note: Comment modifiers are handled in `renderFlags`

export function commentSummary(
    {markdown}: DefaultThemeRenderContext,
    props: Reflection
) {
    if (!props.comment?.summary.some((part) => part.text)) return;

    return (
        <div class="tsd-comment tsd-typography">
            <Raw html={markdown(props.comment.summary)}/>
            <br/>
        </div>
    );
}

export function commentTags(
    {markdown}: DefaultThemeRenderContext,
    props: Reflection
) {
    if (!props.comment) return;

    const tags = props.kindOf(ReflectionKind.SomeSignature)
        ? props.comment.blockTags.filter((tag) => tag.tag !== "@returns")
        : props.comment.blockTags;
    if (!tags.length) {
        return <></>
    }

    return (
        <span class="tsd-comment tsd-typography">
            &nbsp;&nbsp;
            {tags.map((item) => {
                /* const name = item.name
                     ? `${camelToTitleCase(item.tag.substring(1))}: ${item.name}`
                     : camelToTitleCase(item.tag.substring(1));*/
                return (
                    <>
                        <code>
                            {/* <code>{name}</code>*/}
                            <Raw html={markdown(item.content)}/>
                        </code>
                    </>

                );
            })}
        </span>
    );
}

const flagsNotRendered: `@${string}`[] = [
    "@showCategories",
    "@showGroups",
    "@hideCategories",
    "@hideGroups",
];

export function reflectionFlags(
    _context: DefaultThemeRenderContext,
    props: Reflection
) {
    const allFlags = [...props.flags];
    if (props.comment) {
        for (const tag of props.comment.modifierTags) {
            if (!flagsNotRendered.includes(tag)) {
                allFlags.push(camelToTitleCase(tag.substring(1)));
            }
        }
    }

    return (
        <>
            {allFlags.map((item) => (
                <>
                    <code class={"tsd-tag ts-flag" + item}>{item}</code>{" "}
                </>
            ))}
        </>
    );
}
