import {DebugSource} from "@jsx/jsx-runtime.ts";
import {CodeDataAttribute} from "./utils/inspect.ts";

export type Fiber = {
    _debugSource: DebugSource;
    pendingProps?: CodeDataAttribute
    sibling:Fiber | null;
    return: Fiber | null;
    child:Fiber | null;
    type?: {
        displayName: string,
        name: string;
        $$typeof: symbol;
    }
}