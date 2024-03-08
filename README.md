   

@es-pkg/doc
===========

这是测试

[![NPM Version](https://camo.githubusercontent.com/87e231f6c9c425b8388e50d5b37d2712ca941d75263a1f2cc0c4f3e277a5fe4f/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f65732d706b673f636f6c6f723d333363643536266c6f676f3d6e706d)](https://www.npmjs.com/package/@es-pkg/doc)

📦 **Installation**
-------------------

    npm install @es-pkg/doc

🔨 **Usage**
------------

see demo

👊 Exports
----------

### 

<table><thead><tr><th>参数</th><th>类型</th></tr></thead><tbody><tr><td><a href="" class="tsd-index-link"><svg viewBox="0 0 24 24"><rect fill="#f2f4f8" stroke="#FF4D82" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="12"></rect><path d="M10.354 17V8.24H13.066C13.586 8.24 14.042 8.348 14.434 8.564C14.826 8.772 15.13 9.064 15.346 9.44C15.562 9.816 15.67 10.256 15.67 10.76C15.67 11.352 15.514 11.86 15.202 12.284C14.898 12.708 14.482 13 13.954 13.16L15.79 17H14.518L12.838 13.28H11.434V17H10.354ZM11.434 12.308H13.066C13.514 12.308 13.874 12.168 14.146 11.888C14.418 11.6 14.554 11.224 14.554 10.76C14.554 10.288 14.418 9.912 14.146 9.632C13.874 9.352 13.514 9.212 13.066 9.212H11.434V12.308Z" fill="#222"></path></svg><span>default</span></a></td><td><code>References</code></td></tr><tr><td><a href="" class="tsd-index-link"><svg viewBox="0 0 24 24"><rect fill="#f2f4f8" stroke="var(--color-ts-type-alias)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><path d="M11.31 16V8.224H8.91V7.24H14.79V8.224H12.39V16H11.31Z" fill="#222"></path></svg><span>DocOptions</span></a></td><td><code>Type Aliases</code></td></tr><tr><td><a href="" class="tsd-index-link"><svg viewBox="0 0 24 24"><rect fill="#f2f4f8" stroke="var(--color-ts-function)" stroke-width="1.5" x="1" y="1" width="22" height="22" rx="6"></rect><path d="M9.39 16V7.24H14.55V8.224H10.446V11.128H14.238V12.112H10.47V16H9.39Z" fill="#222"></path></svg><span>bootstrap</span></a></td><td><code>Functions</code></td></tr></tbody></table>

**References**
--------------

#### default

Renames and re-exports bootstrap

**Type Aliases**
----------------

#### DocOptions

: {  
  
    desc?: `string`;  
  
    entry: `string`;  
  
    name: `string`;  
  
    outDir: `string`;  
  
    outName?: `string`;  
  
    outType?: `"html"` | `"md"` | \[`"html"`, `"md"`\];  
  
    tsconfig?: `string`;  
  
}

**Functions**
-------------

#### bootstrap

*   默认 EsPkgDoc的主函数
    
      
*   bootstrap(config:DocOptions): `Promise`<`void`\>