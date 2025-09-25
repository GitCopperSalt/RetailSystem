import { useState, useRef, useEffect } from 'react';

const SmartCustomerService = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [position, setPosition] = useState({ x: '90%', y: '70%' });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);
  const chatWindowRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      content: '您好！欢迎使用我们的智能客服系统。请问有什么可以帮助您的吗？',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // 处理按钮拖拽
  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - (parseInt(position.x) || 0),
      y: e.clientY - (parseInt(position.y) || 0)
    });
    e.preventDefault();
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(100 - 60, e.clientX - dragStart.x));
    const newY = Math.max(0, Math.min(100 - 60, e.clientY - dragStart.y));
    
    setPosition({ x: `${newX}%`, y: `${newY}%` });
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // 监听全局鼠标移动和释放事件
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, dragStart, position]);

  // 切换聊天窗口显示状态
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // 发送消息
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      // 添加用户消息
      const userMessage = {
        id: messages.length + 1,
        sender: 'user',
        content: inputMessage.trim(),
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages([...messages, userMessage]);
      setInputMessage('');

      // 模拟机器人回复（实际项目中会调用API）
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          sender: 'bot',
          content: '感谢您的咨询，我们正在为您查询相关信息...\n（暂不进行具体agent功能实现）',
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      }, 1000);
    }
  };

  // 关闭聊天窗口
  const closeChat = () => {
    setIsChatOpen(false);
  };

  // 响应式位置调整
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // 在移动设备上固定在右下角
        setPosition({ x: '85%', y: '75%' });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 初始调用

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        ref={buttonRef}
        className={`fixed z-40 w-14 h-14 rounded-full bg-primary text-white shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl flex items-center justify-center cursor-pointer
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          ${isChatOpen ? 'scale-90 opacity-90' : ''}
        `}
        style={{
          left: position.x,
          top: position.y,
          transform: isChatOpen ? 'scale(0.9)' : 'scale(1)',
          transition: isDragging ? 'none' : 'all 0.3s ease'
        }}
        onMouseDown={handleDragStart}
        onClick={toggleChat}
        aria-label="智能客服"
      >
        <i className={`fa ${isChatOpen ? 'fa-comments-o' : 'fa-comments'} text-xl`}></i>
      </button>

      {/* 聊天窗口 */}
      {isChatOpen && (
        <div
          ref={chatWindowRef}
          className="fixed z-50 bg-white rounded-xl shadow-2xl w-full max-w-md h-[70vh] max-h-[600px] transform transition-all duration-300 ease-in-out"
          style={{
            left: window.innerWidth < 768 ? '0' : position.x !== '90%' ? position.x : '75%',
            top: window.innerWidth < 768 ? '0' : '10%',
            right: window.innerWidth < 768 ? '0' : 'auto',
            bottom: window.innerWidth < 768 ? '0' : 'auto',
            transform: window.innerWidth < 768 ? 'none' : `translateX(-${position.x === '90%' ? '50%' : '0%'})`,
            maxWidth: window.innerWidth < 768 ? '100%' : '400px',
            height: window.innerWidth < 768 ? '100vh' : '70vh',
            maxHeight: window.innerWidth < 768 ? '100vh' : '600px',
          }}
        >
          {/* 聊天窗口头部 */}
          <div className="bg-primary text-white p-4 rounded-t-xl flex justify-between items-center shadow-md">
            <div className="flex items-center space-x-3">
              <i className="fa fa-headphones text-xl"></i>
              <h3 className="text-lg font-semibold">智能客服</h3>
            </div>
            <button 
              onClick={closeChat}
              className="text-white hover:text-gray-200 focus:outline-none"
              aria-label="关闭"
            >
              <i className="fa fa-times text-xl"></i>
            </button>
          </div>

          {/* 聊天消息区域 */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50" style={{ height: 'calc(100% - 110px)' }}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex flex-col max-w-[80%] ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`
                      px-4 py-3 rounded-lg shadow-sm
                      ${message.sender === 'user' 
                        ? 'bg-primary text-white rounded-br-none' 
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'}
                    `}>
                      <p>{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{message.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 输入区域 */}
          <div className="p-3 border-t border-gray-200 bg-white rounded-b-xl">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all duration-300"
                placeholder="请输入您的问题..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                aria-label="发送消息"
              >
                <i className="fa fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SmartCustomerService;