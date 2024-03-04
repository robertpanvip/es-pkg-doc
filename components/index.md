    Doc

##### 导出的内容

### Interfaces

ResizeProps

### Functions

StretchResize2 default

Interfaces
----------

### ResizeProps

参数

说明

类型

默认值

children

?: `React.ReactNode`

className

类名称

?: `string`

is

最外面包裹的元素默认是div

?: `string`

minSize

宽度和高度的最小值

?: `number` | `Partial`<`MinSize`\>

onResizeEnd

调整尺寸完成后的回调

?: `ResizeEnd`<`void`\>

style

内联样式

?: `React.CSSProperties`

type

哪些边允许调整

?: `ResizeType` | `ResizeType`\[\] | `"all"`

Functions
---------

### StretchResize2

*   StretchResize2(props:ResizeProps, context?:`any`): `React.ReactNode`

### StretchResize

*   调整元素的宽高
    
*   StretchResize(props:ResizeProps, context?:`any`): `React.ReactNode`