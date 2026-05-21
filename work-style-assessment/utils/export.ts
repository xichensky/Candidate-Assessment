import { Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AssessmentSubmission } from '@/types';
import { questions } from '@/data/questions';

/**
 * 导出为 Word 文档
 */
export async function exportToWord(submission: AssessmentSubmission): Promise<void> {
  try {
    const { candidateInfo, result, submittedAt, answers } = submission;

    const children: any[] = [
      // 标题
      new Paragraph({
        text: '工作风格测评结果报告',
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      }),

      // 候选人信息
      new Paragraph({
        children: [
          new TextRun({ text: '候选人姓名：', bold: true }),
          new TextRun(candidateInfo.name),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: '应聘职位：', bold: true }),
          new TextRun(candidateInfo.position),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: '测评日期：', bold: true }),
          new TextRun(new Date(submittedAt).toLocaleString('zh-CN')),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: '报告生成时间：', bold: true }),
          new TextRun(new Date().toLocaleString('zh-CN')),
        ],
        spacing: { after: 400 },
      }),

      // 分隔线
      new Paragraph({
        text: '═══════════════════════════════════════════════',
        spacing: { after: 300 },
      }),

      // 一、总体结果
      new Paragraph({
        text: '一、综合评估结果',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),

      // 详细评分
      new Paragraph({
        children: [
          new TextRun({ text: '1. 内在能量 & 弹性指数：', bold: true }),
          new TextRun(`${result.energy}/3  （${result.energyLevel}）`),
        ],
        spacing: { after: 150 },
        indent: { left: 300 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: '2. 防御性 & 攻击风险指数：', bold: true }),
          new TextRun(`${result.defense}/12  （${result.defenseLevel}）`),
        ],
        spacing: { after: 150 },
        indent: { left: 300 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: '3. 团队协作倾向：', bold: true }),
          new TextRun(`${result.collaboration}/3  （${result.collaborationLevel}）`),
        ],
        spacing: { after: 400 },
        indent: { left: 300 },
      }),

      // 分隔线
      new Paragraph({
        text: '═══════════════════════════════════════════════',
        spacing: { after: 300 },
      }),

      // 二、详细答题记录
      new Paragraph({
        text: '二、详细答题记录',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
    ];

    // 添加每道题的答题详情
    questions.forEach((question, index) => {
      const answer = answers.find(a => a.questionId === question.id);
      const selectedOption = question.options.find(o => o.id === answer?.optionId);

      const moduleName =
        question.module === 1 ? '模块1：内在能量 & 弹性指数' :
        question.module === 2 ? '模块2：防御性 & 攻击风险指数' :
        '模块3：团队协作倾向';

      children.push(
        // 题目编号和模块
        new Paragraph({
          children: [
            new TextRun({ text: `题目 ${question.id}  `, bold: true, size: 24 }),
            new TextRun({ text: `[${moduleName}]`, italics: true, size: 20 }),
          ],
          spacing: { before: 300, after: 100 },
        }),

        // 题目内容
        new Paragraph({
          text: question.text,
          spacing: { after: 150 },
          indent: { left: 300 },
        }),

        // 选项列表
        new Paragraph({
          children: [
            new TextRun({ text: '选项：', bold: true }),
          ],
          spacing: { after: 100 },
          indent: { left: 300 },
        })
      );

      // 每个选项
      question.options.forEach(option => {
        const isSelected = option.id === answer?.optionId;
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: isSelected ? '● ' : '○ ',
                bold: isSelected,
              }),
              new TextRun({
                text: `${option.id}. ${option.text}`,
                bold: isSelected,
                color: isSelected ? '2563EB' : '000000',
              }),
              ...(isSelected ? [new TextRun({ text: '  【已选择】', bold: true, color: '2563EB' })] : []),
            ],
            spacing: { after: 80 },
            indent: { left: 500 },
          })
        );
      });
    });

    // 添加页脚
    children.push(
      new Paragraph({
        text: '═══════════════════════════════════════════════',
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: '本报告仅供招聘与人才发展使用，不得用于其他用途。', italics: true }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 100 },
      })
    );

    // 创建文档
    const doc = new Document({
      sections: [{
        properties: {},
        children: children,
      }],
    });

    // 生成并下载
    const blob = await (await import('docx')).Packer.toBlob(doc);
    const fileName = generateFileName(candidateInfo.name, candidateInfo.position, 'docx');
    saveAs(blob, fileName);
  } catch (error) {
    console.error('导出 Word 失败:', error);
    throw new Error('导出 Word 失败，请稍后重试');
  }
}

/**
 * 导出为 PDF 文档（使用 HTML 转 PDF 方式以支持中文）
 */
export async function exportToPDF(submission: AssessmentSubmission): Promise<void> {
  try {
    const { candidateInfo, result, submittedAt, answers } = submission;

    // 创建一个临时的 HTML 容器
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '210mm'; // A4 宽度
    tempDiv.style.padding = '20mm';
    tempDiv.style.fontFamily = 'Arial, "Microsoft YaHei", "Helvetica Neue", sans-serif';
    tempDiv.style.fontSize = '12px';
    tempDiv.style.lineHeight = '1.6';
    tempDiv.style.color = '#000';

    // 生成答题记录 HTML
    let answersHTML = '';
    questions.forEach((question) => {
      const answer = answers.find(a => a.questionId === question.id);
      const selectedOption = question.options.find(o => o.id === answer?.optionId);

      const moduleName =
        question.module === 1 ? '模块1：内在能量 & 弹性指数' :
        question.module === 2 ? '模块2：防御性 & 攻击风险指数' :
        '模块3：团队协作倾向';

      answersHTML += `
        <div style="margin-bottom: 20px; page-break-inside: avoid;">
          <div style="font-weight: bold; margin-bottom: 8px; font-size: 13px;">
            题目 ${question.id} [${moduleName}]
          </div>
          <div style="margin-bottom: 10px; margin-left: 15px;">
            ${question.text}
          </div>
          <div style="margin-left: 15px;">
            <div style="font-weight: bold; margin-bottom: 5px; font-size: 11px;">选项：</div>
            ${question.options.map(option => {
              const isSelected = option.id === answer?.optionId;
              return `
                <div style="margin-bottom: 5px; padding-left: 10px; ${isSelected ? 'font-weight: bold; color: #2563EB;' : ''}">
                  ${isSelected ? '●' : '○'} ${option.id}. ${option.text}${isSelected ? ' 【已选择】' : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    });

    // 构建完整 HTML
    tempDiv.innerHTML = `
      <div style="font-family: Arial, 'Microsoft YaHei', sans-serif;">
        <!-- 标题 -->
        <h1 style="text-align: center; font-size: 22px; margin-bottom: 25px; color: #1a1a1a;">
          工作风格测评结果报告
        </h1>

        <!-- 候选人信息 -->
        <div style="margin-bottom: 30px; border: 1px solid #ddd; padding: 15px; background: #f9f9f9;">
          <div style="margin-bottom: 8px;"><strong>候选人姓名：</strong>${candidateInfo.name}</div>
          <div style="margin-bottom: 8px;"><strong>应聘职位：</strong>${candidateInfo.position}</div>
          <div style="margin-bottom: 8px;"><strong>测评日期：</strong>${new Date(submittedAt).toLocaleString('zh-CN')}</div>
          <div><strong>报告生成时间：</strong>${new Date().toLocaleString('zh-CN')}</div>
        </div>

        <hr style="border: none; border-top: 2px solid #333; margin: 25px 0;" />

        <!-- 一、综合评估结果 -->
        <h2 style="font-size: 16px; margin-bottom: 15px; color: #1a1a1a;">一、综合评估结果</h2>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background: #4285f4; color: white;">
              <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">评估维度</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: center; width: 100px;">得分</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: center; width: 120px;">等级</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #ddd; padding: 10px;">内在能量 & 弹性指数</td>
              <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${result.energy}/3</td>
              <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${result.energyLevel}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="border: 1px solid #ddd; padding: 10px;">防御性 & 攻击风险指数</td>
              <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${result.defense}/12</td>
              <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${result.defenseLevel}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 10px;">团队协作倾向</td>
              <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${result.collaboration}/3</td>
              <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${result.collaborationLevel}</td>
            </tr>
          </tbody>
        </table>

        <hr style="border: none; border-top: 2px solid #333; margin: 25px 0;" />

        <!-- 二、详细答题记录 -->
        <h2 style="font-size: 16px; margin-bottom: 15px; color: #1a1a1a;">二、详细答题记录</h2>

        ${answersHTML}

        <hr style="border: none; border-top: 1px solid #999; margin: 30px 0 15px;" />

        <!-- 页脚 -->
        <div style="text-align: center; font-size: 10px; color: #666; font-style: italic;">
          本报告仅供招聘与人才发展使用，不得用于其他用途。
        </div>
      </div>
    `;

    document.body.appendChild(tempDiv);

    // 使用 html2canvas + jsPDF 生成 PDF
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // 移除临时元素
    document.body.removeChild(tempDiv);

    // 创建 PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 宽度
    const pageHeight = 297; // A4 高度
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // 添加第一页
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 如果内容超过一页，继续添加
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // 保存
    const fileName = generateFileName(candidateInfo.name, candidateInfo.position, 'pdf');
    pdf.save(fileName);
  } catch (error) {
    console.error('导出 PDF 失败:', error);
    throw new Error('导出 PDF 失败，请稍后重试');
  }
}

/**
 * 生成文件名
 */
function generateFileName(name: string, position: string, extension: 'docx' | 'pdf'): string {
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const timeStr = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  return `工作风格测评_${name}_${position}_${dateStr}-${timeStr}.${extension}`;
}
