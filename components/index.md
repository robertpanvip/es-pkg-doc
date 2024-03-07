   

xxx
===

[![NPM Version](https://camo.githubusercontent.com/87e231f6c9c425b8388e50d5b37d2712ca941d75263a1f2cc0c4f3e277a5fe4f/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f65732d706b673f636f6c6f723d333363643536266c6f676f3d6e706d)](https://www.npmjs.com/package/xxx)

📦 **Installation**
-------------------

    npm install xxx

🔨 **Usage**
------------

see demo

👊 Exports
----------

### 

<table><thead><tr><th>参数</th><th>类型</th></tr></thead><tbody><tr><td><a href="" class="tsd-index-link"><svg viewBox="0 0 24 24"><rect fill="#f2f4f8" stroke="var(--color-ts-enum)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><path d="M9.45 16V7.24H14.49V8.224H10.518V10.936H14.07V11.908H10.518V15.016H14.49V16H9.45Z" fill="#222"></path></svg><span>TestEnum</span></a></td><td><code>Enumerations</code></td></tr><tr><td><a href="" class="tsd-index-link"><svg viewBox="0 0 24 24"><rect fill="#f2f4f8" stroke="var(--color-ts-interface)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><path d="M9.51 16V15.016H11.298V8.224H9.51V7.24H14.19V8.224H12.402V15.016H14.19V16H9.51Z" fill="#222"></path></svg><span>ResizeProps</span></a></td><td><code>Interfaces</code></td></tr><tr><td><a href="" class="tsd-index-link"><svg viewBox="0 0 24 24"><rect fill="#f2f4f8" stroke="var(--color-ts-interface)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><path d="M9.51 16V15.016H11.298V8.224H9.51V7.24H14.19V8.224H12.402V15.016H14.19V16H9.51Z" fill="#222"></path></svg><span>ResizeProps1</span></a></td><td><code>Interfaces</code></td></tr><tr><td><a href="" class="tsd-index-link"><svg viewBox="0 0 24 24"><rect fill="#f2f4f8" stroke="var(--color-ts-type-alias)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><path d="M11.31 16V8.224H8.91V7.24H14.79V8.224H12.39V16H11.31Z" fill="#222"></path></svg><span>ResizeEnd</span></a></td><td><code>Type Aliases</code></td></tr><tr><td><a href="" class="tsd-index-link"><svg viewBox="0 0 24 24"><rect fill="#f2f4f8" stroke="var(--color-ts-function)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><path d="M9.39 16V7.24H14.55V8.224H10.446V11.128H14.238V12.112H10.47V16H9.39Z" fill="#222"></path></svg><span>StretchResize2</span></a></td><td><code>Functions</code></td></tr><tr><td><a href="" class="tsd-index-link"><svg viewBox="0 0 24 24"><rect fill="#f2f4f8" stroke="var(--color-ts-function)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><path d="M9.39 16V7.24H14.55V8.224H10.446V11.128H14.238V12.112H10.47V16H9.39Z" fill="#222"></path></svg><span>default</span></a></td><td><code>Functions</code></td></tr></tbody></table>

**Enumerations**
----------------

#### TestEnum

<table><thead><tr><th>参数</th><th>类型</th><th>说明</th><th>默认值</th></tr></thead><tbody><tr><td><span class="tsd-kind-property">枚举1</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">:</span> <code class="tsd-signature-type">0</code></div></td><td></td><td></td></tr><tr><td><span class="tsd-kind-property">枚举2</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">:</span> <code class="tsd-signature-type">"test"</code></div></td><td></td><td></td></tr></tbody></table>

**Interfaces**
--------------

#### ResizeProps

<table><thead><tr><th>参数</th><th>类型</th><th>说明</th><th>默认值</th></tr></thead><tbody><tr><td><span class="tsd-kind-property">children</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">React.ReactNode</code></div></td><td></td><td></td></tr><tr><td><span class="tsd-kind-property">className</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">string</code></div></td><td><div class="tsd-comment tsd-typography">类名称</div></td><td></td></tr><tr><td><span class="tsd-kind-property">is</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">string</code></div></td><td><div class="tsd-comment tsd-typography">最外面包裹的元素默认是div</div></td><td></td></tr><tr><td><span class="tsd-kind-property">minSize</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">number</code><span class="tsd-signature-symbol"> | </span><code class="tsd-signature-type">Partial</code><span class="tsd-signature-symbol">&lt;</span><code class="tsd-signature-type">MinSize</code><span class="tsd-signature-symbol">&gt;</span></div></td><td><div class="tsd-comment tsd-typography">宽度和高度的最小值</div></td><td></td></tr><tr><td><span class="tsd-kind-property">onResizeEnd</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <a href="" class="tsd-signature-type tsd-kind-type-alias">ResizeEnd</a><span class="tsd-signature-symbol">&lt;</span><code class="tsd-signature-type">void</code><span class="tsd-signature-symbol">&gt;</span></div></td><td><div class="tsd-comment tsd-typography">调整尺寸完成后的回调</div></td><td></td></tr><tr><td><span class="tsd-kind-property">style</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">React.CSSProperties</code></div></td><td><div class="tsd-comment tsd-typography">内联样式</div></td><td></td></tr><tr><td><span class="tsd-kind-property">type</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">ResizeType</code><span class="tsd-signature-symbol"> | </span><code class="tsd-signature-type">ResizeType</code><span class="tsd-signature-symbol">[]</span><span class="tsd-signature-symbol"> | </span><code class="tsd-signature-type">"all"</code></div></td><td><div class="tsd-comment tsd-typography">哪些边允许调整</div></td><td></td></tr></tbody></table>

#### ResizeProps1

<table><thead><tr><th>参数</th><th>类型</th><th>说明</th><th>默认值</th></tr></thead><tbody><tr><td><span class="tsd-kind-property">children</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">React.ReactNode</code></div></td><td></td><td></td></tr><tr><td><span class="tsd-kind-property">className</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">string</code></div></td><td><div class="tsd-comment tsd-typography">类名称</div></td><td>```ts fff ```</td></tr><tr><td><span class="tsd-kind-property">enume</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">:</span> <a href="" class="tsd-signature-type tsd-kind-enum">TestEnum</a></div></td><td><div class="tsd-comment tsd-typography">枚举</div></td><td></td></tr><tr><td><span class="tsd-kind-property">is</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">string</code></div></td><td><div class="tsd-comment tsd-typography">最外面包裹的元素默认是div</div></td><td></td></tr><tr><td><span class="tsd-kind-property">minSize</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">number</code><span class="tsd-signature-symbol"> | </span><code class="tsd-signature-type">Partial</code><span class="tsd-signature-symbol">&lt;</span><code class="tsd-signature-type">MinSize</code><span class="tsd-signature-symbol">&gt;</span></div></td><td><div class="tsd-comment tsd-typography">宽度和高度的最小值</div></td><td></td></tr><tr><td><span class="tsd-kind-property">onResizeEnd</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <a href="" class="tsd-signature-type tsd-kind-type-alias">ResizeEnd</a><span class="tsd-signature-symbol">&lt;</span><code class="tsd-signature-type">void</code><span class="tsd-signature-symbol">&gt;</span></div></td><td><div class="tsd-comment tsd-typography">调整尺寸完成后的回调</div></td><td></td></tr><tr><td><del class="tsd-kind-property">⚠️style</del></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">React.CSSProperties</code></div></td><td><div class="tsd-comment tsd-typography">内联样式</div></td><td></td></tr><tr><td><span class="tsd-kind-property">type</span></td><td><a class="tsd-anchor"></a><div class="tsd-signature"><span class="tsd-signature-symbol">?:</span> <code class="tsd-signature-type">ResizeType</code><span class="tsd-signature-symbol"> | </span><code class="tsd-signature-type">ResizeType</code><span class="tsd-signature-symbol">[]</span><span class="tsd-signature-symbol"> | </span><code class="tsd-signature-type">"all"</code></div></td><td><div class="tsd-comment tsd-typography">哪些边允许调整</div></td><td></td></tr></tbody></table>

**Type Aliases**
----------------

#### ResizeEnd

<T\>: ((rect:`DOMRect`) => T)

**Functions**
-------------

#### StretchResize2

*   StretchResize2(props:ResizeProps, context?:`any`): `React.ReactNode`

#### StretchResize

*   调整元素的宽高
    
      
*   StretchResize(props:ResizeProps, context?:`any`): `React.ReactNode`