# 快速开始指南

## 🚀 最快速的部署方式（推荐）

### Vercel 一键部署

1. **点击下面的按钮**（需要先将代码推送到 GitHub）

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

2. **或者手动部署：**

   ```bash
   # 1. 安装 Vercel CLI
   npm i -g vercel
   
   # 2. 登录
   vercel login
   
   # 3. 部署
   vercel
   
   # 4. 部署到生产环境
   vercel --prod
   ```

3. **配置环境变量**

   在 Vercel 控制台添加以下环境变量：
   
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_FROM=your-email@gmail.com
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   ```

4. **重新部署**

   配置环境变量后，触发重新部署

---

## 📝 部署前必做的3件事

### 1️⃣ 配置邮件服务（5分钟）

**Gmail 配置步骤：**

1. 访问 https://myaccount.google.com/apppasswords
2. 启用两步验证（如果还没有）
3. 生成应用专用密码
   - 选择应用：邮件
   - 选择设备：其他（自定义名称）
   - 输入："工作风格测评系统"
4. 复制生成的密码（16位）
5. 在 Vercel 环境变量中使用这个密码

**验证邮件配置：**

完成一次测评，检查是否收到邮件通知。

---

### 2️⃣ 测试所有功能（10分钟）

**候选人端：**
- [ ] 访问首页
- [ ] 填写信息
- [ ] 完成测评
- [ ] 看到"提交成功"页面

**HR 管理端：**
- [ ] 访问 `/hr-admin`
- [ ] 查看候选人列表
- [ ] 点击查看详情
- [ ] 测试分享功能
- [ ] 扫描二维码

**邮件通知：**
- [ ] 收到邮件
- [ ] 点击链接跳转正确

---

### 3️⃣ 添加安全保护（可选但推荐）

**方案 A：简单密码保护**

在 `app/hr-admin/layout.tsx` 添加密码验证（快速方案）

**方案 B：NextAuth.js 认证**（推荐）

```bash
npm install next-auth
```

配置 GitHub/Google OAuth 登录

---

## 🌐 域名配置（可选）

### 在 Vercel 绑定自定义域名

1. 进入项目设置 → Domains
2. 添加你的域名（如 `assessment.yourcompany.com`）
3. 在域名服务商添加 DNS 记录：
   ```
   类型: CNAME
   名称: assessment
   值: cname.vercel-dns.com
   ```
4. 等待 DNS 生效（几分钟到几小时）

---

## 📊 数据库迁移（生产环境必做）

### 当前状态
✅ 使用 localStorage（适合演示）
⚠️ 数据存储在浏览器，不适合生产

### 推荐方案

#### 方案 1：Vercel Postgres（最简单）

```bash
# 在 Vercel 项目中启用 Postgres
# 点击 Storage → Create Database → Postgres

# 安装依赖
npm install @vercel/postgres

# 创建数据表（SQL）
CREATE TABLE submissions (
  id VARCHAR(255) PRIMARY KEY,
  candidate_name VARCHAR(255),
  position VARCHAR(255),
  answers JSONB,
  result JSONB,
  submitted_at TIMESTAMP
);
```

#### 方案 2：MongoDB Atlas（免费）

```bash
# 注册 https://www.mongodb.com/cloud/atlas
# 创建免费集群

npm install mongodb mongoose

# 添加环境变量
MONGODB_URI=mongodb+srv://...
```

#### 方案 3：Supabase（开源）

```bash
# 注册 https://supabase.com
npm install @supabase/supabase-js

# 添加环境变量
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 🔧 常用命令

```bash
# 本地开发
npm run dev

# 构建测试
npm run build

# 预览生产版本
npm run start

# 代码检查
npm run lint

# 部署到 Vercel
vercel --prod

# 查看部署日志
vercel logs
```

---

## 📱 访问地址

部署完成后：

- **候选人端：** `https://your-app.vercel.app`
- **HR 管理端：** `https://your-app.vercel.app/hr-admin`

建议将 HR 管理端地址添加到浏览器书签。

---

## ⚡ 性能优化

### Vercel 免费额度

- 带宽：100GB/月
- 函数执行时间：100小时/月
- 部署次数：无限制

### 超出额度？

1. 升级到 Pro 计划（$20/月）
2. 或迁移到自己的服务器

---

## 🆘 遇到问题？

### 构建失败

```bash
# 检查依赖
npm install

# 本地构建测试
npm run build
```

### 邮件发送失败

- 检查环境变量是否配置正确
- 确认 Gmail 应用专用密码有效
- 查看 Vercel 函数日志

### 数据丢失

- localStorage 数据在浏览器本地
- 尽快迁移到数据库
- 定期导出数据备份

---

## 📞 获取帮助

- **Vercel 文档：** https://vercel.com/docs
- **Next.js 文档：** https://nextjs.org/docs
- **Vercel 支持：** https://vercel.com/support

---

## ✅ 部署成功！

🎉 恭喜！你的工作风格测评系统已经上线了！

**下一步：**
1. 分享链接给候选人
2. 监控测评数据
3. 根据需要添加功能
4. 考虑数据库迁移

祝使用愉快！🚀
