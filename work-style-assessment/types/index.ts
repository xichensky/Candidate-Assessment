// 题目选项类型
export interface Option {
  id: string;
  text: string;
  // 各维度的得分影响
  scores: {
    energy?: number;        // 内在能量 & 弹性指数
    defense?: number;       // 防御性 & 攻击风险指数
    collaboration?: number; // 团队协作倾向
  };
}

// 题目类型
export interface Question {
  id: number;
  module: 1 | 2 | 3;
  text: string;
  options: Option[];
}

// 用户答案类型
export interface Answer {
  questionId: number;
  optionId: string;
}

// 候选人信息类型
export interface CandidateInfo {
  name: string;
  position: string;
}

// 评分结果类型
export interface AssessmentResult {
  energy: number;          // 0-12
  defense: number;         // 0-12
  collaboration: number;   // -3 to +3
  energyLevel: string;     // 评级描述
  defenseLevel: string;    // 评级描述
  collaborationLevel: string; // 评级描述
}

// 完整的测评提交数据类型
export interface AssessmentSubmission {
  id: string;
  candidateInfo: CandidateInfo;
  answers: Answer[];
  result: AssessmentResult;
  submittedAt: string;
}

// 测评状态类型
export type AssessmentStage = 'welcome' | 'info' | 'testing' | 'submitted' | 'result';
