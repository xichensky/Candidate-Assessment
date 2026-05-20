'use client';

interface WelcomePageProps {
  onStart: () => void;
}

export default function WelcomePage({ onStart }: WelcomePageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="card max-w-2xl w-full">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            工作风格测评
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            5分钟了解你的工作风格
          </p>

          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📋 测评说明
            </h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>这是一份工作情境判断小测试，用于了解你在压力、分歧与协作中的自然反应</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>共10道题目，预计用时5分钟</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>没有对错之分，请按第一直觉作答</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>本测试仅用于团队匹配与风险识别，非医疗诊断工具</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              📊 评估维度
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-medium text-gray-900 dark:text-white">内在能量</div>
                <div className="text-gray-600 dark:text-gray-400">弹性指数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🛡️</div>
                <div className="font-medium text-gray-900 dark:text-white">防御性</div>
                <div className="text-gray-600 dark:text-gray-400">攻击风险指数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🤝</div>
                <div className="font-medium text-gray-900 dark:text-white">团队协作</div>
                <div className="text-gray-600 dark:text-gray-400">协作倾向</div>
              </div>
            </div>
          </div>

          <button
            onClick={onStart}
            className="btn-primary text-lg hover:scale-105 active:scale-95 transition-transform"
          >
            开始测评 →
          </button>
        </div>
      </div>
    </div>
  );
}
