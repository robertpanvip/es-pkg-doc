import {JsxNode} from "../jsx/jsx-runtime.ts";
import { JSX } from "../jsx";
export interface InspectorProps {
    children?: JsxNode
}

export const Inspector = (props: InspectorProps) => {
    const {children} = props
    return <>
        {children}
    </>
}