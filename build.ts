import path from 'node:path'
import doc, {DocOptions} from "./src";

const cwd = process.cwd();
const file = path.join(cwd, './components/index.tsx')
const config: DocOptions = {
    name: 'my-test',
    desc:'这是测试',
    tsconfig: path.join(cwd, './components/tsconfig.json'),
    entry: file,
    outDir: path.join(cwd, './components'),
    caseDir:path.join(cwd, './components/case'),
    outType:["html","md"]
}

doc(config).catch(console.log)
