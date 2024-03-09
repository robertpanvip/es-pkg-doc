import fs from 'node:fs';
import path from 'node:path';
const appDirectory = fs.realpathSync(process.cwd());
export const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath);

export const getJson = (relativePath: string) => {
    try {
        return JSON.parse(fs.readFileSync(resolveApp(relativePath), 'utf-8'))
    } catch (err) {
        return {}
    }
}
export const packageJson = getJson('package.json')