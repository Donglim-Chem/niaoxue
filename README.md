# 鸟学

一个面向中国常见鸟种的离线优先学习网站。项目按生态地理分区整理鸟种，提供每日学习、图鉴、日历记录、本地进度、鸟类照片和鸣声播放。

## 功能

- 收录 147 种常见鸟类及基础识别信息
- 图鉴浏览、分区筛选与鸟种详情
- 一日一鸟、学习日历与徽章
- 照片和鸣声随站点静态分发，可离线构建
- 学习进度仅保存在当前浏览器的 `localStorage`，无需账号或服务器
- 支持部署到 GitHub Pages 子路径

## 本地运行

需要 Node.js 20 或更高版本。

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

代码检查：

```bash
npm run lint
```

## GitHub Pages

推送到 `main` 分支后，[GitHub Actions](.github/workflows/deploy-pages.yml) 会自动构建并发布站点。工作流会根据仓库名设置 Vite 的部署子路径，因此仓库不必固定命名为 `niaoxue`。

首次发布时，请在仓库的 **Settings > Pages > Build and deployment** 中将 Source 设为 **GitHub Actions**。

## 数据与隐私

应用没有账号系统，也不会把学习进度上传到服务器。清除浏览器站点数据、卸载应用或更换设备都会清空本地学习记录。

## 素材版权

源代码采用 [MIT License](LICENSE)。

`public/media/` 下的照片和录音来自 Wikimedia Commons、Macaulay Library 等第三方来源，不适用本项目的 MIT 许可证。每项素材的作者、许可证和原始页面记录在 [`src/data/media-manifest.json`](src/data/media-manifest.json) 中，并会在鸟种详情页展示。使用或再分发素材前，请遵守对应来源页的署名、相同方式共享、非商业使用或其他要求。

百科简介来自维基百科相关条目，须遵守其内容许可条款。

## 技术栈

- React 19
- Vite 8
- Oxlint

