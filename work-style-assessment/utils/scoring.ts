import { Answer, AssessmentResult } from '@/types';
import { questions } from '@/data/questions';

/**
 * 计算测评结果
 * @param answers 用户的所有答案
 * @returns 评分结果
 */
export function calculateResult(answers: Answer[]): AssessmentResult {
  let energyScore = 0;
  let defenseScore = 0;
  let collaborationScore = 0;

  // 遍历所有答案计算得分
  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) return;

    const option = question.options.find((o) => o.id === answer.optionId);
    if (!option) return;

    // 累加各维度得分
    energyScore += option.scores.energy || 0;
    defenseScore += option.scores.defense || 0;
    collaborationScore += option.scores.collaboration || 0;
  });

  return {
    energy: energyScore,
    defense: defenseScore,
    collaboration: collaborationScore,
    energyLevel: getEnergyLevel(energyScore),
    defenseLevel: getDefenseLevel(defenseScore),
    collaborationLevel: getCollaborationLevel(collaborationScore),
  };
}

/**
 * 获取内在能量等级描述
 */
function getEnergyLevel(score: number): string {
  if (score >= 10) return '优秀 - 高能量高弹性';
  if (score >= 7) return '良好 - 较好的能量与弹性';
  if (score >= 4) return '正常 - 能量弹性适中';
  return '偏低 - 需要关注能量补充';
}

/**
 * 获取防御性等级描述
 */
function getDefenseLevel(score: number): string {
  if (score >= 9) return '偏高 - 建议关注开放性';
  if (score >= 6) return '中等 - 有一定防御倾向';
  if (score >= 3) return '正常 - 防御性适中';
  return '良好 - 开放接纳';
}

/**
 * 获取协作倾向等级描述
 */
function getCollaborationLevel(score: number): string {
  if (score >= 3) return '优秀 - 强协作导向';
  if (score >= 1) return '良好 - 倾向团队协作';
  if (score >= -1) return '正常 - 协作与独立平衡';
  return '偏个人 - 倾向独立工作';
}

/**
 * 获取综合评价
 */
export function getOverallAssessment(result: AssessmentResult): {
  summary: string;
  strengths: string[];
  suggestions: string[];
} {
  const strengths: string[] = [];
  const suggestions: string[] = [];

  // 根据能量得分
  if (result.energy >= 10) {
    strengths.push('具有出色的内在驱动力和问题解决韧性');
  } else if (result.energy >= 7) {
    strengths.push('面对挑战时能保持积极态度');
  } else if (result.energy < 4) {
    suggestions.push('可以尝试设定小目标，逐步积累成就感');
  }

  // 根据防御性得分
  if (result.defense <= 3) {
    strengths.push('开放接纳反馈，善于从他人视角看问题');
  } else if (result.defense >= 9) {
    suggestions.push('可以尝试更开放地接纳不同意见');
  } else if (result.defense >= 6) {
    suggestions.push('适度降低防御性有助于更好的沟通');
  }

  // 根据协作得分
  if (result.collaboration >= 3) {
    strengths.push('具有强烈的团队意识和协作精神');
  } else if (result.collaboration >= 1) {
    strengths.push('能够平衡个人贡献与团队目标');
  } else if (result.collaboration <= -2) {
    suggestions.push('可以多关注团队整体目标，培养协作意识');
  }

  let summary = '您的工作风格';
  if (strengths.length > 0) {
    summary += '展现出' + strengths[0];
  }

  if (strengths.length === 0 && suggestions.length === 0) {
    summary = '您的工作风格整体平衡，各维度表现稳定。';
    strengths.push('各项指标处于正常范围');
  }

  return { summary, strengths, suggestions };
}
