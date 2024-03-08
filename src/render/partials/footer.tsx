import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
import { JSX } from "../jsx";
export function footer(context: DefaultThemeRenderContext) {
    const hideGenerator = context.options.getValue("hideGenerator");
    if (!hideGenerator)
        return (
            <div class="tsd-generator">
                <p>
                    {"Generated using "}
                    <a href="https://typedoc.org/" target="_blank">
                        TypeDoc
                    </a>
                </p>
            </div>
        );
}
