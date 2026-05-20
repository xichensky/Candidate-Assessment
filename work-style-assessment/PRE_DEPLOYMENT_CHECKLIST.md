# 部署前检查清单

## 📋 必须完成的准备工作

### 1. 环境变量配置 ⚠️

**当前状态：** 需要配置

**文件位置：** `.env.local`（本地）或 Vercel 环境变量（生产）

**必须配置的变量：**

```env
# 邮件服务器配置（必须）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com

# 网站基础 URL（必须）
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

**配置步骤：**

1. **获取 Gmail 应用专用密码**
   - 访问：https://myaccount.google.com/apppasswords
   - 启用两步验证
   - 生成应用专用密码
   - 复制密码作为 `SMTP_PASSWORD`

2. **创建环境变量文件**（本地测试用）
   ```bash
   cp .env.example .env.local
   # 编辑 .env.local 填入真实配置
   ```

3. **Vercel 部署配置**（生产环境）
   - 在 Vercel 项目设置中添加环境变量
   - 不要将 `.env.local` 提交到 Git

---

### 2. 数据存储方案 ⚠️

**当前状态：** 使用 localStorage（仅适合演示）

**生产环境建议：** 迁移到数据库

**可选方案：**

#### 方案 A：继续使用 localStorage（快速上线）
- ✅ 无需额外配置
- ✅ 立即可用
- ⚠️ 数据存储在浏览器本地
- ⚠️ 无法跨浏览器共享
- ⚠️ 清除浏览器数据会丢失

**适用场景：** 演示、小规模使用

#### 方案 B：迁移到 Vercel PostgreSQL（推荐）
```bash
# 安装依赖
npm install @vercel/postgres

# 创建数据表
# 参考文档：https://vercel.com/docs/storage/vercel-postgres
```

#### 方案 C：使用 MongoDB Atlas（免费额度）
```bash
# 安装依赖
npm install mongodb mongoose

# 注册 MongoDB Atlas
# https://www.mongodb.com/cloud/atlas
```

#### 方案 D：使用 Supabase（开源免费）
```bash
# 安装依赖
npm install @supabase/supabase-js

# 注册 Supabase
# https://supabase.com
```

**建议：** 如果是正式使用，请在部署后尽快迁移数据库。

---

### 3. HR 后台访问控制 ⚠️

**当前状态：** 无登录保护（任何人都可访问）

**安全风险：** 
- 任何人知道 URL 就能查看候选人数据
- 可能泄露候选人隐私

**建议方案：**

#### 快速方案：简单密码保护
```bash
npm install bcryptjs
# 在页面添加简单密码验证
```

#### 推荐方案：NextAuth.js 认证
```bash
npm install next-auth
# 集成完整的身份验证系统
# 文档：https://next-auth.js.org/
```

#### 企业方案：SSO 单点登录
- 集成公司现有的认证系统
- LDAP / OAuth / SAML

**临时措施：**
- 不要公开分享 `/hr-admin` 链接
- 只在内部网络访问
- 定期检查访问日志

---

### 4. 代码检查 ✅

**运行检查：**

```bash
# 1. TypeScript 类型检查
npm run type-check  # 或 npx tsc --noEmit

# 2. ESLint 检查
npm run lint

# 3. 构建测试
npm run build

# 4. 本地预览生产版本
npm run start
```

**预期结果：** 所有检查通过，无错误

---

### 5. 功能测试 ✅

**测试清单：**

- [ ] **候选人端测试**
  - [ ] 欢迎页加载
  - [ ] 信息采集表单验证
  - [ ] 完成10道题目
  - [ ] 提交成功页面显示
  - [ ] 数据保存成功

- [ ] **邮件通知测试**
  - [ ] 配置邮件服务器
  - [ ] 完成一次测评
  - [ ] 检查邮箱收到通知
  - [ ] 邮件内容正确
  - [ ] 链接可点击

- [ ] **HR 后台测试**
  - [ ] 访问 `/hr-admin`
  - [ ] 查看候选人列表
  - [ ] 统计数据正确
  - [ ] 搜索和排序功能
  - [ ] 查看候选人详情
  - [ ] 答题记录显示完整

- [ ] **分享功能测试**
  - [ ] 复制链接成功
  - [ ] 二维码生成
  - [ ] 二维码可扫描
  - [ ] 扫描后跳转正确

- [ ] **响应式测试**
  - [ ] 桌面端显示正常
  - [ ] 平板端显示正常
  - [ ] 手机端显示正常

- [ ] **浏览器兼容性**
  - [ ] Chrome/Edge
  - [ ] Safari
  - [ ] Firefox
  - [ ] 移动浏览器

---

### 6. 性能优化 ✅

**已优化项：**
- ✅ Next.js 自动代码分割
- ✅ 图片懒加载
- ✅ 组件按需加载

**可选优化：**
- [ ] 添加 PWA 支持
- [ ] 启用 CDN
- [ ] 图片优化（使用 Next.js Image）
- [ ] 添加缓存策略

---

### 7. SEO 优化（可选）

**已配置：**
- ✅ 页面标题和描述（layout.tsx）

**可选配置：**
```typescript
// app/layout.tsx
export const metadata = {
  title: '工作风格测评系统',
  description: '专业的候选人工作风格测评工具',
  keywords: '工作风格,测评,HR,招聘',
  openGraph: {
    title: '工作风格测评系统',
    description: '了解候选人的工作风格',
    images: ['/og-image.png'],
  },
};
```

---

## 🚀 部署步骤

### 推荐：Vercel 部署（最简单）

#### 步骤 1：准备 GitHub 仓库

```bash
# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Ready for deployment"

# 推送到 GitHub
# 先在 GitHub 创建仓库，然后：
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

#### 步骤 2：连接 Vercel

1. 访问 https://vercel.com
2. 使用 GitHub 登录
3. 点击 "New Project"
4. 选择你的仓库
5. 点击 "Import"

#### 步骤 3：配置环境变量

在 Vercel 项目设置中添加：
```
SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASSWORD
SMTP_FROM
NEXT_PUBLIC_BASE_URL
```

#### 步骤 4：部署

1. Vercel 自动开始构建
2. 等待 2-3 分钟
3. 获得部署链接
4. 测试功能

#### 步骤 5：绑定域名（可选）

1. 在 Vercel 项目设置中添加自定义域名
2. 配置 DNS 记录
3. 等待生效

---

## ⚠️ 重要提醒

### 安全性

1. **不要提交敏感信息到 Git**
   - `.env.local` 已在 .gitignore 中
   - 检查没有硬编码的密码

2. **保护 HR 后台**
   - 尽快添加身份验证
   - 或使用 IP 白名单

3. **数据备份**
   - 定期导出数据
   - 考虑自动备份方案

### 性能

1. **监控资源使用**
   - Vercel 免费额度有限制
   - 注意并发访问量

2. **数据库选择**
   - localStorage 不适合大量数据
   - 建议迁移到云数据库

---

## ✅ 最终检查

部署前确认：

- [ ] 所有环境变量已配置
- [ ] 邮件服务测试通过
- [ ] 本地构建成功（`npm run build`）
- [ ] 所有测试通过
- [ ] `.env.local` 未提交到 Git
- [ ] GitHub 仓库已创建
- [ ] README.md 更新
- [ ] 已备份重要数据

---

## 🎉 准备就绪！

如果以上检查都已完成，你可以开始部署了！

**推荐顺序：**
1. 先部署到 Vercel（快速验证）
2. 测试所有功能
3. 添加身份验证
4. 迁移数据库
5. 绑定自定义域名
6. 正式上线

有任何问题随时询问！🚀
