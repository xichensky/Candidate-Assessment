import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateName, position, submissionId } = body;

    if (!candidateName || !position) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 配置邮件发送器（使用环境变量配置）
    // 注意：需要在 .env.local 中配置邮件服务器信息
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // 邮件内容
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: 'KTao@Ashleyfurniture.com',
      subject: `[测评通知] 候选人 ${candidateName} 已完成工作风格测评`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0ea5e9; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9; }
            .info-item { margin: 10px 0; }
            .info-label { font-weight: bold; color: #0369a1; }
            .button { display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🎯 工作风格测评通知</h1>
            </div>
            <div class="content">
              <p>您好，</p>
              <p>有新的候选人已完成工作风格测评，详细信息如下：</p>
              
              <div class="info-box">
                <div class="info-item">
                  <span class="info-label">候选人姓名：</span>
                  <span>${candidateName}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">应聘岗位：</span>
                  <span>${position}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">提交时间：</span>
                  <span>${new Date().toLocaleString('zh-CN', { 
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                  })}</span>
                </div>
                ${submissionId ? `
                <div class="info-item">
                  <span class="info-label">提交编号：</span>
                  <span>${submissionId}</span>
                </div>
                ` : ''}
              </div>

              <p><strong>请登录测评结果管理后台查看详细的测评结果和候选人工作风格画像。</strong></p>

              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/hr-admin" class="button">
                查看测评结果 →
              </a>

              <div class="footer">
                <p>此邮件由工作风格测评系统自动发送，请勿直接回复。</p>
                <p>如有疑问，请联系系统管理员。</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
候选人 ${candidateName} 已完成工作风格测评

候选人信息：
- 姓名：${candidateName}
- 应聘岗位：${position}
- 提交时间：${new Date().toLocaleString('zh-CN')}
${submissionId ? `- 提交编号：${submissionId}` : ''}

请登录测评结果管理后台查看详细的测评结果和候选人工作风格画像。

后台地址：${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/hr-admin
      `,
    };

    // 发送邮件
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Notification email sent successfully',
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json(
      { error: 'Failed to send notification email', details: String(error) },
      { status: 500 }
    );
  }
}
