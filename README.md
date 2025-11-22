# We-Reader

一个将微信公众号文章转换为 Markdown 格式的工具。

## 程序用途

We-Reader 是一个本地应用程序，可以帮助你：

- **单个链接转换**：将单个微信公众号文章链接转换为 Markdown 格式
- **批量链接转换**：同时转换多个微信公众号文章链接（最多5个并发）
- **自动命名**：转换后的文件自动使用文章标题命名
- **便捷下载**：支持单独下载或一键批量下载所有转换后的文件

## 如何在电脑上打开

### 方法一：使用 macOS 应用程序（推荐）

**macOS 用户：**

1. 双击 `We-Reader.app` 文件即可启动应用
2. 应用会自动启动后端服务器和前端界面
3. 首次运行可能需要授予执行权限

**如果遇到权限问题：**

```bash
chmod +x "We-Reader.app/Contents/MacOS/We-Reader"
xattr -cr "We-Reader.app"
```

### 方法二：一键启动前后端

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

### 方法三：仅启动后端服务器

**macOS/Linux:**
```bash
./start.sh
```

**Windows:**
双击 `start.bat` 文件

然后手动在浏览器中打开 `frontend/index.html`

### 方法四：手动启动

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

### 批量链接转换

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
├── We-Reader.app/        # macOS 应用程序（推荐使用）
├── start-all.sh          # 一键启动前后端（macOS/Linux）
├── start-all.bat         # 一键启动前后端（Windows）
├── start.sh              # 仅启动后端（macOS/Linux）
└── start.bat             # 仅启动后端（Windows）
```

## 图标设置说明

如果应用图标在 Dock 中显示为 Electron 默认图标，可以尝试以下方法：

### 方法 1：重新启动应用（推荐）
1. **完全退出应用**（确保所有进程都已停止）
2. **重新启动应用**：双击 `We-Reader.app`
3. 查看终端输出，应该会看到：
   - `✅ 应用图标已设置: [路径]`
   - `图标尺寸: { width: 1024, height: 1024 }`

### 方法 2：清除缓存并重启
```bash
# 清除图标缓存
./update-icon.sh

# 或者手动执行
killall Dock
/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -kill -r -domain local -domain system -domain user
```

### 方法 3：检查日志
启动应用时，查看终端输出：
- 如果看到 `✅ 应用图标已设置`，说明代码执行成功
- 如果看到 `⚠️ 未找到有效的图标文件`，检查路径是否正确

### 调试步骤

1. **检查图标文件是否存在**：
   ```bash
   ls -la We-Reader.app/Contents/Resources/icon.icns
   ```

2. **检查 Info.plist 配置**：
   ```bash
   /usr/libexec/PlistBuddy -c "Print :CFBundleIconFile" We-Reader.app/Contents/Info.plist
   ```
   应该输出：`icon`

3. **查看应用启动日志**：
   启动应用时，终端会显示图标设置的详细信息

### 如果仍然不行

1. **重启电脑**（macOS 有时需要重启才能完全更新图标缓存）
2. **检查图标文件格式**：确保是有效的 .icns 文件
3. **尝试使用 .png 格式**：将 `icon.png` 重命名为 `AppIcon.png` 并更新 Info.plist

### 注意事项

- `app.dock.setIcon()` 主要用于运行时临时更改图标
- macOS 应用图标通常通过 Info.plist 中的 `CFBundleIconFile` 设置
- 图标缓存可能需要一些时间才能更新
