import {DefaultThemeRenderContext} from "../DefaultThemeRenderContext.ts";
import { JSX } from "../jsx";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export function script(context: DefaultThemeRenderContext, script: ()=>void) {
    // 将函数转换为字符串
    const functionString = script.toString();
    // 使用正则表达式提取函数体
    const match = functionString.match(/\{([\s\S]*)\}/);
    // 获取提取的函数体
    const functionBody = match ? match[1].trim() : null;

    return <script>
        {functionBody}
    </script>
}