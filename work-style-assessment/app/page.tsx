'use client';

import { useState } from 'react';
import { AssessmentStage, Answer, AssessmentResult, CandidateInfo } from '@/types';
import { questions } from '@/data/questions';
import { calculateResult } from '@/utils/scoring';
import { saveSubmission, generateId } from '@/utils/storage';
import WelcomePage from '@/components/WelcomePage';
import CandidateInfoForm from '@/components/CandidateInfoForm';
import QuestionCard from '@/components/QuestionCard';
import SubmittedPage from '@/components/SubmittedPage';

export default function Home() {
  const [stage, setStage] = useState<AssessmentStage>('welcome');
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  // 从欢迎页开始
  const handleStart = () => {
    setStage('info');
  };

  // 提交候选人信息，开始测评
  const handleCandidateInfoSubmit = (info: CandidateInfo) => {
    setCandidateInfo(info);
    setStage('testing');
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  // 返回欢迎页
  const handleBackToWelcome = () => {
    setStage('welcome');
  };

  // 处理答题
  const handleAnswer = (answer: Answer) => {
    // 保存答案
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(
      (a) => a.questionId === answer.questionId
    );

    if (existingIndex >= 0) {
      newAnswers[existingIndex] = answer;
    } else {
      newAnswers.push(answer);
    }

    setAnswers(newAnswers);

    // 如果是最后一题，提交测评
    if (currentQuestionIndex === questions.length - 1) {
      submitAssessment(newAnswers);
    } else {
      // 否则继续下一题
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // 提交测评
  const submitAssessment = async (finalAnswers: Answer[]) => {
    if (!candidateInfo) return;

    // 计算结果
    const result = calculateResult(finalAnswers);

    // 生成提交数据
    const submission = {
      id: generateId(),
      candidateInfo,
      answers: finalAnswers,
      result,
      submittedAt: new Date().toISOString(),
    };

    // 保存到本地存储
    saveSubmission(submission);

    // 发送邮件通知
    try {
      await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateName: candidateInfo.name,
          position: candidateInfo.position,
          submissionId: submission.id,
        }),
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
      // 即使邮件发送失败，也继续显示成功页面
    }

    // 显示提交成功页面
    setStage('submitted');
  };

  return (
    <main className="min-h-screen">
      {stage === 'welcome' && (
        <WelcomePage onStart={handleStart} />
      )}

      {stage === 'info' && (
        <CandidateInfoForm
          onSubmit={handleCandidateInfoSubmit}
          onBack={handleBackToWelcome}
        />
      )}

      {stage === 'testing' && (
        <QuestionCard
          question={questions[currentQuestionIndex]}
          currentIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          initialAnswer={
            answers.find((a) => a.questionId === questions[currentQuestionIndex].id)
              ?.optionId
          }
        />
      )}

      {stage === 'submitted' && candidateInfo && (
        <SubmittedPage candidateName={candidateInfo.name} />
      )}
    </main>
  );
}
