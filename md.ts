import path from 'node:path'
import bootstrap, {DocOptions} from "./src/doc";
import json from "./package.json"
import {resolveAppPackageJson} from "./src/util";

const cwd = process.cwd();
const file = path.join(cwd, './src/index.ts')

const config: DocOptions = {
    name: '@es-pkg/doc',
    desc: json.description,
    tsconfig: path.join(cwd, './tsconfig.json'),
    entry: file,
    outDir: path.join(cwd, './'),
}
resolveAppPackageJson();
bootstrap(config)
