import { AssessmentSubmission } from '@/types';

const STORAGE_KEY = 'assessment_submissions';

/**
 * 保存测评提交数据
 */
export function saveSubmission(submission: AssessmentSubmission): void {
  if (typeof window === 'undefined') return;

  try {
    const submissions = getAllSubmissions();
    submissions.push(submission);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch (error) {
    console.error('Failed to save submission:', error);
  }
}

/**
 * 获取所有测评提交数据
 */
export function getAllSubmissions(): AssessmentSubmission[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to get submissions:', error);
    return [];
  }
}

/**
 * 根据ID获取单个测评提交数据
 */
export function getSubmissionById(id: string): AssessmentSubmission | null {
  const submissions = getAllSubmissions();
  return submissions.find((s) => s.id === id) || null;
}

/**
 * 删除测评提交数据
 */
export function deleteSubmission(id: string): void {
  if (typeof window === 'undefined') return;

  try {
    const submissions = getAllSubmissions();
    const filtered = submissions.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete submission:', error);
  }
}

/**
 * 清空所有测评提交数据
 */
export function clearAllSubmissions(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear submissions:', error);
  }
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
