import path from 'node:path'
import bootstrap, {DocOptions} from "./src/index.ts";
import json from "./package.json"

const cwd = process.cwd();
const file = path.join(cwd, './src/index.ts')

const config: DocOptions = {
    name: '@es-pkg/doc',
    desc: json.description,
    tsconfig: path.join(cwd, './tsconfig.json'),
    entry: file,
    outDir: path.join(cwd, './'),
}

bootstrap(config).catch(console.log)
