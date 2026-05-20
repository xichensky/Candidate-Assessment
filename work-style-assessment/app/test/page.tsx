export default function TestPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: '#f0f0f0'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#333'
        }}>
          测试页面
        </h1>
        <p style={{ 
          fontSize: '16px',
          color: '#666',
          marginBottom: '10px'
        }}>
          如果你能看到这个页面，说明基本的 Next.js 渲染是正常的。
        </p>
        <p style={{ 
          fontSize: '14px',
          color: '#999'
        }}>
          当前时间：{new Date().toLocaleString('zh-CN')}
        </p>
      </div>
    </div>
  );
}
