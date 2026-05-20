# 工作风格测评系统 - 升级功能指南

## 🎉 新增功能概览

本次升级为工作风格测评系统添加了以下重要功能：

### 1. ✅ 候选人信息采集
- 在开始测评前，要求候选人填写姓名和应聘岗位
- 表单验证确保信息完整性
- 信息与测评结果关联存储

### 2. 🔒 候选人端结果隐藏
- 候选人完成测评后，不再显示评分和分析结果
- 改为显示"提交成功"页面，告知候选人已完成测评
- 保护测评结果，仅供 HR 查看

### 3. 📊 测评结果管理
- 访问路径：`/hr-admin`
- **列表视图**：显示所有候选人的基本信息和得分概览
- **详情视图**：查看完整的测评结果、雷达图、优势建议
- **答题记录**：查看候选人每道题的具体选择
- 搜索和排序功能，方便筛选候选人

### 4. 📧 自动邮件通知
- 候选人提交测评后，自动发送邮件至指定邮箱
- 邮件包含候选人姓名、岗位、提交时间
- 提供快捷链接，直达测评结果管理后台查看详情

## 🚀 快速开始

### 安装新依赖

```bash
npm install
```

新增依赖：
- `nodemailer`: 邮件发送功能
- `@types/nodemailer`: TypeScript 类型定义

### 配置邮件服务

1. 复制环境变量示例文件：
```bash
cp .env.example .env.local
```

2. 编辑 `.env.local` 文件，配置邮件服务器信息：

```env
# Gmail 配置示例
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com

# 网站基础 URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Gmail 配置步骤：**
1. 启用两步验证
2. 生成应用专用密码：https://myaccount.google.com/apppasswords
3. 使用应用专用密码作为 `SMTP_PASSWORD`

**Office 365 配置示例：**
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
```

### 启动开发服务器

```bash
npm run dev
```

## 📖 使用流程

### 候选人端流程

1. 访问首页 `http://localhost:3000`
2. 点击"开始测评"
3. 填写姓名和应聘岗位
4. 完成 10 道测评题目
5. 查看"提交成功"页面
6. 关闭页面

### 管理端流程

1. 访问测评结果管理后台 `http://localhost:3000/hr-admin`
2. 查看候选人列表（显示姓名、岗位、得分概览）
3. 使用搜索和排序功能筛选候选人
4. 点击候选人卡片查看详细结果
5. 查看：
   - 综合评价
   - 工作风格雷达图
   - 详细评分（内在能量、防御性、协作倾向）
   - 优势与建议
   - **每道题的具体答题情况**
6. 返回列表继续查看其他候选人

## 🔧 核心文件说明

### 新增组件

| 文件 | 说明 |
|------|------|
| `components/CandidateInfoForm.tsx` | 候选人信息采集表单 |
| `components/SubmittedPage.tsx` | 提交成功页面 |
| `app/hr-admin/page.tsx` | 测评结果管理列表页 |
| `app/hr-admin/[id]/page.tsx` | 测评结果管理详情页 |

### 新增工具函数

| 文件 | 说明 |
|------|------|
| `utils/storage.ts` | 本地存储管理（localStorage） |
| `app/api/send-notification/route.ts` | 邮件发送 API |

### 更新文件

| 文件 | 变更内容 |
|------|----------|
| `types/index.ts` | 添加 `CandidateInfo`、`AssessmentSubmission` 类型 |
| `app/page.tsx` | 整合新流程（信息采集 → 测评 → 提交） |

## 📊 数据存储说明

### 当前方案：localStorage

- 数据存储在浏览器本地
- 适合演示和小规模使用
- 数据在同一浏览器中持久保存

### 升级到数据库（可选）

如需在生产环境使用，建议升级到数据库存储：

1. 选择数据库（如 MongoDB、PostgreSQL、MySQL）
2. 修改 `utils/storage.ts` 中的存储逻辑
3. 创建 API Routes 用于数据的 CRUD 操作
4. 更新前端组件调用 API 而非直接操作 localStorage

## 🔐 安全建议

### 生产环境部署前：

1. **添加访问控制**
   - HR 后台应添加登录认证
   - 建议使用 NextAuth.js 或类似方案
   - 限制 `/hr-admin` 路由访问权限

2. **环境变量保护**
   - 不要将 `.env.local` 提交到代码仓库
   - 使用安全的密码和 API 密钥
   - 定期更换邮箱应用专用密码

3. **数据加密**
   - 敏感数据建议加密存储
   - 使用 HTTPS 协议传输数据

## 📧 邮件通知配置

### 收件人地址

默认发送至：`KTao@Ashleyfurniture.com`

如需修改，编辑 `app/api/send-notification/route.ts`：

```typescript
to: 'KTao@Ashleyfurniture.com', // 修改为你的邮箱
```

### 邮件内容定制

可在 `route.ts` 中修改邮件模板的 HTML 和纯文本内容。

## 🐛 常见问题

### Q: 邮件发送失败？
A: 检查 `.env.local` 配置是否正确，确认 SMTP 服务器地址、端口和认证信息。

### Q: 测评结果管理后台看不到候选人数据？
A: 确保在同一浏览器中访问，localStorage 数据是浏览器本地的。

### Q: 如何清空测试数据？
A: 打开浏览器开发者工具 → Application → Local Storage → 删除 `assessment_submissions` 键值。

### Q: 如何添加管理后台登录功能？
A: 建议使用 NextAuth.js，参考文档：https://next-auth.js.org/

## 📝 下一步优化建议

1. 添加测评结果管理后台登录认证
2. 导出 PDF 测评报告功能
3. 数据统计和可视化分析
4. 批量导出候选人数据
5. 自定义评分规则和阈值
6. 添加候选人照片上传功能
7. 集成第三方数据库存储

## 📞 技术支持

如有问题，请查看项目文档或联系开发团队。
