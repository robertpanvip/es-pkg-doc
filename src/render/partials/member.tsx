import { classNames, getDisplayName, wbr } from "../utils/lib";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
import { DeclarationReflection, ReferenceReflection } from "typedoc";
import { anchorIcon } from "./anchor-icon";

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
    result = context.memberDeclaration(props);
  }
  if (inTable) {
    return (
      <tr>
        <td>
          <span
            class={classNames({
              deprecated: props.isDeprecated(),
              "tsd-kind-property": true,
            })}
          >
            {wbr(props.escapedName || props.name)}
          </span>
        </td>
        <td>
          <a id={props.anchor} class="tsd-anchor"></a>
          {result}
        </td>
        <td>{context.commentSummary(props)}</td>
        <td>{props.defaultValue}</td>
      </tr>
    );
  }

  return (
    <section
      class={classNames(
        { "tsd-panel": true, "tsd-member": true },
        context.getReflectionClasses(props)
      )}
    >
      <div class="tsd-panel-content">
        <a id={props.anchor} class="tsd-anchor"></a>
        {!!props.name && (
          <h3 class="tsd-anchor-link">
            {context.reflectionFlags(props)}
            <span class={classNames({ deprecated: props.isDeprecated() })}>
              {wbr(props.escapedName || props.name)}
            </span>
            {anchorIcon(context, props.anchor)}
          </h3>
        )}
        {result}
        {props.groups && (
          <table>
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
        )}
      </div>
    </section>
  );
}
