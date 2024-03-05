    Doc

[](#es-pkg)xxxx
===============

组件打包工具.

[![NPM Version](https://camo.githubusercontent.com/87e231f6c9c425b8388e50d5b37d2712ca941d75263a1f2cc0c4f3e277a5fe4f/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f65732d706b673f636f6c6f723d333363643536266c6f676f3d6e706d)](https://www.npmjs.com/package/es-pkg)

📦 **Installation**

npm install es\-pkg

🔨 **Usage**

see demo

##### 导出的内容

<table><thead><tr><th>参数</th><th>类型</th></tr></thead><tbody><tr><td>TestEnum</td><td>Enumerations</td></tr><tr><td>ResizeProps</td><td>Interfaces</td></tr><tr><td>ResizeProps1</td><td>Interfaces</td></tr><tr><td>ResizeEnd</td><td>Type Aliases</td></tr><tr><td>StretchResize2</td><td>Functions</td></tr><tr><td>default</td><td>Functions</td></tr></tbody></table>

Enumerations
------------

### TestEnum

<table><thead><tr><th>参数</th><th>类型</th><th>说明</th><th>默认值</th></tr></thead><tbody><tr><td>枚举1</td><td>: `0`</td><td></td><td></td></tr><tr><td>枚举2</td><td>: `"testr"`</td><td></td><td></td></tr></tbody></table>

Interfaces
----------

### ResizeProps

<table><thead><tr><th>参数</th><th>类型</th><th>说明</th><th>默认值</th></tr></thead><tbody><tr><td>children</td><td>?: `React.ReactNode`</td><td></td><td></td></tr><tr><td>className</td><td>?: `string`

</td><td>类名称</td><td></td></tr><tr><td>is</td><td>?: `string`

</td><td>最外面包裹的元素默认是div</td><td></td></tr><tr><td>minSize</td><td>?: `number` | `Partial`<`MinSize`\>

</td><td>宽度和高度的最小值</td><td></td></tr><tr><td>onResizeEnd</td><td>?: ResizeEnd<`void`\>

</td><td>调整尺寸完成后的回调</td><td></td></tr><tr><td>style</td><td>?: `React.CSSProperties`

</td><td>内联样式</td><td></td></tr><tr><td>type</td><td>?: `ResizeType` | `ResizeType`\[\] | `"all"`

</td><td>哪些边允许调整</td><td></td></tr></tbody></table>

### ResizeProps1

<table><thead><tr><th>参数</th><th>类型</th><th>说明</th><th>默认值</th></tr></thead><tbody><tr><td>children</td><td>?: `React.ReactNode`</td><td></td><td></td></tr><tr><td>className</td><td>?: `string`

#### Default

\`\`\`ts "123456" \`\`\`</td><td>类名称</td><td></td></tr><tr><td>enume</td><td>: TestEnum

</td><td>枚举</td><td></td></tr><tr><td>is</td><td>?: `string`

</td><td>最外面包裹的元素默认是div</td><td></td></tr><tr><td>minSize</td><td>?: `number` | `Partial`<`MinSize`\>

</td><td>宽度和高度的最小值</td><td></td></tr><tr><td>onResizeEnd</td><td>?: ResizeEnd<`void`\>

</td><td>调整尺寸完成后的回调</td><td></td></tr><tr><td>style</td><td>?: `React.CSSProperties`

#### Deprecated

已经废弃</td><td>内联样式</td><td></td></tr><tr><td>type</td><td>?: `ResizeType` | `ResizeType`\[\] | `"all"`

</td><td>哪些边允许调整</td><td></td></tr></tbody></table>

Type Aliases
------------

### ResizeEnd

<T\>: ((rect:`DOMRect`) => T)

Functions
---------

### StretchResize2

*   StretchResize2(props:ResizeProps, context?:`any`): `React.ReactNode`

### StretchResize

*   调整元素的宽高
    
*   StretchResize(props:ResizeProps, context?:`any`): `React.ReactNode`