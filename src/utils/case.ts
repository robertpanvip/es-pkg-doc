import path from 'node:path';
import fs from 'node:fs';
import {resolveDefaultFile} from "../render/utils/paths";
import log from "./log";

function parseImports(fileContent: string) {
    // 读取文件内容

    // 使用正则匹配导入语句
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    const imports = [];
    let match;

    while ((match = importRegex.exec(fileContent)) !== null) {
        imports.push(match[1]);
    }


    {
        // 使用正则匹配 require 语句
        const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
        const requires = [];
        let match;

        while ((match = requireRegex.exec(fileContent)) !== null) {
            requires.push(match[1]);
        }
        imports.push(...requires)
    }

    return imports;
}

function readDirectory(directoryPath: string) {
    // 读取目录内容
    const files = fs.readdirSync(directoryPath);

    // 生成一个包含文件名的数组
    return files.map((file) => {
        const filePath = path.join(directoryPath, file);
        const isDirectory = fs.statSync(filePath).isDirectory()
        return {
            name: file,
            fullPath: filePath,
            isDirectory,
            content: isDirectory ? "" : fs.readFileSync(filePath, "utf8")
        };
    });
}

export function genCases(dir: string, name: string, parse: string): string[] {
    if (fs.existsSync(dir)) {
        const stat = fs.statSync(dir);
        const contents: { content: string, isDirectory: boolean, original: string, fullPath: string }[] = [];
        if (stat.isDirectory()) {
            const dirContents = readDirectory(dir);
            dirContents.forEach(item => {
                const content = item.content;
                const imports = parseImports(content);
                let _content = content
                imports.forEach(match => {
                    const requirePath = path.resolve(path.join(item.fullPath, '../',match));
                    const realRequirePath = resolveDefaultFile(requirePath)
                    if (realRequirePath === parse) {
                        _content = _content.replaceAll(match, name)
                    }
                })
                contents.push({
                    fullPath: item.fullPath,
                    isDirectory: item.isDirectory,
                    content: _content,
                    original: content
                })
            })
        } else {
            const content = fs.readFileSync(dir, 'utf8');
            const imports = parseImports(content);
            let _content = content;
            imports.forEach(match => {
                const requirePath = path.join(dir, match)
                if (requirePath === parse) {
                    _content = _content.replaceAll(match, name)
                }
            })
            contents.push({
                fullPath: dir,
                isDirectory: false,
                content: _content,
                original: content
            })
        }

        return contents
            .filter(item => !item.isDirectory)
            .map(item => `${item.content}`)
    } else {
        log.error(dir + "不存在")
    }
    return []
}