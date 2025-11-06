@echo off
REM 微信文章转 Markdown - 一键启动前后端脚本 (Windows)

set SCRIPT_DIR=%~dp0
set BACKEND_DIR=%SCRIPT_DIR%backend
set FRONTEND_DIR=%SCRIPT_DIR%frontend

echo 🚀 正在启动前后端服务...
echo.

REM 检查并安装后端依赖
if not exist "%BACKEND_DIR%\node_modules" (
    echo 📦 检测到后端依赖未安装，正在安装...
    cd /d "%BACKEND_DIR%"
    call npm install
    echo.
)

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

REM 启动后端服务器（在后台）
echo ✅ 正在启动后端服务器...
cd /d "%BACKEND_DIR%"
start "WeChat Backend" /min node server.js

REM 等待后端服务器启动
timeout /t 2 /nobreak >nul

echo ✅ 后端服务器已启动
echo 📍 后端地址: http://localhost:3001
echo.

REM 启动前端服务器（在后台）
echo ✅ 正在启动前端服务器...
cd /d "%FRONTEND_DIR%"
start "WeChat Frontend" /min python -m http.server 8080

REM 等待前端服务器启动
timeout /t 1 /nobreak >nul

echo ✅ 前端服务器已启动
echo 📍 前端地址: http://localhost:8080
echo.

REM 自动打开浏览器
echo 🌐 正在打开浏览器...
timeout /t 1 /nobreak >nul
start http://localhost:8080

echo.
echo ═══════════════════════════════════════
echo ✨ 前后端服务已启动！
echo.
echo 📍 前端: http://localhost:8080
echo 📍 后端: http://localhost:3001
echo.
echo 💡 提示: 关闭此窗口将停止所有服务
echo ═══════════════════════════════════════
echo.
pause


