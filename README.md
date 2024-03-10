   

@es-pkg/doc
===========

根据ts文件的注释生成表格md

[![NPM Version](https://img.shields.io/npm/v/@es-pkg/doc?color=33cd56&logo=npm)](https://www.npmjs.com/package/@es-pkg/doc)[![NPM Version](https://img.shields.io/npm/dm/@es-pkg/doc.svg?style=flat-square)](https://www.npmjs.com/package/@es-pkg/doc)[![unpacked size](https://img.shields.io/npm/unpacked-size/@es-pkg/doc?color=green)](https://www.npmjs.com/package/@es-pkg/doc)[![Author](https://img.shields.io/badge/docs_by-robertpanvip-blue)](https://github.com/robertpanvip/es-pkg-doc.git)

📦 **Installation**
-------------------

    npm install @es-pkg/doc

🔨 **Usage**
------------

🏠 Exports
----------

### 

|参数|类型|
|---|---|
|🔖default|`References`|
|📒DocOptions|`Interfaces`|
|🎗️bootstrap|`Functions`|

🔖**References**


--------------------

#### default

Renames and re-exports bootstrap

📒**Interfaces**


--------------------

#### DocOptions

|参数|类型|说明|默认值|
|---|---|---|---|
|author|?: `string`|作者||
|caseDir|?: `string`|生成用法 例子的目录|\`\`\`ts case \`\`\`|
|desc|?: `string`|描述||
|entry|: `string`|编译文件的入口||
|keepHtmlTable|?: `boolean`|是否保留为原始htmlTable|\`\`\`ts false \`\`\`|
|name|?: `string`|包名称||
|outDir|: `string`|编译后输出的文件夹||
|outName|?: `string`|编译后输出的文件名称|\`\`\`ts README \`\`\`|
|outType|?: `"html"` \| `"md"` \| \[`"html"`, `"md"`\]|编译后输出的类型|\`\`\`ts md \`\`\`|
|repository|?: `string`|仓库地址||
|tsconfig|?: `string`|编译文件的 ts配置路径||

🎗️**Functions**


--------------------

#### bootstrap

*   默认 EsPkgDoc的主函数
    
      
*   bootstrap(config:DocOptions): `Promise`<`void`\>