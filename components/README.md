   

my-test
=======

这是测试

[![NPM Version](https://img.shields.io/npm/v/my-test?color=33cd56&logo=npm)](https://www.npmjs.com/package/my-test)  [![NPM Version](https://img.shields.io/npm/dm/my-test.svg?style=flat-square)](https://www.npmjs.com/package/my-test)  [![unpacked size](https://img.shields.io/npm/unpacked-size/my-test?color=green)](https://www.npmjs.com/package/my-test)  [![Author](https://img.shields.io/badge/docs_by-robertpanvip-blue)](https://github.com/robertpanvip/es-pkg-doc.git)

📦 **Installation**
-------------------

    npm install my-test

🔨 **Usage**
------------

    import React from 'react';
    import StretchResize from "my-test";
    function App() {
        return <StretchResize>123</StretchResize>
    }
    export default App

[🖥️](https://code.juejin.cn/)  
  

    import React from 'react';
    import StretchResize from "my-test";
    function App2() {
        return <StretchResize>123</StretchResize>
    }
    export default App2

[🖥️](https://code.juejin.cn/)

🏠 Exports
----------

### 

|参数|类型|
|---|---|
|💍TestEnum|`Enumerations`|
|📒ResizeProps1|`Interfaces`|
|🧷ResizeEnd|`Type Aliases`|
|🧷ResizeProps|`Type Aliases`|
|🎗️StretchResize2|`Functions`|
|🎗️default|`Functions`|

**💍Enumerations**
------------------

  
  

#### TestEnum

|参数|类型|说明|默认值|
|---|---|---|---|
|枚举1|: `0`|||
|枚举2|: `"test"`|||

**📒Interfaces**
----------------

  
  

xxxxcc  
  

#### ResizeProps1

|参数|类型|说明|默认值|
|---|---|---|---|
|children|?: `React.ReactNode`|||
|className|?: `string`|类名称|"fff"|
|enume|: `TestEnum`|枚举||
|is|?: `string`|最外面包裹的元素默认是div||
|minSize|?: `number` \| `Partial`<`MinSize`\>|宽度和高度的最小值||
|onResizeEnd|?: `ResizeEnd`<`void`\>|调整尺寸完成后的回调||
|⚠️style|?: `React.CSSProperties`|内联样式||
|type|?: `ResizeType` \| `ResizeType`\[\] \| `"all"`|哪些边允许调整||

**🧷Type Aliases**
------------------

  
  

#### ResizeEnd

<T\>: ((rect:`DOMRect`) => T)

  
  

sxx  
  

#### ResizeProps

|参数|类型|说明|默认值|
|---|---|---|---|
|children|?: `React.ReactNode`|||
|className|?: `string`|类名称||
|is|?: `string`|最外面包裹的元素|div|
|minSize|?: `Partial`<`MinSize`\> \| `number`|宽度和高度的最小值||
|onResizeEnd|?: `ResizeEnd`<`void`\>|调整尺寸完成后的回调||
|style|?: `React.CSSProperties`|内联样式||
|type|?: `ResizeType` \| `ResizeType`\[\] \| `"all"`|哪些边允许调整||

**🎗️Functions**
----------------

  
  

#### StretchResize2

*   StretchResize2(props:`ResizeProps`, context?:`any`): `React.ReactNode`

  
  

#### StretchResize

*   调整元素的宽高  
      
    
*   StretchResize(props:`ResizeProps`, context?:`any`): `React.ReactNode`