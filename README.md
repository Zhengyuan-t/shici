# 十词

纯静态单词学习网站，包含最新版的前后分组回看、逐词拼写、错词跳过与重练、答错清空输入框、动画和音效、手机释义点按显示与隐藏，以及跟随系统或手动切换的深浅色外观。新用户首次进入会显示交互式引导，右上角可重新打开。内置 1,089 条词库记录，支持 Excel 工作表导入。

## GitHub Pages 部署（无需安装或构建）

1. 解压本压缩包，打开 ten-words 文件夹。
2. 在 GitHub 创建一个仓库，例如 ten-words。
3. 将此文件夹里的全部内容上传到仓库根目录，确保 index.html 直接位于仓库根目录，不要再套一层 ten-words 文件夹。vendor 文件夹必须一起上传。
4. 打开仓库 Settings → Pages。
5. 在 Build and deployment 下，将 Source 设为 Deploy from a branch。
6. Branch 选择 main（或实际上传分支），文件夹选择 /(root)，点击 Save。
7. 等待 GitHub 部署完成，在 Pages 页面打开提供的网址。

说明：README 和 .nojekyll 可一同提交。没有 .nojekyll 也不影响这些普通静态文件；建议保留。

官方说明：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 本地预览

不要直接双击 index.html，浏览器可能会阻止读取词库。
在这个文件夹中运行：

```sh
python3 -m http.server 8080
```

然后打开 http://localhost:8080 。也可用编辑器的静态网站预览服务。

## 文件说明

- index.html：页面入口及 Excel 导入对话框。
- style.css：页面样式、响应式布局和动画。
- app.js：学习、分组历史、拼写、错词重练、本地保存和音效。
- tour.js / tour.css：首次访问引导、示意动画与独立示例练习。
- theme.js / theme.css：外观偏好、系统深浅色跟随及主题配色。
- core.js：抽取、词条解析和答案匹配。
- builtin.json：内置中英文释义与例句。
- vendor/：随包提供的 SheetJS Excel 读取组件及其许可证，无需访问第三方 CDN。

## 数据与迁移

文件在访问者的浏览器中读取，词库与进度使用 localStorage 保存，不需要数据库或后端。
GitHub Pages 版本不会要求 ChatGPT 登录；原网站的登录限制属于托管平台，不包含在此源码中。
访问地址变化后，原地址下保存的进度不会自动迁移。当前版本没有进度导入导出功能，新网址会从独立进度开始。
GitHub Pages 发布后通常可公开访问，包括随网站提供的内置词库；请按需要选择适合的发布方式。
不需要 OpenAI 密钥，也不包含原托管平台的凭据、仓库历史或项目配置。

## 第三方组件

SheetJS Community Edition 0.20.3，许可证见 vendor/LICENSE-sheetjs。
