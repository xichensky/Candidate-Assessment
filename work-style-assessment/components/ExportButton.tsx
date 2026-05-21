'use client';

import { useState, useRef, useEffect } from 'react';
import { AssessmentSubmission } from '@/types';
import { exportToWord, exportToPDF } from '@/utils/export';

interface ExportButtonProps {
  submission: AssessmentSubmission;
}

export default function ExportButton({ submission }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'word' | 'pdf' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleExport = async (type: 'word' | 'pdf') => {
    setIsExporting(true);
    setExportType(type);
    setIsOpen(false);

    try {
      if (type === 'word') {
        await exportToWord(submission);
      } else {
        await exportToPDF(submission);
      }
      
      // 成功提示（可选：使用 toast 库）
      console.log(`${type === 'word' ? 'Word' : 'PDF'} 导出成功`);
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请稍后重试或联系管理员');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="btn-primary inline-flex items-center gap-2 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            导出中...
          </>
        ) : (
          <>
            导出
            <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {/* 下拉菜单 */}
      {isOpen && !isExporting && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
        >
          <button
            onClick={() => handleExport('word')}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 text-gray-900 dark:text-white"
          >
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
            </svg>
            <span>导出为 Word</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 text-gray-900 dark:text-white border-t border-gray-100 dark:border-gray-700"
          >
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <span>导出为 PDF</span>
          </button>
        </div>
      )}
    </div>
  );
}
