import {DebugSource} from "../jsx";
import {CodeDataAttribute} from "./utils/inspect";

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