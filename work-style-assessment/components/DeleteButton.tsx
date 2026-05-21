'use client';

import { useState } from 'react';
import { deleteSubmission } from '@/utils/storage';

interface DeleteButtonProps {
  id: string;
  name: string;
  onDelete: () => void;
}

export default function DeleteButton({ id, name, onDelete }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      // 调用删除函数
      deleteSubmission(id);
      
      // 成功后通知父组件刷新列表
      setTimeout(() => {
        onDelete();
        setShowConfirm(false);
        setIsDeleting(false);
      }, 300);
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请稍后重试或联系管理员');
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="px-3 py-1 text-sm border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
      >
        删除
      </button>

      {/* 确认对话框 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                确认删除该测评记录？
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                候选人：<span className="font-semibold text-gray-900 dark:text-white">{name}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                删除后该记录将从列表中移除，不再对 HR 可见。
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      删除中...
                    </>
                  ) : (
                    '确认删除'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
