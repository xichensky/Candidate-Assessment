# 快速部署指南

## ✅ 代码现状

**当前代码已经可以直接部署到自建服务器，无需修改！**

---

## 🚀 最快部署方式（5分钟）

### 在服务器上执行：

```bash
# 1. 克隆代码
git clone https://github.com/xichensky/Candidate-Assessment.git
cd Candidate-Assessment/work-style-assessment

# 2. 运行自动部署脚本
chmod +x deploy.sh
./deploy.sh
```

脚本会自动：
- ✅ 检查 Node.js 环境
- ✅ 安装依赖
- ✅ 构建项目
- ✅ 启动应用（使用 PM2）

---

## 📋 需要修改的配置（可选）

### 1. 邮件配置（如果需要邮件通知）

编辑 `.env.local`：
```bash
nano .env.local
```

填入公司邮箱配置：
```env
SMTP_HOST=smtp.company.com
SMTP_USER=hr@company.com
SMTP_PASSWORD=your-password
```

### 2. 域名配置

如果使用域名访问，修改 Nginx 配置：
```bash
sudo nano /etc/nginx/sites-available/assessment
```

将 `your-domain.com` 改为实际域名。

---

## 🌐 访问地址

部署完成后：

- **候选人测评入口**：`http://服务器IP:3000`
- **HR 管理后台**：`http://服务器IP:3000/hr-admin`
- **清空数据页面**：`http://服务器IP:3000/admin/clear-data`

如果配置了 Nginx 和域名：
- `http://your-domain.com`
- `http://your-domain.com/hr-admin`

---

## ⚙️ 常用命令

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs work-assessment

# 重启应用
pm2 restart work-assessment

# 停止应用
pm2 stop work-assessment

# 更新代码
git pull
npm install
npm run build
pm2 restart work-assessment
```

---

## 📂 重要文件

| 文件 | 说明 |
|------|------|
| `SELF_HOSTED_DEPLOYMENT.md` | 完整部署文档 |
| `deploy.sh` | 自动部署脚本 |
| `ecosystem.config.js` | PM2 配置文件 |
| `nginx.conf.example` | Nginx 配置示例 |
| `.env.example` | 环境变量示例 |

---

## 🔒 安全建议

1. **修改管理密码**：
   - 默认密码：`admin123`
   - 在代码中搜索并修改

2. **配置防火墙**：
   ```bash
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

3. **配置 HTTPS**：
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

---

## ❓ 常见问题

### Q: 代码需要修改吗？
**A: 不需要！** 当前代码可以直接部署。

### Q: 数据存储在哪里？
**A:** 目前使用浏览器 localStorage。如需数据库，查看详细文档。

### Q: 如何备份数据？
**A:** 
1. 在 HR 后台导出数据（需要添加导出功能）
2. 或迁移到数据库后定期备份

### Q: 支持多少用户？
**A:** 单服务器可支持数百并发用户。

---

## 📞 获取帮助

详细文档：查看 `SELF_HOSTED_DEPLOYMENT.md`

---

**部署完成后，记得测试所有功能！** ✅
