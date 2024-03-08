import path from 'node:path'
/**
 * 判断一个路径是否在另外一个路径里面
 * @param childPath 
 * @param parentPath 
 * @returns 
 */
export function isPathInside(childPath: string, parentPath: string): boolean {
    const relativePath = path.relative(parentPath, childPath);
    return !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
}