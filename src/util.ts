import fs from 'node:fs'
import {resolveApp, pkg as packageJson} from '@es-pkg/config'

export const pkg = packageJson || {} as any

export function resolveAppPackageJson() {
    const json = JSON.parse(fs.readFileSync(resolveApp('package.json'), 'utf-8'))
    Object.assign(pkg, json)
    return json
}

/**
 * 对数组进行分组
 * @param array 要分组的数组
 * @param key 分组依据的键（可以是属性名字符串，或返回分组键的函数）
 * @returns 分组后的对象，键为分组依据的值，值为对应分组的数组元素
 */
export function groupBy<T, K extends string | number | symbol>(
    array: T[],
    key: keyof T | ((item: T) => K)
): Record<K, T[]> {
    // 初始化分组结果对象
    const result = {} as Record<K, T[]>;

    for (const item of array) {
        // 计算当前元素的分组键
        const groupKey = typeof key === 'function'
            ? key(item)  // 如果是函数，调用函数获取分组键
            : item[key] as unknown as K;  // 如果是属性名，直接取属性值

        // 如果分组键不存在，初始化空数组
        if (!result[groupKey]) {
            result[groupKey] = [];
        }

        // 将元素添加到对应分组
        result[groupKey].push(item);
    }

    return result;
}