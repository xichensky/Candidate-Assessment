import { Question } from '@/types';

/**
 * 工作风格测评题目
 *
 * 评分说明：
 * 模块1 - 内在能量 & 弹性指数（0-3分）：越高表示能量越足、弹性越好
 * 模块2 - 防御性 & 攻击风险指数（0-12分）：越高表示防御性越强、攻击风险越高
 * 模块3 - 团队协作倾向（-3到+3分）：正分表示协作倾向强，负分表示个人主义倾向
 */

export const questions: Question[] = [
  // ========== 模块1：内在能量 & 弹性指数 ==========
  {
    id: 1,
    module: 1,
    text: '当你发现一个问题短期内很难解决时，你更可能：',
    options: [
      { id: 'A', text: '先放一放，等条件成熟再说', scores: { energy: 1 } },
      { id: 'B', text: '拆成更小的问题逐步推进', scores: { energy: 0 } },
      { id: 'C', text: '反复思考哪里出了根本性错误', scores: { energy: 0 } },
      { id: 'D', text: '转向处理其他更容易推进的事情', scores: { energy: 1 } },
    ],
  },
  {
    id: 2,
    module: 1,
    text: '当你回顾过去一年时，你更常记得的是:',
    options: [
      { id: 'A', text: '做成的事情', scores: { energy: 0 } },
      { id: 'B', text: '没做成但学到的东西', scores: { energy: 0 } },
      { id: 'C', text: '本可以做得更好的地方', scores: { energy: 1 } },
      { id: 'D', text: '外部条件带来的限制', scores: { energy: 1 } },
    ],
  },
  {
    id: 3,
    module: 1,
    text: '如果连续几次尝试都没有明显进展，你通常会',
    options: [
      { id: 'A', text: '调整方法继续尝试', scores: { energy: 0 } },
      { id: 'B', text: '暂停一下重新评估方向', scores: { energy: 0 } },
      { id: 'C', text: '怀疑这个方向是否本就不值得', scores: { energy: 1 } },
      { id: 'D', text: '等待外部变化再行动', scores: { energy: 1 } },
    ],
  },

  // ========== 模块2：防御性 & 攻击风险指数 ==========
  {
    id: 4,
    module: 2,
    text: '在讨论中，如果你的观点没有被采纳，你更接近哪种反应',
    options: [
      { id: 'A', text: '继续补充信息，希望对方理解', scores: { defense: 2 } },
      { id: 'B', text: '接受结果，观察后续发展', scores: { defense: 0 } },
      { id: 'C', text: '觉得对方并没有真正理解问题', scores: { defense: 3 } },
      { id: 'D', text: '减少在类似场合表达观点', scores: { defense: 4 } },
    ],
  },
  {
    id: 5,
    module: 2,
    text: '当一个决策结果对你不利，但对整体可能有利时，你更可能',
    options: [
      { id: 'A', text: '支持决策并调整自己的策略', scores: { defense: 0 } },
      { id: 'B', text: '提出不同意见但服从结果', scores: { defense: 1 } },
      { id: 'C', text: '表面接受，内心保留判断', scores: { defense: 3 } },
      { id: 'D', text: '认为这不是一个公平的决策', scores: { defense: 4 } },
    ],
  },
  {
    id: 6,
    module: 2,
    text: '如果他人指出你的方案存在问题，你第一时间更可能关注:',
    options: [
      { id: 'A', text: '问题本身是否成立', scores: { defense: 1 } },
      { id: 'B', text: '如何快速修正', scores: { defense: 0 } },
      { id: 'C', text: '对方是否理解你的初衷', scores: { defense: 3 } },
      { id: 'D', text: '为什么这个问题现在才被提出', scores: { defense: 4 } },
    ],
  },

  // ========== 模块3：团队协作倾向 ==========
  {
    id: 7,
    module: 3,
    text: '在一个协作项目中，你更认同哪种说法:',
    options: [
      { id: 'A', text: '把自己的部分做到最好最重要', scores: { collaboration: 0 } },
      { id: 'B', text: '确保整体结果比个人表现更重要', scores: { collaboration: 1 } },
      { id: 'C', text: '不拖后腿就是合格', scores: { collaboration: -1 } },
      { id: 'D', text: '关键是自己的贡献被看见', scores: { collaboration: -1 } },
    ],
  },
  {
    id: 8,
    module: 3,
    text: '当团队中出现明显分歧时，你更自然的角色是:',
    options: [
      { id: 'A', text: '提出明确立场推动决定', scores: { collaboration: 0 } },
      { id: 'B', text: '帮助梳理不同观点', scores: { collaboration: 1 } },
      { id: 'C', text: '观察局势，等待明确方向', scores: { collaboration: -1 } },
      { id: 'D', text: '倾向站在自己更有把握的一方', scores: { collaboration: -1 } },
    ],
  },
  {
    id: 9,
    module: 3,
    text: '如果团队节奏被个别人拖慢，你更可能:',
    options: [
      { id: 'A', text: '主动帮助对方', scores: { collaboration: 1 } },
      { id: 'B', text: '调整分工绕开瓶颈', scores: { collaboration: 0 } },
      { id: 'C', text: '对效率下降感到不满', scores: { collaboration: -1 } },
      { id: 'D', text: '认为这是管理层需要解决的问题', scores: { collaboration: -1 } },
    ],
  },
  {
    id: 10,
    module: 3,
    text: '你更认同下面哪句话:',
    options: [
      { id: 'A', text: '把事情做对，比证明自己更重要', scores: { collaboration: 1 } },
      { id: 'B', text: '被认可，才能持续投入', scores: { collaboration: 0 } },
      { id: 'C', text: '结果说明一切，过程不重要', scores: { collaboration: -1 } },
      { id: 'D', text: '如果规则不合理，突破规则是必要的', scores: { collaboration: 0 } },
    ],
  },
];
