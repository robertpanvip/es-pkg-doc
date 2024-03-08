import {defineConfig, Plugin, createFilter} from 'vite'
import checker from 'vite-plugin-checker'

let babel;

async function loadBabel() {
    if (!babel) {
        babel = await import('@babel/core');
    }
    return babel;
}

const loadedPlugin = /* @__PURE__ */ new Map();

function loadPlugin(path) {
    const cached = loadedPlugin.get(path);
    if (cached)
        return cached;
    const promise = import(path).then((module) => {
        const value = module.default || module;
        loadedPlugin.set(path, value);
        return value;
    });
    loadedPlugin.set(path, promise);
    return promise;
}

const defaultIncludeRE = /\.[tj]sx?$/;
const tsRE = /\.tsx?$/;
function transform(opts = {include: undefined, exclude: undefined}): Plugin {
    const filter = createFilter(opts.include ?? defaultIncludeRE, opts.exclude);
    let projectRoot = process.cwd();
    let devBase = "/";
    return {
        name: "transform-jsx",
        enforce: 'pre',
        //apply: "serve",
        configResolved(config) {
            devBase = config.base;
            projectRoot = config.root;
        },
        transform: async (code, id, options) => {

            const babelOptions = {
                parserOpts:{}
            };

            const plugins = [
                await loadPlugin("@babel/plugin-transform-react-jsx-self"),
                await loadPlugin("@babel/plugin-transform-react-jsx-source")
            ]


            if (id.includes("/node_modules/"))
                return;
            const [filepath] = id.split("?");
            if (!filter(filepath))
                return;

            const parserPlugins = [];
            if (!filepath.endsWith(".ts")) {
                parserPlugins.push("jsx");
            }
            if (tsRE.test(filepath)) {
                parserPlugins.push("typescript");
            }
            const babel2 = await loadBabel();
            const result = await babel2.transformAsync(code, {
                root: projectRoot,
                filename: id,
                sourceFileName: filepath,
                retainLines: true,
                parserOpts: {
                    ...babelOptions.parserOpts,
                    sourceType: "module",
                    allowAwaitOutsideFunction: true,
                    plugins: parserPlugins
                },
                plugins,
                sourceMaps: true
            });
            if (result) {
                const code2 = result.code;
                return {code: code2, map: result.map};
            }
        }
    }
}

import { join } from "node:path";
// https://vitejs.dev/config/
export default defineConfig({
    resolve:{
      alias:{
          '@jsx/jsx-runtime.ts': join(process.cwd(), "/src/render/jsx/jsx-runtime.ts"),
      }
    },
    plugins: [transform(),checker({typescript: true})],
    esbuild: {
        jsxInject: `import * as JSX from '@jsx/jsx-runtime.ts'`
    }
})
