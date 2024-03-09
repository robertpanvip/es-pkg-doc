   

my-test
=======

这是测试

[![NPM Version](https://img.shields.io/npm/v/my-test?color=33cd56&logo=npm)](https://www.npmjs.com/package/my-test)[![NPM Version](https://img.shields.io/npm/dm/my-test.svg?style=flat-square)](https://www.npmjs.com/package/my-test)[![unpacked size](https://img.shields.io/npm/unpacked-size/my-test?color=green)](https://www.npmjs.com/package/my-test)[![Author](https://img.shields.io/badge/docs_by-robertpanvip-blue)](https://github.com/robertpanvip/es-pkg-doc.git)

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

  
  

------

    import React from 'react';
    import StretchResize from "my-test";
    function App2() {
        return <StretchResize>123</StretchResize>
    }
    export default App2

🏠 Exports
----------

### 

<table><thead><tr><th>参数</th><th>类型</th></tr></thead><tbody><tr><td><a href="" class="tsd-index-link">💍<span>TestEnum</span></a></td><td><code>Enumerations</code></td></tr><tr><td><a href="" class="tsd-index-link">📒<span>ResizeProps</span></a></td><td><code>Interfaces</code></td></tr><tr><td><a href="" class="tsd-index-link">📒<span>ResizeProps1</span></a></td><td><code>Interfaces</code></td></tr><tr><td><a href="" class="tsd-index-link">🧷<span>ResizeEnd</span></a></td><td><code>Type Aliases</code></td></tr><tr><td><a href="" class="tsd-index-link">🎗️<span>StretchResize2</span></a></td><td><code>Functions</code></td></tr><tr><td><a href="" class="tsd-index-link">🎗️<span>default</span></a></td><td><code>Functions</code></td></tr></tbody></table>

💍**Enumerations**


----------------------

#### TestEnum

<table><thead><tr><th>参数</th><th>类型</th><th>说明</th><th>默认值</th></tr></thead><tbody><tr><td><span class="tsd-kind-property">枚举1</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">:</span> <code class="tsd-signature-type">0</code></div></td><td></td><td></td></tr><tr><td><span class="tsd-kind-property">枚举2</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">:</span> <code class="tsd-signature-type">"test"</code></div></td><td></td><td></td></tr></tbody></table>

📒**Interfaces**


--------------------

#### ResizeProps

<table><thead><tr><th>参数</th><th>类型</th><th>说明</th><th>默认值</th></tr></thead><tbody><tr><td><span class="tsd-kind-property">children</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">React.ReactNode</code></div></td><td></td><td></td></tr><tr><td><span class="tsd-kind-property">className</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">string</code></div></td><td><div class="tsd-comment tsd-typography">类名称</div></td><td></td></tr><tr><td><span class="tsd-kind-property">is</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">string</code></div></td><td><div class="tsd-comment tsd-typography">最外面包裹的元素</div></td><td>```ts "div" ```</td></tr><tr><td><span class="tsd-kind-property">minSize</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">number</code><span class="tsd-signature-symbol"> | </span><code class="tsd-signature-type">Partial</code><span class="tsd-signature-symbol">&lt;</span><code class="tsd-signature-type">MinSize</code><span class="tsd-signature-symbol">&gt;</span></div></td><td><div class="tsd-comment tsd-typography">宽度和高度的最小值</div></td><td></td></tr><tr><td><span class="tsd-kind-property">onResizeEnd</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <a href="" class="tsd-signature-type tsd-kind-type-alias">ResizeEnd</a><span class="tsd-signature-symbol">&lt;</span><code class="tsd-signature-type">void</code><span class="tsd-signature-symbol">&gt;</span></div></td><td><div class="tsd-comment tsd-typography">调整尺寸完成后的回调</div></td><td></td></tr><tr><td><span class="tsd-kind-property">style</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">React.CSSProperties</code></div></td><td><div class="tsd-comment tsd-typography">内联样式</div></td><td></td></tr><tr><td><span class="tsd-kind-property">type</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">ResizeType</code><span class="tsd-signature-symbol"> | </span><code class="tsd-signature-type">ResizeType</code><span class="tsd-signature-symbol">[]</span><span class="tsd-signature-symbol"> | </span><code class="tsd-signature-type">"all"</code></div></td><td><div class="tsd-comment tsd-typography">哪些边允许调整</div></td><td></td></tr></tbody></table>

#### ResizeProps1

<table><thead><tr><th>参数</th><th>类型</th><th>说明</th><th>默认值</th></tr></thead><tbody><tr><td><span class="tsd-kind-property">children</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">React.ReactNode</code></div></td><td></td><td></td></tr><tr><td><span class="tsd-kind-property">className</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">string</code></div></td><td><div class="tsd-comment tsd-typography">类名称</div></td><td>```ts "fff" ```</td></tr><tr><td><span class="tsd-kind-property">enume</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">:</span> <a href="" class="tsd-signature-type tsd-kind-enum">TestEnum</a></div></td><td><div class="tsd-comment tsd-typography">枚举</div></td><td></td></tr><tr><td><span class="tsd-kind-property">is</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">string</code></div></td><td><div class="tsd-comment tsd-typography">最外面包裹的元素默认是div</div></td><td></td></tr><tr><td><span class="tsd-kind-property">minSize</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">number</code><span class="tsd-signature-symbol"> | </span><code class="tsd-signature-type">Partial</code><span class="tsd-signature-symbol">&lt;</span><code class="tsd-signature-type">MinSize</code><span class="tsd-signature-symbol">&gt;</span></div></td><td><div class="tsd-comment tsd-typography">宽度和高度的最小值</div></td><td></td></tr><tr><td><span class="tsd-kind-property">onResizeEnd</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <a href="" class="tsd-signature-type tsd-kind-type-alias">ResizeEnd</a><span class="tsd-signature-symbol">&lt;</span><code class="tsd-signature-type">void</code><span class="tsd-signature-symbol">&gt;</span></div></td><td><div class="tsd-comment tsd-typography">调整尺寸完成后的回调</div></td><td></td></tr><tr><td><del class="tsd-kind-property">⚠️style</del></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">React.CSSProperties</code></div></td><td><div class="tsd-comment tsd-typography">内联样式</div></td><td></td></tr><tr><td><span class="tsd-kind-property">type</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">ResizeType</code><span class="tsd-signature-symbol"> | </span><code class="tsd-signature-type">ResizeType</code><span class="tsd-signature-symbol">[]</span><span class="tsd-signature-symbol"> | </span><code class="tsd-signature-type">"all"</code></div></td><td><div class="tsd-comment tsd-typography">哪些边允许调整</div></td><td></td></tr></tbody></table>

🧷**Type Aliases**


----------------------

#### ResizeEnd

<T\>: ((rect:`DOMRect`) => T)

🎗️**Functions**


--------------------

#### StretchResize2

*   StretchResize2(props:ResizeProps, context?:`any`): `React.ReactNode`

#### StretchResize

*   调整元素的宽高
    
      
*   StretchResize(props:ResizeProps, context?:`any`): `React.ReactNode`