'use client';

import { useState, useEffect } from 'react';
import { getAllSubmissions, clearAllSubmissions } from '@/utils/storage';
import { AssessmentSubmission } from '@/types';
import { useRouter } from 'next/navigation';

export default function ClearDataPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const data = getAllSubmissions();
    setSubmissions(data);
  }, []);

  const handleClearData = () => {
    // 简单的密码验证
    if (password !== 'admin123') {
      setError('密码错误！');
      return;
    }

    clearAllSubmissions();
    alert('所有测评数据已清空！');
    router.push('/hr-admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-6">
            ⚠️ 危险操作：清空所有数据
          </h1>

          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-3">
              警告
            </h2>
            <ul className="text-red-700 dark:text-red-400 space-y-2">
              <li>• 此操作将永久删除所有测评提交数据</li>
              <li>• 数据删除后无法恢复</li>
              <li>• 请确保已备份重要数据</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              当前数据统计
            </h3>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {submissions.length} 条测评记录
              </p>
            </div>
          </div>

          {!showConfirm ? (
            <div className="space-y-4">
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                清空所有数据
              </button>
              <button
                onClick={() => router.push('/hr-admin')}
                className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                返回后台
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  请输入管理密码确认删除
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="输入密码：admin123"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                )}
              </div>

              <button
                onClick={handleClearData}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                确认清空数据
              </button>

              <button
                onClick={() => {
                  setShowConfirm(false);
                  setPassword('');
                  setError('');
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                取消
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>默认管理密码：admin123</p>
          <p className="mt-2">建议在生产环境中修改此密码</p>
        </div>
      </div>
    </div>
  );
}
