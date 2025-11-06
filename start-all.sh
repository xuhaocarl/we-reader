#!/bin/bash

# 微信文章转 Markdown - 一键启动前后端脚本

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

echo "🚀 正在启动前后端服务..."
echo ""

# 检查并安装后端依赖
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    echo "📦 检测到后端依赖未安装，正在安装..."
    cd "$BACKEND_DIR"
    npm install
    echo ""
fi

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查 Python 是否安装（用于启动前端服务器）
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到 Python3，无法启动前端服务器"
    echo "💡 提示: 你可以手动在浏览器中打开 frontend/index.html"
    exit 1
fi

# 启动后端服务器（在后台）
echo "✅ 正在启动后端服务器..."
cd "$BACKEND_DIR"
node server.js > /tmp/wechat-backend.log 2>&1 &
BACKEND_PID=$!

# 等待后端服务器启动
sleep 2

# 检查后端是否成功启动
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ 后端服务器启动失败，请检查日志"
    exit 1
fi

echo "✅ 后端服务器已启动 (PID: $BACKEND_PID)"
echo "📍 后端地址: http://localhost:3001"
echo ""

# 启动前端服务器（在后台）
echo "✅ 正在启动前端服务器..."
cd "$FRONTEND_DIR"
python3 -m http.server 8080 > /tmp/wechat-frontend.log 2>&1 &
FRONTEND_PID=$!

# 等待前端服务器启动
sleep 1

echo "✅ 前端服务器已启动 (PID: $FRONTEND_PID)"
echo "📍 前端地址: http://localhost:8080"
echo ""

# 自动打开浏览器
echo "🌐 正在打开浏览器..."
sleep 1
open "http://localhost:8080" 2>/dev/null || xdg-open "http://localhost:8080" 2>/dev/null || echo "请手动打开浏览器访问: http://localhost:8080"

echo ""
echo "═══════════════════════════════════════"
echo "✨ 前后端服务已启动！"
echo ""
echo "📍 前端: http://localhost:8080"
echo "📍 后端: http://localhost:3001"
echo ""
echo "⚠️  按 Ctrl+C 可以停止所有服务"
echo "📝 日志文件:"
echo "   - 后端: /tmp/wechat-backend.log"
echo "   - 前端: /tmp/wechat-frontend.log"
echo "═══════════════════════════════════════"
echo ""

# 清理函数：当脚本退出时停止所有服务
cleanup() {
    echo ""
    echo "🛑 正在停止服务..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ 所有服务已停止"
    exit 0
}

# 捕获退出信号
trap cleanup SIGINT SIGTERM

# 保持脚本运行
echo "💡 提示: 保持此终端窗口打开以维持服务运行"
echo ""
wait


