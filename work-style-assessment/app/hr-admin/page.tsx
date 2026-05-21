'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AssessmentSubmission } from '@/types';
import { getAllSubmissions } from '@/utils/storage';
import Link from 'next/link';
// ShareAssessment 模块暂时下线
// import ShareAssessment from '@/components/ShareAssessment';

export default function HRAdminPage() {
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'position'>('date');

  useEffect(() => {
    // 加载所有提交数据
    const data = getAllSubmissions();
    setSubmissions(data);
  }, []);

  // 过滤和排序
  const filteredSubmissions = submissions
    .filter((sub) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        sub.candidateInfo.name.toLowerCase().includes(searchLower) ||
        sub.candidateInfo.position.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.candidateInfo.name.localeCompare(b.candidateInfo.name, 'zh-CN');
        case 'position':
          return a.candidateInfo.position.localeCompare(b.candidateInfo.position, 'zh-CN');
        case 'date':
        default:
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              测评结果管理
            </h1>
            <Link
              href="/admin/clear-data"
              className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 font-semibold rounded-lg transition-colors text-sm"
            >
              🗑️ 清空数据
            </Link>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            查看和管理所有候选人的工作风格测评结果
          </p>
        </motion.div>

        {/* 统计卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-6"
        >
          <div className="card bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-800">
            <div className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-1">
              总测评数
            </div>
            <div className="text-3xl font-bold text-primary-900 dark:text-primary-300">
              {submissions.length}
            </div>
          </div>
          <div className="card bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
            <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
              今日提交
            </div>
            <div className="text-3xl font-bold text-green-900 dark:text-green-300">
              {
                submissions.filter((s) => {
                  const today = new Date().toDateString();
                  return new Date(s.submittedAt).toDateString() === today;
                }).length
              }
            </div>
          </div>
          <div className="card bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
            <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
              本周提交
            </div>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-300">
              {
                submissions.filter((s) => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(s.submittedAt) >= weekAgo;
                }).length
              }
            </div>
          </div>
        </motion.div>

	      {/* 搜索和筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="搜索候选人姓名或岗位..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'position')}
              className="px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="date">按提交时间排序</option>
              <option value="name">按姓名排序</option>
              <option value="position">按岗位排序</option>
            </select>
          </div>
        </motion.div>

        {/* 候选人列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {filteredSubmissions.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {searchTerm ? '未找到匹配的候选人' : '暂无测评数据'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? '请尝试其他搜索关键词' : '候选人完成测评后会在这里显示'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission, index) => (
                <CandidateCard key={submission.id} submission={submission} index={index} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// 候选人卡片组件
function CandidateCard({
  submission,
  index,
}: {
  submission: AssessmentSubmission;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/hr-admin/${submission.id}`}>
        <div className="card hover:shadow-2xl transition-shadow cursor-pointer border-2 border-transparent hover:border-primary-500">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {submission.candidateInfo.name}
                </h3>
                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold">
                  {submission.candidateInfo.position}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">内在能量：</span>
                  <span className="font-semibold text-gray-900 dark:text-white ml-1">
                    {submission.result.energy}/3
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">防御性：</span>
                  <span className="font-semibold text-gray-900 dark:text-white ml-1">
                    {submission.result.defense}/12
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">协作倾向：</span>
                  <span className="font-semibold text-gray-900 dark:text-white ml-1">
                    {submission.result.collaboration}/3
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">提交时间：</span>
                  <span className="font-semibold text-gray-900 dark:text-white ml-1">
                    {new Date(submission.submittedAt).toLocaleString('zh-CN', {
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="ml-4">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
