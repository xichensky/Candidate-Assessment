'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

interface ShareAssessmentProps {
  baseUrl?: string;
}

export default function ShareAssessment({ baseUrl }: ShareAssessmentProps) {
  const [showToast, setShowToast] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // 获取候选人端链接
  const assessmentUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : baseUrl || 'http://localhost:3000';

  // 复制链接到剪贴板
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(assessmentUrl);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('复制失败，请手动复制链接');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-2 border-primary-200 dark:border-primary-800"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">🔗</span>
            分享测评问卷
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            将以下链接发送给候选人，或让候选人扫描二维码开始测评
          </p>
        </div>
        <button
          onClick={() => setShowQR(!showQR)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-primary-300 dark:border-primary-700 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {showQR ? '隐藏二维码' : '显示二维码'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 链接部分 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            测评链接
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={assessmentUrl}
              readOnly
              className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={(e) => e.currentTarget.select()}
            />
            <button
              onClick={handleCopyLink}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              复制链接
            </button>
          </div>
          
          {/* 使用提示 */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
              💡 使用方式
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
              <li>• 复制链接发送给候选人（邮件/微信/短信）</li>
              <li>• 或展示二维码让候选人扫描</li>
              <li>• 候选人完成后自动收到邮件通知</li>
            </ul>
          </div>
        </div>

        {/* 二维码部分 */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center"
            >
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 self-start">
                二维码
              </label>
              <div className="bg-white p-6 rounded-2xl shadow-lg border-4 border-primary-200 dark:border-primary-700">
                <QRCodeSVG
                  value={assessmentUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 text-center">
                扫描二维码开始测评
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 复制成功提示 */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-semibold">链接已复制到剪贴板！</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
