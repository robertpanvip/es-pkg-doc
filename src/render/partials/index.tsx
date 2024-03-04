import { classNames, renderName } from "../utils/lib";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
import { JSX, Raw } from "../jsx";
import type { ContainerReflection, ReflectionCategory, ReflectionGroup } from "typedoc";

function renderCategory(
    { urlTo, icons, getReflectionClasses, markdown }: DefaultThemeRenderContext,
    item: ReflectionCategory | ReflectionGroup,
    prependName = "",
) {
    return (
        <section class="tsd-index-section">
            <h3 class="tsd-index-heading">{prependName ? `${prependName} - ${item.title}` : item.title}</h3>
            {item.description && (
                <div class="tsd-comment tsd-typography">
                    <Raw html={markdown(item.description)} />
                </div>
            )}
            <div class="tsd-index-list">
                {item.children.map((item) => (
                    <>
                        <a
                            href={urlTo(item)}
                            class={classNames(
                                { "tsd-index-link": true, deprecated: item.isDeprecated() },
                                getReflectionClasses(item),
                            )}
                        >
                            {icons[item.kind]()}
                            <span>{renderName(item)}</span>
                        </a>
                        {"\n"}
                    </>
                ))}
            </div>
        </section>
    );
}

export function index(context: DefaultThemeRenderContext, props: ContainerReflection) {
    let content: JSX.Element | JSX.Element[] = [];

    if (props.categories?.length) {
        content = props.categories.map((item) => renderCategory(context, item));
    } else if (props.groups?.length) {
        content = props.groups.flatMap((item) =>
            item.categories
                ? item.categories.map((item2) => renderCategory(context, item2, item.title))
                : renderCategory(context, item),
        );
    }

    // Accordion is only needed if any children don't have their own document.
    if (
        [...(props.groups ?? []), ...(props.categories ?? [])].some(
            (category) => !category.allChildrenHaveOwnDocument(),
        )
    ) {
        content = (
            <details class="tsd-index-content tsd-index-accordion" open={true}>
                <summary class="tsd-accordion-summary tsd-index-summary">
                    <h5 class="tsd-index-heading uppercase" role="button" aria-expanded="false" tabIndex={0}>
                        {context.icons.chevronSmall()} 导出的内容
                    </h5>
                </summary>
                <div class="tsd-accordion-details">{content}</div>
            </details>
        );
    } else {
        content = (
            <>
                <h3 class="tsd-index-heading uppercase">Index</h3>
                {content}
            </>
        );
    }

    return (
        <>
            <section class="tsd-panel-group tsd-index-group">
                <section class="tsd-panel tsd-index-panel">{content}</section>
            </section>
        </>
    );
}
