/// <reference types="vite/client" />


declare const global: {
    JSX: any
    Auth: number;
    doc: {
        name: string;
        desc?:string;
        icon?:string;
        author?:string;
        repository?:string
        cases?:string[]
    }
};
declare module 'global' {
    import type {DebugInfo} from "@jsx/jsx-runtime.ts";
    declare global {
        interface Window {
            /**
             * @import { DevToolsHook } from 'https://github.com/facebook/react/blob/v16.13.1/packages/react-devtools-shared/src/backend/types.js'
             * @type DevToolsHook
             */
            __REACT_DEVTOOLS_GLOBAL_HOOK__: any,

            __REACT_DEVTOOLS_TARGET_WINDOW__: Window,

            /**
             * toggle whether react-dev-inspector start or stop
             * @deprecated only for debug, will remove in next version
             */
            __REACT_DEV_INSPECTOR_TOGGLE__?: () => void,
            debug: { [key: string]: DebugInfo };
        }
    }
}
declare module 'launch-editor-middleware' {
    const plugin: any
    export = plugin
}