# 部署指南

本应用可以部署到多个云平台，让用户通过网址在云端使用。

## 部署方案

### 方案一：Vercel 部署（推荐）⭐

Vercel 支持前后端一体化部署，最简单方便。本方案将详细说明从代码准备到部署完成的每一步。

#### 第一步：将代码推送到 GitHub

如果你还没有 GitHub 账号，请先注册：https://github.com

**1.1 在 GitHub 上创建新仓库**

1. 登录 GitHub，点击右上角的 "+" 号，选择 "New repository"
2. 填写仓库信息：
   - Repository name: `we-reader`（或你喜欢的名字）
   - Description: `WeChat article to Markdown converter`
   - 选择 Public（公开）或 Private（私有）
   - **不要**勾选 "Initialize this repository with a README"（因为本地已有代码）
3. 点击 "Create repository"

**1.2 在本地初始化 Git 仓库并推送代码**

打开终端（Terminal），进入项目目录，执行以下命令：

```bash
# 进入项目目录
cd /Users/songxuhao/Desktop/SONG-开发/we-reader

# 初始化 Git 仓库
git init

# 添加所有文件到 Git
git add .

# 提交代码
git commit -m "Initial commit: We-Reader project"

# 添加远程仓库（将 YOUR_USERNAME 替换为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/we-reader.git

# 推送代码到 GitHub
git branch -M main
git push -u origin main
```

**注意事项：**
- 如果提示需要登录，GitHub 现在使用 Personal Access Token 而不是密码
- 生成 Token：GitHub Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
- 权限选择：至少勾选 `repo` 权限
- 将生成的 token 作为密码使用

**1.3 验证代码已上传**

1. 访问你的 GitHub 仓库页面：`https://github.com/YOUR_USERNAME/we-reader`
2. 确认可以看到以下文件和目录：
   - `frontend/index.html`
   - `backend/server.js`
   - `api/convert.js`
   - `vercel.json`
   - `README.md`
   - 等等

#### 第二步：部署到 Vercel

**2.1 注册/登录 Vercel**

1. 访问 [Vercel](https://vercel.com)
2. 点击右上角的 "Sign Up" 或 "Log In"
3. 选择 "Continue with GitHub"（使用 GitHub 账号登录）
4. 授权 Vercel 访问你的 GitHub 账号

**2.2 创建新项目**

1. 登录后，点击 "Add New..." → "Project"
2. 在 "Import Git Repository" 页面，你会看到你的 GitHub 仓库列表
3. 找到 `we-reader` 仓库，点击 "Import"

**2.3 配置项目设置**

在 "Configure Project" 页面，进行以下配置：

1. **Project Name**（项目名称）
   - 可以保持默认或修改为你喜欢的名字
   - 例如：`we-reader` 或 `wechat-to-markdown`

2. **Framework Preset**（框架预设）
   - 选择：**Other**

3. **Root Directory**（根目录）
   - 设置为：`./`（当前目录）

4. **Build and Output Settings**（构建和输出设置）
   - **Build Command**（构建命令）：留空
   - **Output Directory**（输出目录）：`frontend`
   - **Install Command**（安装命令）：留空（Vercel 会自动检测）

5. **Environment Variables**（环境变量）
   - 暂时不需要设置，可以留空
   - 如果需要，可以添加：
     - `FRONTEND_URL`: 你的 Vercel 域名（部署后会自动生成）

**2.4 开始部署**

1. 确认所有配置正确后，点击 "Deploy" 按钮
2. Vercel 会开始部署过程，你会看到：
   - Installing dependencies（安装依赖）
   - Building（构建）
   - Deploying（部署）

**2.5 等待部署完成**

部署过程通常需要 1-3 分钟，你会看到实时日志：

```
✓ Cloning repository
✓ Installing dependencies
✓ Building
✓ Deploying
✓ Success! Your project is live
```

#### 第三步：验证部署

**3.1 获取部署 URL**

部署完成后，Vercel 会显示：
- **Production URL**（生产环境 URL）：`https://your-project-name.vercel.app`
- 点击这个 URL 可以访问你的应用

**3.2 测试应用**

1. 打开部署后的 URL（如：`https://we-reader.vercel.app`）
2. 你应该能看到 We-Reader 的界面
3. 尝试输入一个微信文章 URL 并点击"转换"
4. 如果一切正常，应该能够成功转换并显示 Markdown

**3.3 检查后端 API**

1. 打开浏览器开发者工具（F12）
2. 切换到 "Network"（网络）标签
3. 点击"转换"按钮
4. 查看是否有对 `/api/convert` 的请求
5. 如果请求成功（状态码 200），说明后端正常工作

#### 第四步：配置自定义域名（可选）

如果你有自己的域名，可以配置：

1. 在 Vercel 项目页面，点击 "Settings" → "Domains"
2. 输入你的域名（如：`we-reader.yourdomain.com`）
3. 按照提示配置 DNS 记录
4. 等待 DNS 生效（通常几分钟到几小时）

#### 常见问题排查

**问题 1：部署失败，提示找不到依赖**

**解决方案：**
- 确保 `api/package.json` 文件存在且包含所有依赖
- 检查 `vercel.json` 配置是否正确

**问题 2：前端可以访问，但转换失败**

**解决方案：**
- 检查浏览器控制台是否有错误
- 确认 `/api/convert` 端点是否可访问
- 在 Vercel 项目页面查看 "Functions" 标签，检查 serverless function 是否正常

**问题 3：CORS 错误**

**解决方案：**
- 检查 `api/convert.js` 中的 CORS 配置
- 确保设置了正确的 `Access-Control-Allow-Origin` 头

**问题 4：API 返回 500 错误**

**解决方案：**
- 在 Vercel 项目页面查看 "Logs"（日志）
- 检查是否有依赖缺失或代码错误
- 确认所有依赖都已正确安装

#### 自动部署

配置完成后，每次你推送代码到 GitHub 的 `main` 分支，Vercel 会自动：
1. 检测到代码更新
2. 自动重新部署
3. 更新生产环境

你可以在 Vercel 项目页面看到所有部署历史。

#### 完成！

部署成功后，你的应用就可以通过网址访问了！你可以：
- 分享 URL 给其他人使用
- 在 README 中添加在线演示链接
- 继续开发，每次推送代码都会自动更新

### 方案二：Railway 部署后端 + GitHub Pages 部署前端

#### 后端部署到 Railway：

1. **准备代码**
   - 确保 `backend/` 目录下有 `package.json` 和 `server.js`

2. **部署到 Railway**
   - 访问 [Railway](https://railway.app)
   - 使用 GitHub 账号登录
   - 点击 "New Project" -> "Deploy from GitHub repo"
   - 选择你的仓库
   - Railway 会自动检测并部署
   - 部署完成后，Railway 会提供一个 URL（如：https://your-app.railway.app）

3. **配置环境变量**
   - 在 Railway 项目设置中添加：
     - `PORT`: Railway 会自动设置
     - `FRONTEND_URL`: 你的前端域名

#### 前端部署到 GitHub Pages：

1. **修改前端代码**
   - 在 `frontend/index.html` 中，将 `API_BASE_URL` 设置为你的 Railway 后端地址：
   ```javascript
   const API_BASE_URL = 'https://your-app.railway.app';
   ```

2. **部署到 GitHub Pages**
   - 在 GitHub 仓库设置中，找到 "Pages"
   - Source 选择 `main` 分支，目录选择 `/frontend`
   - 保存后，GitHub 会提供一个 URL（如：https://username.github.io/repo-name）

### 方案三：Render 部署

#### 后端部署到 Render：

1. **准备代码**
   - 在 `backend/` 目录下创建 `render.yaml`：
   ```yaml
   services:
     - type: web
       name: we-reader-backend
       env: node
       buildCommand: cd backend && npm install
       startCommand: cd backend && npm start
       envVars:
         - key: PORT
           value: 10000
   ```

2. **部署到 Render**
   - 访问 [Render](https://render.com)
   - 使用 GitHub 账号登录
   - 点击 "New" -> "Web Service"
   - 连接 GitHub 仓库
   - 配置：
     - Environment: Node
     - Build Command: `cd backend && npm install`
     - Start Command: `cd backend && npm start`
   - 点击 "Create Web Service"

#### 前端部署到 Render：

1. **创建静态站点**
   - 在 Render 中点击 "New" -> "Static Site"
   - 连接 GitHub 仓库
   - 配置：
     - Build Command: 留空
     - Publish Directory: `frontend`
   - 点击 "Create Static Site"

2. **配置前端 API 地址**
   - 在 `frontend/index.html` 中设置后端地址

## 环境变量说明

### 后端环境变量：

- `PORT`: 服务器端口（云平台通常会自动设置）
- `FRONTEND_URL`: 前端域名（用于 CORS 配置，可选）

### 前端配置：

前端会自动检测环境：
- 本地开发：使用 `http://localhost:3001`
- 生产环境：使用当前域名（如果前后端同域）或需要手动设置后端地址

## 注意事项

1. **CORS 配置**：确保后端允许前端域名的跨域请求
2. **API 地址**：如果前后端部署在不同域名，需要在前端代码中设置正确的后端地址
3. **环境变量**：生产环境建议设置 `FRONTEND_URL` 以限制 CORS 来源
4. **免费额度**：各平台都有免费额度，注意使用限制

## 推荐配置

最简单的方式是使用 **Vercel**，它支持：
- 前后端一体化部署
- 自动 HTTPS
- 全球 CDN
- 免费额度充足

部署完成后，用户就可以通过网址直接使用应用了！

