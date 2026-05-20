#!/bin/bash

# 工作风格测评系统 - 部署脚本
# 使用方法：chmod +x deploy.sh && ./deploy.sh

echo "================================"
echo "工作风格测评系统 - 部署脚本"
echo "================================"
echo ""

# 检查 Node.js
echo "检查 Node.js 版本..."
if ! command -v node &> /dev/null; then
    echo "错误：未安装 Node.js"
    echo "请先安装 Node.js 18 或更高版本"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "错误：Node.js 版本过低（当前：$(node -v)）"
    echo "请升级到 Node.js 18 或更高版本"
    exit 1
fi
echo "✓ Node.js 版本：$(node -v)"

# 检查 npm
echo "检查 npm..."
if ! command -v npm &> /dev/null; then
    echo "错误：未安装 npm"
    exit 1
fi
echo "✓ npm 版本：$(npm -v)"
echo ""

# 安装依赖
echo "安装依赖..."
npm install
if [ $? -ne 0 ]; then
    echo "错误：依赖安装失败"
    exit 1
fi
echo "✓ 依赖安装完成"
echo ""

# 检查环境变量
echo "检查环境变量..."
if [ ! -f ".env.local" ]; then
    echo "警告：未找到 .env.local 文件"
    echo "是否需要配置环境变量？(y/n)"
    read -r response
    if [ "$response" = "y" ]; then
        cp .env.example .env.local
        echo "已创建 .env.local 文件，请编辑配置："
        echo "  nano .env.local"
        echo "配置完成后重新运行此脚本"
        exit 0
    fi
fi
echo "✓ 环境变量检查完成"
echo ""

# 构建项目
echo "构建项目..."
npm run build
if [ $? -ne 0 ]; then
    echo "错误：构建失败"
    exit 1
fi
echo "✓ 构建完成"
echo ""

# 检查 PM2
echo "检查 PM2..."
if ! command -v pm2 &> /dev/null; then
    echo "PM2 未安装，是否安装 PM2？(y/n)"
    read -r response
    if [ "$response" = "y" ]; then
        sudo npm install -g pm2
        echo "✓ PM2 安装完成"
    else
        echo "跳过 PM2 安装"
    fi
else
    echo "✓ PM2 已安装"
fi
echo ""

# 启动应用
echo "启动应用..."
if command -v pm2 &> /dev/null; then
    # 使用 PM2
    pm2 stop work-assessment 2>/dev/null
    pm2 delete work-assessment 2>/dev/null
    pm2 start ecosystem.config.js
    pm2 save
    echo "✓ 应用已通过 PM2 启动"
    echo ""
    echo "查看状态: pm2 status"
    echo "查看日志: pm2 logs work-assessment"
else
    # 直接启动
    echo "使用 npm start 启动应用（建议使用 PM2）"
    echo "运行: npm start"
fi

echo ""
echo "================================"
echo "部署完成！"
echo "================================"
echo "应用地址: http://localhost:3000"
echo "HR 后台: http://localhost:3000/hr-admin"
echo ""
echo "下一步："
echo "1. 配置 Nginx 反向代理（参考 nginx.conf.example）"
echo "2. 配置防火墙开放 80/443 端口"
echo "3. 配置 SSL 证书（可选）"
echo ""
