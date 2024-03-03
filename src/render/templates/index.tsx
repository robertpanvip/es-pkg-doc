import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
import type { ProjectReflection } from "typedoc";
import type { PageEvent } from "typedoc";
import { Raw } from "../jsx";

export const indexTemplate = ({ markdown }: DefaultThemeRenderContext, props: PageEvent<ProjectReflection>) => (
    <div class="tsd-panel tsd-typography">
        <Raw html={markdown(props.model.readme || [])} />
    </div>
);
