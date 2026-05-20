# 自建服务器部署指南

## 📋 系统要求

- **操作系统**：Linux (Ubuntu 20.04+, CentOS 7+) / Windows Server
- **Node.js**：v18.0.0 或更高版本
- **内存**：至少 1GB RAM
- **磁盘**：至少 2GB 可用空间
- **端口**：3000（或自定义端口）

---

## 🚀 部署步骤

### 步骤 1：安装 Node.js

#### Ubuntu/Debian:
```bash
# 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v  # 应显示 v18.x.x
npm -v
```

#### CentOS/RHEL:
```bash
# 安装 Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 验证安装
node -v
npm -v
```

---

### 步骤 2：上传代码到服务器

#### 方法 A：使用 Git（推荐）
```bash
# 在服务器上克隆仓库
cd /var/www  # 或你的项目目录
git clone https://github.com/xichensky/Candidate-Assessment.git
cd Candidate-Assessment/work-style-assessment
```

#### 方法 B：使用 FTP/SCP
将整个 `work-style-assessment` 文件夹上传到服务器

---

### 步骤 3：安装依赖

```bash
cd work-style-assessment
npm install --production
```

---

### 步骤 4：配置环境变量

创建 `.env.local` 文件：

```bash
nano .env.local
```

添加以下内容（根据实际情况修改）：

```env
# 邮件配置（可选）
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
SMTP_FROM=your-email@example.com
SMTP_TO=hr@example.com

# 网站 URL（用于邮件链接）
NEXT_PUBLIC_BASE_URL=http://your-domain.com
```

保存并退出（Ctrl+X, Y, Enter）

---

### 步骤 5：构建项目

```bash
npm run build
```

---

### 步骤 6：启动应用

#### 方法 A：直接启动（测试用）
```bash
npm start
# 应用将在 http://localhost:3000 运行
```

#### 方法 B：使用 PM2（推荐生产环境）
```bash
# 安装 PM2
sudo npm install -g pm2

# 启动应用
pm2 start npm --name "work-assessment" -- start

# 设置开机自启
pm2 startup
pm2 save

# 查看状态
pm2 status

# 查看日志
pm2 logs work-assessment
```

---

### 步骤 7：配置 Nginx 反向代理（推荐）

#### 安装 Nginx:
```bash
sudo apt-get install nginx  # Ubuntu/Debian
# 或
sudo yum install nginx      # CentOS
```

#### 创建 Nginx 配置:
```bash
sudo nano /etc/nginx/sites-available/assessment
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 改为你的域名或 IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/assessment /etc/nginx/sites-enabled/
sudo nginx -t  # 测试配置
sudo systemctl restart nginx
```

---

## 🔒 配置 HTTPS（可选但推荐）

使用 Let's Encrypt 免费证书：

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书并自动配置 Nginx
sudo certbot --nginx -d your-domain.com

# 设置自动续期
sudo certbot renew --dry-run
```

---

## 🔧 常用管理命令

### PM2 管理命令:
```bash
# 重启应用
pm2 restart work-assessment

# 停止应用
pm2 stop work-assessment

# 删除应用
pm2 delete work-assessment

# 查看日志
pm2 logs work-assessment

# 监控
pm2 monit
```

### 更新代码:
```bash
cd /var/www/Candidate-Assessment/work-style-assessment
git pull origin main
npm install
npm run build
pm2 restart work-assessment
```

---

## 📊 性能优化建议

1. **启用 Gzip 压缩**（在 Nginx 配置中）
2. **配置缓存**
3. **使用 CDN**（如果有静态资源）
4. **定期备份数据库**（如果迁移到数据库）

---

## ⚠️ 注意事项

1. **localStorage 限制**：
   - 当前使用浏览器 localStorage 存储数据
   - 数据存储在用户浏览器本地
   - 建议迁移到数据库（见数据库迁移指南）

2. **防火墙配置**：
   - 开放 80 端口（HTTP）
   - 开放 443 端口（HTTPS，如果使用）

3. **安全建议**：
   - 修改默认管理密码（admin123）
   - 添加 HR 后台登录验证
   - 定期更新依赖包

---

## 📞 故障排查

### 应用无法启动:
```bash
# 检查 Node.js 版本
node -v

# 检查端口占用
sudo netstat -tulpn | grep 3000

# 查看 PM2 日志
pm2 logs work-assessment --lines 50
```

### 无法访问:
```bash
# 检查防火墙
sudo ufw status  # Ubuntu
sudo firewall-cmd --list-all  # CentOS

# 检查 Nginx 状态
sudo systemctl status nginx

# 检查 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

---

## 📦 目录结构

```
work-style-assessment/
├── app/                 # Next.js 页面
├── components/          # React 组件
├── data/               # 测评题目数据
├── types/              # TypeScript 类型
├── utils/              # 工具函数
├── public/             # 静态资源
├── .env.local          # 环境变量（需创建）
├── package.json        # 依赖配置
└── next.config.js      # Next.js 配置
```

---

## 🆘 获取帮助

如有问题，请检查：
1. PM2 日志：`pm2 logs`
2. Nginx 日志：`/var/log/nginx/error.log`
3. 系统日志：`journalctl -xe`
