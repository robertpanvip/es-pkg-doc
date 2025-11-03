import path from 'node:path'
import {setup} from "./src/doc";
import {DocOptions} from "./src/type";
import {resolveAppPackageJson} from "./src/util";

const cwd = process.cwd();
const file = path.join(cwd, './components/index.tsx')
const config: DocOptions = {
    name: 'my-test',
    desc: '这是测试',
    tsconfig: path.join(cwd, './components/tsconfig.json'),
    entry: file,
    outDir: path.join(cwd, './components'),
    outType: ["html", "md"]
}
resolveAppPackageJson();
const md = setup(config);
console.log(md);
