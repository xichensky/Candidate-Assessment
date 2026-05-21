'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AssessmentSubmission } from '@/types';
import { getSubmissionById } from '@/utils/storage';
import { questions } from '@/data/questions';
import { getOverallAssessment } from '@/utils/scoring';
import RadarChart from '@/components/RadarChart';
import ScoreBar from '@/components/ScoreBar';
import ExportButton from '@/components/ExportButton';

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [submission, setSubmission] = useState<AssessmentSubmission | null>(null);

  useEffect(() => {
    const id = params.id as string;
    const data = getSubmissionById(id);
    
    if (!data) {
      router.push('/hr-admin');
      return;
    }
    
    setSubmission(data);
  }, [params.id, router]);

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

	  const assessment = getOverallAssessment(submission.result);

	  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 返回按钮 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => router.push('/hr-admin')}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回列表
          </button>
        </motion.div>

        {/* 候选人信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {submission.candidateInfo.name}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {submission.candidateInfo.position}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(submission.submittedAt).toLocaleString('zh-CN')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ExportButton submission={submission} />
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">提交编号</div>
                <div className="text-xs font-mono text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                  {submission.id}
                </div>
              </div>
            </div>
          </div>
	        </motion.div>

	      {/* 详细评分 */}
	      <motion.div
	        initial={{ opacity: 0, y: 20 }}
	        animate={{ opacity: 1, y: 0 }}
	        transition={{ delay: 0.2 }}
	        className="card mb-6"
	      >
	        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
	          详细评分
	        </h2>
	        <div className="space-y-6">
	          <ScoreBar
	            label="内在能量 & 弹性指数"
	            score={submission.result.energy}
	            maxScore={3}
	            color="bg-green-500"
	            description={submission.result.energyLevel}
	            icon="⚡"
	          />
	          <ScoreBar
	            label="防御性 & 攻击风险指数"
	            score={submission.result.defense}
	            maxScore={12}
	            color="bg-yellow-500"
	            description={submission.result.defenseLevel}
	            icon="🛡️"
	            reverse
	          />
	          <ScoreBar
	            label="团队协作倾向"
	            score={submission.result.collaboration}
	            maxScore={3}
	            minScore={-3}
	            color="bg-blue-500"
	            description={submission.result.collaborationLevel}
	            icon="🤝"
	          />
	        </div>
	      </motion.div>

        {/* 答题详情 - 新增部分 */}
        <AnswerDetails answers={submission.answers} />
      </div>
    </div>
  );
}

// 答题详情组件
function AnswerDetails({ answers }: { answers: Array<{ questionId: number; optionId: string }> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="card"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        📋 详细答题记录
      </h2>
      <div className="space-y-6">
        {questions.map((question) => {
          const answer = answers.find((a) => a.questionId === question.id);
          const selectedOption = question.options.find((o) => o.id === answer?.optionId);

          return (
            <div
              key={question.id}
              className="border-l-4 border-primary-500 pl-4 py-2"
            >
              <div className="mb-3">
                <span className="inline-block bg-gray-100 dark:bg-gray-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                  {question.module === 1 && '模块1: 内在能量'}
                  {question.module === 2 && '模块2: 防御性'}
                  {question.module === 3 && '模块3: 团队协作'}
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  题目 {question.id}: {question.text}
                </h3>
              </div>
              <div className="space-y-2">
                {question.options.map((option) => (
                  <div
                    key={option.id}
                    className={`p-3 rounded-lg transition-colors ${
                      option.id === answer?.optionId
                        ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-500'
                        : 'bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          option.id === answer?.optionId
                            ? 'border-primary-600 bg-primary-600'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {option.id === answer?.optionId && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span
                          className={`font-semibold mr-2 ${
                            option.id === answer?.optionId
                              ? 'text-primary-900 dark:text-primary-300'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {option.id}.
                        </span>
                        <span
                          className={
                            option.id === answer?.optionId
                              ? 'text-primary-800 dark:text-primary-200'
                              : 'text-gray-700 dark:text-gray-300'
                          }
                        >
                          {option.text}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
