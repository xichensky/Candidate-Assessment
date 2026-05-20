import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '工作风格测评 - 5分钟了解你的工作风格',
  description: '通过科学的情境判断测试，了解你在压力、分歧与协作中的自然反应模式',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        {/* 微信浏览器兼容性设置 */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
      <body className={inter.className}>
        {children}
        {/* 微信浏览器调试脚本 */}
        <Script id="wechat-debug" strategy="afterInteractive">
          {`
            // 微信浏览器检测和调试
            (function() {
              var ua = navigator.userAgent.toLowerCase();
              var isWeixin = ua.indexOf('micromessenger') !== -1;
              if (isWeixin) {
                console.log('Running in WeChat browser');
                // 防止微信浏览器调整字体大小
                if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
                  handleFontSize();
                } else {
                  if (document.addEventListener) {
                    document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
                  } else if (document.attachEvent) {
                    document.attachEvent("WeixinJSBridgeReady", handleFontSize);
                    document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
                  }
                }
                function handleFontSize() {
                  WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize': 0 });
                  WeixinJSBridge.on('menu:setfont', function() {
                    WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize': 0 });
                  });
                }
              }
            })();
          `}
        </Script>
      </body>
    </html>
  )
}
