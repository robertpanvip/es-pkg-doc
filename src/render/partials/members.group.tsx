import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
import type { ReflectionGroup } from "typedoc";
import { icons } from "./icon";

export function membersGroup(
  context: DefaultThemeRenderContext,
  group: ReflectionGroup
) {
  if (group.categories) {
    return (
      <>
        {group.categories.map((item) => (
          <section class="tsd-panel-group tsd-member-group">
            <h2>
              {group.title}
              {!!item.title && <> - {item.title}</>}
            </h2>
            {item.children.map(
              (item) => !item.hasOwnDocument && context.member(item)
            )}
          </section>
        ))}
      </>
    );
  }

  return (
    <details class="tsd-panel-group tsd-member-group" open={true}>
      <summary>
        <h2 style="display:inline" role="button" aria-expanded="false">
          {icons[group.owningReflection.kind]()}
          <strong>{group.title}</strong>
        </h2>
      </summary>
      {group.children.map(
        (item) => !item.hasOwnDocument && context.member(item)
      )}
    </details>
  );
}
