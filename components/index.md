    Doc

##### 导出的内容

### Interfaces

ResizeProps

### Functions

StretchResize2 default

Interfaces
----------

### ResizeProps

<table data-source-1536=""><thead data-source-1536=""><tr data-source-1536=""><th data-source-1536="">参数</th><th data-source-1536="">说明</th><th data-source-1536="">类型</th><th data-source-1536="">默认值</th></tr></thead><tbody data-source-1536=""><tr data-source-1536=""><td data-source-1536=""><span class="tsd-kind-property" data-source-1536="">children</span></td><td data-source-1536=""></td><td data-source-1536=""><a class="tsd-anchor" data-source-1536=""></a><div class="tsd-signature" data-source-1536=""><span class="tsd-signature-symbol" data-source-1536="">?:</span> <code class="tsd-signature-type" data-source-1536="">React.ReactNode</code></div></td><td data-source-1536=""></td></tr><tr data-source-1536=""><td data-source-1536=""><span class="tsd-kind-property" data-source-1536="">class<wbr data-source-1536="">Name</span></td><td data-source-1536=""><div class="tsd-comment tsd-typography" data-source-1536="">类名称</div></td><td data-source-1536=""><a class="tsd-anchor" data-source-1536=""></a><div class="tsd-signature" data-source-1536=""><span class="tsd-signature-symbol" data-source-1536="">?:</span> <code class="tsd-signature-type" data-source-1536="">string</code></div><div class="tsd-comment tsd-typography" data-source-1536=""></div></td><td data-source-1536=""></td></tr><tr data-source-1536=""><td data-source-1536=""><span class="tsd-kind-property" data-source-1536="">is</span></td><td data-source-1536=""><div class="tsd-comment tsd-typography" data-source-1536="">最外面包裹的元素默认是div</div></td><td data-source-1536=""><a class="tsd-anchor" data-source-1536=""></a><div class="tsd-signature" data-source-1536=""><span class="tsd-signature-symbol" data-source-1536="">?:</span> <code class="tsd-signature-type" data-source-1536="">string</code></div><div class="tsd-comment tsd-typography" data-source-1536=""></div></td><td data-source-1536=""></td></tr><tr data-source-1536=""><td data-source-1536=""><span class="tsd-kind-property" data-source-1536="">min<wbr data-source-1536="">Size</span></td><td data-source-1536=""><div class="tsd-comment tsd-typography" data-source-1536="">宽度和高度的最小值</div></td><td data-source-1536=""><a class="tsd-anchor" data-source-1536=""></a><div class="tsd-signature" data-source-1536=""><span class="tsd-signature-symbol" data-source-1536="">?:</span> <code class="tsd-signature-type" data-source-1536="">number</code><span class="tsd-signature-symbol" data-source-1536=""> | </span><code class="tsd-signature-type" data-source-1536="">Partial</code><span class="tsd-signature-symbol" data-source-1536="">&lt;</span><code class="tsd-signature-type" data-source-1536="">MinSize</code><span class="tsd-signature-symbol" data-source-1536="">&gt;</span></div><div class="tsd-comment tsd-typography" data-source-1536=""></div></td><td data-source-1536=""></td></tr><tr data-source-1536=""><td data-source-1536=""><span class="tsd-kind-property" data-source-1536="">on<wbr data-source-1536="">Resize<wbr data-source-1536="">End</span></td><td data-source-1536=""><div class="tsd-comment tsd-typography" data-source-1536="">调整尺寸完成后的回调</div></td><td data-source-1536=""><a class="tsd-anchor" data-source-1536=""></a><div class="tsd-signature" data-source-1536=""><span class="tsd-signature-symbol" data-source-1536="">?:</span> <code class="tsd-signature-type" data-source-1536="">ResizeEnd</code><span class="tsd-signature-symbol" data-source-1536="">&lt;</span><code class="tsd-signature-type" data-source-1536="">void</code><span class="tsd-signature-symbol" data-source-1536="">&gt;</span></div><div class="tsd-comment tsd-typography" data-source-1536=""></div></td><td data-source-1536=""></td></tr><tr data-source-1536=""><td data-source-1536=""><span class="tsd-kind-property" data-source-1536="">style</span></td><td data-source-1536=""><div class="tsd-comment tsd-typography" data-source-1536="">内联样式</div></td><td data-source-1536=""><a class="tsd-anchor" data-source-1536=""></a><div class="tsd-signature" data-source-1536=""><span class="tsd-signature-symbol" data-source-1536="">?:</span> <code class="tsd-signature-type" data-source-1536="">React.CSSProperties</code></div><div class="tsd-comment tsd-typography" data-source-1536=""></div></td><td data-source-1536=""></td></tr><tr data-source-1536=""><td data-source-1536=""><span class="tsd-kind-property" data-source-1536="">type</span></td><td data-source-1536=""><div class="tsd-comment tsd-typography" data-source-1536="">哪些边允许调整</div></td><td data-source-1536=""><a class="tsd-anchor" data-source-1536=""></a><div class="tsd-signature" data-source-1536=""><span class="tsd-signature-symbol" data-source-1536="">?:</span> <code class="tsd-signature-type" data-source-1536="">ResizeType</code><span class="tsd-signature-symbol" data-source-1536=""> | </span><code class="tsd-signature-type" data-source-1536="">ResizeType</code><span class="tsd-signature-symbol" data-source-1536="">[]</span><span class="tsd-signature-symbol" data-source-1536=""> | </span><code class="tsd-signature-type" data-source-1536="">"all"</code></div><div class="tsd-comment tsd-typography" data-source-1536=""></div></td><td data-source-1536=""></td></tr></tbody></table>

Functions
---------

### StretchResize2

*   StretchResize2(props:ResizeProps, context?:`any`): `React.ReactNode`

### StretchResize

*   调整元素的宽高
    
*   StretchResize(props:ResizeProps, context?:`any`): `React.ReactNode`