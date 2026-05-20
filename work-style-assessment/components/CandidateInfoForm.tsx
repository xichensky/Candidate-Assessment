'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { CandidateInfo } from '@/types';

interface CandidateInfoFormProps {
  onSubmit: (info: CandidateInfo) => void;
  onBack: () => void;
}

export default function CandidateInfoForm({ onSubmit, onBack }: CandidateInfoFormProps) {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [errors, setErrors] = useState<{ name?: string; position?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    const newErrors: { name?: string; position?: string } = {};
    if (!name.trim()) {
      newErrors.name = '请输入您的姓名';
    }
    if (!position.trim()) {
      newErrors.position = '请输入应聘岗位';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 提交表单
    onSubmit({ name: name.trim(), position: position.trim() });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card max-w-2xl w-full"
      >
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            📝 候选人信息
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 dark:text-gray-300"
          >
            请填写以下信息后开始测评
          </motion.p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 姓名输入 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              姓名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, name: undefined });
              }}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.name
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              } text-gray-900 dark:text-white`}
              placeholder="请输入您的姓名"
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 dark:text-red-400"
              >
                {errors.name}
              </motion.p>
            )}
          </motion.div>

          {/* 岗位输入 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <label
              htmlFor="position"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              应聘岗位 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="position"
              value={position}
              onChange={(e) => {
                setPosition(e.target.value);
                setErrors({ ...errors, position: undefined });
              }}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.position
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              } text-gray-900 dark:text-white`}
              placeholder="例如：前端工程师、产品经理"
            />
            {errors.position && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 dark:text-red-400"
              >
                {errors.position}
              </motion.p>
            )}
          </motion.div>

          {/* 按钮 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4"
          >
            <button
              type="button"
              onClick={onBack}
              className="btn-secondary flex-1"
            >
              返回
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              开始测评 →
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
