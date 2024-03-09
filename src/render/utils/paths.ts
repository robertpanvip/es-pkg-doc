import {isAbsolute, relative} from "node:path";
import path from 'node:path'
import fs from 'node:fs'

export function nicePath(absPath: string) {
    if (!isAbsolute(absPath)) return absPath;

    const relativePath = relative(process.cwd(), absPath);
    if (relativePath.startsWith("..")) {
        return normalizePath(absPath);
    }
    return `./${normalizePath(relativePath)}`;
}

/**
 * Normalize the given path.
 *
 * @param path  The path that should be normalized.
 * @returns The normalized path.
 */
export function normalizePath(path: string) {
    return path.replace(/\\/g, "/");
}


export function resolveDefaultFile(filePath: string): string {
    try {
        let isDirectory = false;
        try {
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                // 如果是目录，则追加默认的文件名
                filePath = path.join(filePath, 'index');
                isDirectory = true
            }
        } catch (e) { /* empty */
        }


        // 获取文件扩展名
        const extension = path.extname(filePath).toLowerCase();
        if (!extension.includes('.')) {
            // 如果没有扩展名，尝试添加默认的扩展名
            const availableExtensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.html','.mjs','.cjs'];
            let foundExtension = '';

            for (const ext of availableExtensions) {
                const fullPath = `${filePath}${ext}`;
                try {
                    fs.statSync(fullPath);
                    foundExtension = ext;
                    break;
                } catch (e) {
                    // 文件不存在，继续循环
                }
            }

            // 如果找到合适的扩展名，则追加到文件路径上
            if (foundExtension) {
                filePath = path.resolve(`${filePath}${isDirectory ? "index" : ""}${foundExtension}`);
            }
        }

        return filePath;
    } catch (error) {
        console.error(`Error resolving path for ${filePath}: ${(error as Error).message}`);
        return filePath;
    }
}