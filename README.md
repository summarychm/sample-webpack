## 实现一版简易的 webpack

- [x] 0.基础配置

  - [x] 修改 webpack 配置如 resolveLoader(方便调试)
  - [x] 使用@ts-check 进行类型检查(vsc)
  - [x] 定义 loader 的默认模板(vsc)

- [x] 1.实现常见 loader

  - [x] banner-loader,支持 prefix, postfix, perStr, postStr 四个参数
  - [x] babel-loader,支持基础的 es6 转 es5 功能
  - [x] file-loader,支持 name 参数
  - [x] url-loader,支持 limit 参数
  - [x] less-loader
  - [x] css-loader
  - [x] style-loader
  - [ ] sprite-laoder 雪碧图功能,支持自定义后缀,与 file-loader 等冲突

- [x] 2.实现常见 plugin

  - [x] FileListPlugin,支持 filename,unit(单位,kb/mb),precision(精度) 三个参数

- [ ] 3.实现基础 webpack 功能
- [x] 4.完善 bundle.js 文件的分析与注释.
  - [x] bundle-summary 文件夹
