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

  // 限制协作分数在-3到3之间
  const clampedCollaboration = Math.max(-3, Math.min(3, collaborationScore));

  return {
    energy: energyScore,
    defense: defenseScore,
    collaboration: clampedCollaboration,
    energyLevel: getEnergyLevel(energyScore),
    defenseLevel: getDefenseLevel(defenseScore),
    collaborationLevel: getCollaborationLevel(clampedCollaboration),
  };
}

/**
 * 获取内在能量等级描述
 * 范围：0-3分
 */
function getEnergyLevel(score: number): string {
  if (score >= 3) return '正常';
  if (score >= 2) return '正常';
  if (score >= 1) return '正常';
  return '正常';
}

/**
 * 获取防御性等级描述
 * 范围：0-12分
 */
function getDefenseLevel(score: number): string {
  if (score >= 9) return '偏高';
  if (score >= 6) return '中等';
  if (score >= 3) return '正常';
  return '正常';
}

/**
 * 获取协作倾向等级描述
 * 范围：-3到+3分
 */
function getCollaborationLevel(score: number): string {
  // 限制分数在-3到3之间
  const clampedScore = Math.max(-3, Math.min(3, score));

  if (clampedScore >= 3) return '正常';
  if (clampedScore >= 1) return '正常';
  if (clampedScore >= -1) return '正常';
  return '正常';
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
