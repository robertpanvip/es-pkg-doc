import { classNames, renderName } from "../utils/lib";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
import { JSX } from "../jsx";
import type {
  ContainerReflection,
  ReflectionCategory,
  ReflectionGroup,
} from "typedoc";

function renderCategory(
  { urlTo, icons, getReflectionClasses }: DefaultThemeRenderContext,
  item: ReflectionCategory | ReflectionGroup,
  prependName = ""
) {
  return (
    <section class="tsd-index-section">
      {/* <h3 class="tsd-index-heading">
        {prependName ? `${prependName} - ${item.title}` : item.title}
      </h3>
      {item.description && (
        <div class="tsd-comment tsd-typography">
          <Raw html={markdown(item.description)} />
        </div>
      )} */}
      {item.children.map((child) => {
        return (
          <tr>
            <td>
              <a
                href={urlTo(child)}
                class={classNames(
                  {
                    "tsd-index-link": true,
                    deprecated: child.isDeprecated(),
                  },
                  getReflectionClasses(child)
                )}
              >
                {icons[child.kind]()}
                <span>{renderName(child)}</span>
              </a>
            </td>
            <td>
              <code>
                {prependName ? `${prependName} - ${item.title}` : item.title}
              </code>
            </td>
          </tr>
        );
      })}
      {/* <div class="tsd-index-list">
        {item.children.map((item) => (
          <>
            <a
              href={urlTo(item)}
              class={classNames(
                { "tsd-index-link": true, deprecated: item.isDeprecated() },
                getReflectionClasses(item)
              )}
            >
              {icons[item.kind]()}
              <span>{renderName(item)}</span>
            </a>
            {"\n"}
          </>
        ))}
      </div> */}
    </section>
  );
}

export function index(
  context: DefaultThemeRenderContext,
  props: ContainerReflection
) {
  let content: JSX.Element | JSX.Element[] = [];

  if (props.categories?.length) {
    content = props.categories.map((item) => renderCategory(context, item));
  } else if (props.groups?.length) {
    content = props.groups.flatMap((item) =>
      item.categories
        ? item.categories.map((item2) =>
            renderCategory(context, item2, item.title)
          )
        : renderCategory(context, item)
    );
  }

  //   Accordion is only needed if any children don't have their own document.
  if (
    [...(props.groups ?? []), ...(props.categories ?? [])].some(
      (category) => !category.allChildrenHaveOwnDocument()
    )
  ) {
    content = (
      <details class="tsd-index-content tsd-index-accordion" open={true}>
        <summary>
          <h2
            style="display:inline"
            role="button"
            aria-expanded="false"
            tabIndex={0}
          >
            👊 Exports
          </h2>
        </summary>
        <h3 class="tsd-panel-content">
          <table>
            <thead>
              <th>参数</th>
              <th>类型</th>
            </thead>
            <tbody>{content}</tbody>
          </table>
        </h3>
      </details>
    );
  } else {
    content = (
      <>
        <h2 class="tsd-index-heading uppercase">Index</h2>
        {content}
      </>
    );
  }

  return (
    <>
      <section class="tsd-panel-group tsd-index-group">
        <article>
          <div id="readme">
            <h1>{global.doc.name}</h1>
            <p>{global.doc.desc}</p>
            <p>
              <a
                href={`https://www.npmjs.com/package/${global.doc.name}`}
                rel="nofollow"
              >
                <img
                  src={
                    global.doc.icon
                      ? global.doc.icon
                      : `https://camo.githubusercontent.com/87e231f6c9c425b8388e50d5b37d2712ca941d75263a1f2cc0c4f3e277a5fe4f/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f65732d706b673f636f6c6f723d333363643536266c6f676f3d6e706d`
                  }
                  alt="NPM Version"
                  data-canonical-src={`https://img.shields.io/npm/v/${global.doc.name}?color=33cd56&amp;logo=npm`}
                  style="max-width: 100%;"
                />
              </a>
            </p>
            <details class="tsd-index-content" open={true}>
              <summary>
                <h2 style="display:inline">
                  📦 <strong>Installation</strong>
                </h2>
              </summary>
              <pre class="tsd-panel-content">
                <code>
                  <span class="pl-s1">npm</span>{" "}
                  <span class="pl-s1">install</span>{" "}
                  <span class="pl-s1">{global.doc.name}</span>
                </code>
              </pre>
            </details>
            <details class="tsd-index-content" open={true}>
              <summary>
                <h2 style="display:inline">
                  🔨 <strong>Usage</strong>
                </h2>
              </summary>
              <p class="tsd-panel-content">see demo</p>
            </details>
            {content}
          </div>
        </article>
      </section>
    </>
  );
}
