'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Question, Answer } from '@/types';
import { useState } from 'react';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (answer: Answer) => void;
  initialAnswer?: string;
}

export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
  initialAnswer,
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(initialAnswer || null);
  const [showError, setShowError] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setShowError(false);
  };

  const handleNext = () => {
    if (!selectedOption) {
      setShowError(true);
      return;
    }

    onAnswer({
      questionId: question.id,
      optionId: selectedOption,
    });
  };

  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="card max-w-3xl w-full"
      >
        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              题目 {currentIndex + 1} / {totalQuestions}
            </span>
            <span className="text-sm font-medium text-primary-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-primary-600 h-2 rounded-full"
            />
          </div>
        </div>

        {/* 模块标签 */}
        <div className="mb-4">
          <span className="inline-block bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold px-3 py-1 rounded-full">
            {question.module === 1 && '模块1: 内在能量 & 弹性'}
            {question.module === 2 && '模块2: 防御性 & 攻击风险'}
            {question.module === 3 && '模块3: 团队协作倾向'}
          </span>
        </div>

        {/* 问题 */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {question.text}
        </h2>

        {/* 选项 */}
        <div className="space-y-4 mb-8">
          {question.options.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOptionSelect(option.id)}
              className={`option-card ${
                selectedOption === option.id ? 'selected' : ''
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedOption === option.id
                        ? 'border-primary-600 bg-primary-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {selectedOption === option.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 dark:text-white mr-2">
                    {option.id}.
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {option.text}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 错误提示 */}
        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300"
            >
              请选择一个选项后再继续
            </motion.div>
          )}
        </AnimatePresence>

        {/* 按钮 */}
        <div className="flex justify-end">
          <button onClick={handleNext} className="btn-primary">
            {currentIndex === totalQuestions - 1 ? '完成测评' : '下一题'} →
          </button>
        </div>
      </motion.div>
    </div>
  );
}
