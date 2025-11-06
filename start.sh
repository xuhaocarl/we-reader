#!/bin/bash

# 微信文章转 Markdown 后端服务器启动脚本

echo "🚀 正在启动后端服务器..."
echo ""

# 进入后端目录
cd "$(dirname "$0")/backend"

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 检测到依赖未安装，正在安装..."
    npm install
    echo ""
fi

# 检查 server.js 是否存在
if [ ! -f "server.js" ]; then
    echo "❌ 错误: 找不到 server.js 文件"
    exit 1
fi

echo "✅ 正在启动服务器..."
echo "📍 服务器地址: http://localhost:3001"
echo "⚠️  按 Ctrl+C 可以停止服务器"
echo ""

# 启动服务器
node server.js


