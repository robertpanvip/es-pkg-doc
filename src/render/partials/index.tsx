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
            🏠 Exports
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
                      : `https://img.shields.io/npm/v/${global.doc.name}?color=33cd56&logo=npm`
                  }
                  alt="NPM Version"
                  data-canonical-src={`https://img.shields.io/npm/v/${global.doc.name}?color=33cd56&amp;logo=npm`}
                  style="max-width: 100%;"
                />
              </a>
              &nbsp;&nbsp;
              <a
                style="margin-left:0.2em"
                href={`https://www.npmjs.com/package/${global.doc.name}`}
                rel="nofollow"
              >
                <img
                  src={
                    global.doc.icon
                      ? global.doc.icon
                      : `https://img.shields.io/npm/dm/${global.doc.name}.svg?style=flat-square`
                  }
                  alt="NPM Version"
                  data-canonical-src={`https://img.shields.io/npm/dm/${global.doc.name}.svg?style=flat-square`}
                  style="max-width: 100%;"
                />
              </a>
              &nbsp;&nbsp;
              <a
                style="margin-left:0.2em"
                href={`https://www.npmjs.com/package/${global.doc.name}`}
                rel="nofollow"
              >
                <img
                  src={`https://img.shields.io/npm/unpacked-size/${global.doc.name}?color=green`}
                  alt="unpacked size"
                  data-canonical-src={`https://img.shields.io/npm/unpacked-size/${global.doc.name}?color=green`}
                  style="max-width: 100%;"
                />
              </a>
              &nbsp;&nbsp;
              <a
                style="margin-left:0.2em"
                href={
                  global.doc.repository ??
                  `https://www.npmjs.com/package/${global.doc.name}`
                }
                rel="nofollow"
              >
                <img
                  src={`https://img.shields.io/badge/docs_by-${global.doc.author}-blue`}
                  alt="Author"
                  data-canonical-src={`https://img.shields.io/badge/docs_by-${global.doc.author}-blue`}
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
            {Array.isArray(global.doc.cases) &&
              global.doc.cases.length !== 0 && (
                <details class="tsd-index-content" open={true}>
                  <summary>
                    <h2 style="display:inline">
                      🔨 <strong>Usage</strong>
                    </h2>
                  </summary>
                  <p>
                    {Array.isArray(global.doc.cases) &&
                      global.doc.cases.map((item) => {
                        if (!item) {
                          return <></>;
                        }
                        return (
                          <>
                            <p class="tsd-panel-content">
                              <pre>
                                <code>{item}</code>
                              </pre>
                            </p>
                            <center>
                              <a href="https://code.juejin.cn/">🖥️</a>
                              <br />
                            </center>
                          </>
                        );
                      })}
                  </p>
                </details>
              )}
            {content}
          </div>
        </article>
      </section>
    </>
  );
}
