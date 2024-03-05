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
              {prependName ? `${prependName} - ${item.title}` : item.title}
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
        <summary class="tsd-accordion-summary tsd-index-summary">
          <h5
            class="tsd-index-heading uppercase"
            role="button"
            aria-expanded="false"
            tabIndex={0}
          >
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
        <article>
          <div id="readme">
            <h1>
              <a
                id="user-content-es-pkg"
                class="anchor"
                aria-hidden="true"
                href="#es-pkg"
              >
                <svg
                  aria-hidden="true"
                  class="octicon octicon-link"
                  viewBox="0 0 16 16"
                  width="16"
                  height="16"
                  fill="currentColor"
                  style="display:inline-block;user-select:none;vertical-align:middle"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"
                  ></path>
                </svg>
              </a>
              xxxx
            </h1>
            <p>组件打包工具.</p>
            <p>
              <a href="https://www.npmjs.com/package/es-pkg" rel="nofollow">
                <img
                  src="https://camo.githubusercontent.com/87e231f6c9c425b8388e50d5b37d2712ca941d75263a1f2cc0c4f3e277a5fe4f/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f65732d706b673f636f6c6f723d333363643536266c6f676f3d6e706d"
                  alt="NPM Version"
                  data-canonical-src="https://img.shields.io/npm/v/es-pkg?color=33cd56&amp;logo=npm"
                  style="max-width: 100%;"
                />
              </a>
            </p>
            <p>
              📦 <strong>Installation</strong>
            </p>
            <div class="highlight highlight-source-js">
              <pre>
                <span class="pl-s1">npm</span>{" "}
                <span class="pl-s1">install</span> <span class="pl-s1">es</span>
                <span class="pl-c1">-</span>
                <span class="pl-s1">pkg</span>
              </pre>
            </div>
            <p>
              🔨 <strong>Usage</strong>
            </p>
            <p>see demo</p>
          </div>
        </article>
        <section class="tsd-panel tsd-index-panel">
          <table>
            <thead>
              <th>参数</th>
              <th>类型</th>
            </thead>
            <tbody>{content}</tbody>
          </table>
        </section>
      </section>
    </>
  );
}
