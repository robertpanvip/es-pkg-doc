import path from 'node:path'
import bootstrap, {DocOptions} from "./src/doc.ts";

const cwd = process.cwd();
const file = path.join(cwd, './src/doc.ts')

const config: DocOptions = {
    name: '@es-pkg/doc',
    desc:'这是测试',
    tsconfig: path.join(cwd, './tsconfig.json'),
    entry: file,
    outDir: path.join(cwd, './'),
}

bootstrap(config).catch(console.log)
