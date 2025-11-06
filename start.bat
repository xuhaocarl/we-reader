@echo off
REM 微信文章转 Markdown 后端服务器启动脚本 (Windows)

echo 🚀 正在启动后端服务器...
echo.

REM 进入后端目录
cd /d "%~dp0backend"

REM 检查 node_modules 是否存在
if not exist "node_modules" (
    echo 📦 检测到依赖未安装，正在安装...
    call npm install
    echo.
)

REM 检查 server.js 是否存在
if not exist "server.js" (
    echo ❌ 错误: 找不到 server.js 文件
    pause
    exit /b 1
)

echo ✅ 正在启动服务器...
echo 📍 服务器地址: http://localhost:3001
echo ⚠️  按 Ctrl+C 可以停止服务器
echo.

REM 启动服务器
node server.js

pause


