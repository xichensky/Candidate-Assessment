# 工作风格测评系统 - 部署指南

## 🚀 部署方式选择

根据你的需求，推荐以下几种部署方式：

### 1. **Vercel 部署（推荐）** ⭐
- ✅ 最简单，一键部署
- ✅ 免费额度充足
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 自动构建和部署
- ✅ 完美支持 Next.js

### 2. **云服务器部署**
- Ubuntu/CentOS + Nginx + PM2
- 需要自己配置服务器
- 更灵活，但需要运维经验

### 3. **Docker 部署**
- 容器化部署
- 易于迁移和扩展
- 适合有 DevOps 经验的团队

---

## 📋 部署前准备清单

### 必须配置项

- [ ] 邮件服务器配置（SMTP）
- [ ] 环境变量设置
- [ ] 数据库选择（可选，当前用 localStorage）
- [ ] 域名准备（可选）

### 建议配置项

- [ ] 添加登录认证（保护 HR 后台）
- [ ] 配置数据库（生产环境推荐）
- [ ] 设置监控和日志
- [ ] 配置备份策略

---

## 🎯 方案一：Vercel 部署（推荐）

### 步骤 1：准备 Vercel 账号

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 授权 Vercel 访问你的仓库

### 步骤 2：推送代码到 GitHub

```bash
# 初始化 Git 仓库（如果还没有）
cd work-style-assessment
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit - Work Style Assessment System"

# 创建 GitHub 仓库后，关联远程仓库
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 推送到 GitHub
git push -u origin main
```

### 步骤 3：在 Vercel 导入项目

1. 登录 Vercel
2. 点击 "New Project"
3. 选择你的 GitHub 仓库
4. 点击 "Import"

### 步骤 4：配置环境变量

在 Vercel 项目设置中添加以下环境变量：

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

### 步骤 5：部署

1. Vercel 会自动开始构建
2. 等待 2-3 分钟
3. 部署完成后会得到一个链接
4. 访问链接测试功能

### 步骤 6：绑定自定义域名（可选）

1. 在 Vercel 项目设置中进入 "Domains"
2. 添加你的域名
3. 按照提示配置 DNS
4. 等待 DNS 生效

---

## 🎯 方案二：云服务器部署

### 步骤 1：准备服务器

推荐配置：
- CPU: 1核
- 内存: 2GB
- 系统: Ubuntu 22.04 LTS

云服务商选择：
- 阿里云
- 腾讯云
- AWS
- DigitalOcean

### 步骤 2：安装必要软件

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 PM2（进程管理器）
sudo npm install -g pm2

# 安装 Nginx
sudo apt install -y nginx
```

### 步骤 3：上传项目代码

```bash
# 在服务器上克隆代码
cd /var/www
sudo git clone https://github.com/你的用户名/你的仓库名.git work-style-assessment
cd work-style-assessment

# 安装依赖
npm install

# 创建生产环境变量文件
sudo nano .env.local
# 粘贴环境变量配置

# 构建项目
npm run build
```

### 步骤 4：使用 PM2 启动

```bash
# 启动应用
pm2 start npm --name "work-assessment" -- start

# 设置开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs work-assessment
```

### 步骤 5：配置 Nginx

```bash
# 创建 Nginx 配置
sudo nano /etc/nginx/sites-available/work-assessment
```

粘贴以下配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/work-assessment /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 步骤 6：配置 HTTPS（使用 Let's Encrypt）

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com

# 自动续期测试
sudo certbot renew --dry-run
```

---

## 🎯 方案三：Docker 部署

### 创建 Dockerfile

创建文件 `work-style-assessment/Dockerfile`：

```dockerfile
FROM node:18-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 构建应用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 生产环境
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASSWORD=${SMTP_PASSWORD}
      - NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
    restart: unless-stopped
```

### 部署命令

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

---

## 📧 邮件服务配置

### Gmail 配置

1. 启用两步验证
2. 访问 https://myaccount.google.com/apppasswords
3. 生成应用专用密码
4. 使用该密码作为 `SMTP_PASSWORD`

### Office 365 配置

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
```

### 企业邮箱配置

请联系你的 IT 部门获取 SMTP 配置信息。

---

## 🔐 安全加固建议

### 1. 添加身份验证

当前测评结果管理后台没有登录保护，建议添加：

```bash
# 安装 NextAuth.js
npm install next-auth

# 配置认证
# 参考：https://next-auth.js.org/
```

### 2. 数据库迁移

当前使用 localStorage，生产环境建议使用：
- MongoDB
- PostgreSQL
- MySQL

### 3. 限流保护

防止恶意提交：

```bash
npm install express-rate-limit
```

### 4. 环境变量保护

- 不要将 `.env.local` 提交到 Git
- 使用加密的环境变量管理服务

---

## 📊 监控和维护

### 日志监控

```bash
# PM2 日志
pm2 logs

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 性能监控

推荐工具：
- Vercel Analytics（Vercel 部署）
- Google Analytics
- Sentry（错误追踪）

### 数据备份

```bash
# 定时备份 localStorage 数据
# 建议迁移到数据库后设置自动备份
```

---

## ✅ 部署后检查清单

- [ ] 网站可以正常访问
- [ ] 候选人可以完成测评
- [ ] 邮件通知发送成功
- [ ] HR 后台可以查看结果
- [ ] 分享链接和二维码正常
- [ ] 移动端显示正常
- [ ] HTTPS 证书有效
- [ ] 环境变量配置正确

---

## 🆘 常见问题

### Q: 部署后页面显示 404？
A: 检查构建是否成功，查看服务器日志

### Q: 邮件发送失败？
A: 检查环境变量配置，确认 SMTP 服务器可访问

### Q: 数据丢失？
A: localStorage 数据在浏览器本地，建议尽快迁移到数据库

### Q: 性能问题？
A: 考虑启用 CDN，优化图片和资源加载

---

## 📞 获取帮助

- 查看 Next.js 文档：https://nextjs.org/docs
- Vercel 支持：https://vercel.com/support
- 项目 Issue 追踪（如果有 GitHub 仓库）

---

## 🎉 恭喜！

按照以上步骤，你的工作风格测评系统就可以正式上线了！

建议从 Vercel 开始，最简单快速。如有问题随时咨询！
