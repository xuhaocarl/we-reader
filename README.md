# We-Reader

一个将微信公众号文章转换为 Markdown 格式的工具。

🌐 [在线使用](#部署到云端) | 📖 [部署指南](DEPLOY.md)

## 快速开始

### 方法一：一键启动前后端（推荐）

**macOS/Linux:**
```bash
./start-all.sh
```

**Windows:**
双击 `start-all.bat` 文件

这个脚本会：
- ✅ 自动启动后端服务器（`http://localhost:3001`）
- ✅ 自动启动前端服务器（`http://localhost:8080`）
- ✅ 自动打开浏览器访问前端页面

### 方法二：仅启动后端服务器

**macOS/Linux:**
```bash
./start.sh
```

**Windows:**
双击 `start.bat` 文件

然后手动在浏览器中打开 `frontend/index.html`

### 方法三：手动启动

1. **安装依赖**
```bash
cd backend
npm install
```

2. **启动服务器**
```bash
node server.js
```

3. **打开前端**
- 在浏览器中打开 `frontend/index.html`
- 或使用 VSCode Live Server 插件打开

## 使用说明

### 单个链接转换

1. 确保后端服务器正在运行（`http://localhost:3001`）
2. 在浏览器中打开前端页面
3. 选择"单个链接"模式
4. 粘贴微信文章 URL（例如：`https://mp.weixin.qq.com/...`）
5. 点击"转换"按钮
6. 转换完成后，可以复制或下载单个 Markdown 文件

### 批量链接转换（新功能）⭐

1. 确保后端服务器正在运行
2. 在浏览器中打开前端页面
3. 选择"批量链接"模式
4. 在文本框中粘贴多个微信文章 URL，每行一个，例如：
   ```
   https://mp.weixin.qq.com/s/xxx1
   https://mp.weixin.qq.com/s/xxx2
   https://mp.weixin.qq.com/s/xxx3
   ```
5. 点击"批量转换"按钮
6. 等待转换完成（会显示成功和失败的链接）
7. 可以：
   - 点击每个文章旁边的"下载"按钮单独下载
   - 点击"下载全部文件"按钮一次性下载所有成功转换的文件

## 注意事项

- ⚠️ 微信有反爬机制，可能无法 100% 成功抓取
- ⚠️ 微信图片（mmbiz.qpic.cn）受防盗链保护，在 Markdown 预览器中可能无法显示
- 📝 后端服务器需要保持运行，前端才能正常工作

## 项目结构

```
we-reader/
├── backend/              # 后端代码
│   ├── package.json
│   └── server.js
├── frontend/             # 前端代码
│   └── index.html
├── start-all.sh          # 一键启动前后端（macOS/Linux）⭐
├── start-all.bat         # 一键启动前后端（Windows）⭐
├── start.sh              # 仅启动后端（macOS/Linux）
└── start.bat             # 仅启动后端（Windows）
```

## 核心功能

### ✨ 批量处理
- 支持同时转换多个微信文章链接（最多5个并发）
- 每行一个链接，自动识别和处理（支持末尾分号、逗号等）
- 显示成功和失败的链接统计
- 支持单独下载或一键批量下载所有文件
- 每个文件自动使用文章标题命名

### 🔄 并行处理
- 后端自动控制并发数量，避免过载
- 失败的链接不会影响其他链接的处理
- 实时显示处理进度和结果

## 部署到云端

想要让其他人通过网址使用这个应用？可以部署到云端！

### 快速部署（推荐 Vercel）

1. **将代码推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/we-reader.git
   git push -u origin main
   ```

2. **部署到 Vercel**
   - 访问 [Vercel](https://vercel.com)
   - 使用 GitHub 账号登录
   - 点击 "New Project"
   - 选择你的仓库
   - 配置：
     - Framework Preset: Other
     - Root Directory: `./`
     - Build Command: 留空
     - Output Directory: `frontend`
   - 点击 "Deploy"

3. **完成！**
   - Vercel 会自动提供一个 URL
   - 访问该 URL 即可使用应用

### 其他部署方式

详细部署指南请查看 [DEPLOY.md](DEPLOY.md)，包括：
- Railway 部署
- Render 部署
- GitHub Pages 部署
- 环境变量配置

