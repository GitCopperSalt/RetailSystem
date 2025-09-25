import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import { messagesApi } from '../../services/apiService';

// Configure dayjs
dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

const MessageCenterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasPermission } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showMarkAllRead, setShowMarkAllRead] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Load messages
  useEffect(() => {
    if (!isAuthenticated || !hasPermission('message_view')) {
      navigate('/login');
      return;
    }

    const loadMessages = async () => {
      setLoading(true);

      try {
        // 使用API获取消息
        const response = await messagesApi.getMessages();
        const messageData = Array.isArray(response) ? response : (response.items || []);
        
        // 检查是否有未读消息
        const hasUnread = messageData.some(msg => !msg.is_read);
        setShowMarkAllRead(hasUnread);
        
        // 转换API返回的数据格式以匹配前端期望的结构
        const formattedMessages = messageData.map(msg => ({
          id: msg.id.toString(),
          title: msg.title,
          content: msg.content,
          type: msg.type || 'system',
          category: msg.category || '',
          icon: getMessageTypeIcon(msg.type || 'system').split(' ')[0].replace('fa-', ''),
          actionLink: msg.action_link || '#',
          isRead: msg.is_read || false,
          createdAt: msg.created_at
        }));
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error('加载消息失败:', error);
        // 使用本地存储或模拟数据作为后备
        let adminMessages = JSON.parse(localStorage.getItem('adminMessages') || '[]');
        
        // 如果本地存储中没有消息，使用模拟数据
        if (adminMessages.length === 0) {
          adminMessages = generateMockMessages();
          localStorage.setItem('adminMessages', JSON.stringify(adminMessages));
        }
        
        // 检查是否有未读消息
        const hasUnread = adminMessages.some(msg => msg.isRead === false);
        setShowMarkAllRead(hasUnread);
        
        setMessages(adminMessages);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [isAuthenticated, hasPermission, navigate]);

  // Generate mock messages for demonstration
  const generateMockMessages = () => {
    const mockMessages = [];
    const messageTypes = ['order', 'inventory', 'system', 'customer'];
    const messageCategories = {
      'order': ['new_order', 'order_timeout', 'order_completed', 'order_cancelled', 'refund_request'],
      'inventory': ['low_stock', 'expired_product', 'replenishment_complete', 'inventory_discrepancy'],
      'system': ['system_update', 'maintenance_schedule', 'performance_alert', 'security_alert'],
      'customer': ['customer_complaint', 'customer_urge', 'customer_praise', 'customer_survey']
    };

    // Generate messages for the last 7 days
    for (let i = 0; i < 30; i++) {
      const messageDate = dayjs().subtract(i, 'hour');
      const type = messageTypes[Math.floor(Math.random() * messageTypes.length)];
      const category = messageCategories[type][Math.floor(Math.random() * messageCategories[type].length)];
      
      // Generate message content based on type and category
      let title, content, icon, actionLink;
      
      switch (type) {
        case 'order':
          const orderId = `ORD${messageDate.format('YYYYMMDD')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
          icon = 'fa-shopping-cart';
          actionLink = `/admin/orders/${orderId}`;
          
          switch (category) {
            case 'new_order':
              title = '新订单提醒';
              content = `您有一个新的订单 ${orderId} 等待处理，请尽快审核。`;
              break;
            case 'order_timeout':
              title = '订单超时提醒';
              content = `订单 ${orderId} 备货时间即将超时，请加快处理速度。`;
              break;
            case 'order_completed':
              title = '订单完成通知';
              content = `订单 ${orderId} 已完成配送，客户已确认收货。`;
              break;
            case 'order_cancelled':
              title = '订单取消通知';
              content = `订单 ${orderId} 已被客户取消，原因：临时不需要。`;
              break;
            case 'refund_request':
              title = '退款申请通知';
              content = `订单 ${orderId} 客户申请退款，请及时处理。`;
              break;
            default:
              title = '订单通知';
              content = `订单 ${orderId} 状态更新。`;
          }
          break;
        
        case 'inventory':
          const products = ['有机牛奶', '全麦面包', '新鲜鸡蛋', '有机蔬菜礼盒', '精选水果拼盘'];
          const productName = products[Math.floor(Math.random() * products.length)];
          const stockCount = Math.floor(Math.random() * 9) + 1;
          icon = 'fa-cubes';
          actionLink = '/admin/inventory';
          
          switch (category) {
            case 'low_stock':
              title = '库存预警';
              content = `商品 ${productName} 库存不足，当前库存仅 ${stockCount} 件，请及时补货。`;
              break;
            case 'expired_product':
              title = '商品过期提醒';
              content = `部分 ${productName} 即将过期，请检查库存并及时处理。`;
              break;
            case 'replenishment_complete':
              title = '补货完成通知';
              content = `${productName} 补货已完成，新入库 ${Math.floor(Math.random() * 200) + 50} 件。`;
              break;
            case 'inventory_discrepancy':
              title = '库存差异提醒';
              content = `${productName} 盘点发现库存差异，系统记录与实际库存不符，请核查。`;
              break;
            default:
              title = '库存通知';
              content = `库存状态更新。`;
          }
          break;
        
        case 'system':
          icon = 'fa-cog';
          actionLink = '#';
          
          switch (category) {
            case 'system_update':
              title = '系统更新通知';
              content = '零售智能运营系统将于今晚22:00-次日凌晨2:00进行系统升级，期间系统可能短暂不可用。';
              break;
            case 'maintenance_schedule':
              title = '系统维护通知';
              content = '系统将在本周日进行例行维护，请提前安排工作。';
              break;
            case 'performance_alert':
              title = '系统性能预警';
              content = '系统检测到服务器负载较高，建议优化系统资源使用。';
              break;
            case 'security_alert':
              title = '安全警告';
              content = '检测到异常登录尝试，请确认是否为您本人操作。';
              break;
            default:
              title = '系统通知';
              content = '系统消息通知。';
          }
          break;
        
        case 'customer':
          const customerName = ['张先生', '李女士', '王先生', '赵小姐'];
          const customer = customerName[Math.floor(Math.random() * customerName.length)];
          icon = 'fa-user';
          actionLink = '#';
          
          switch (category) {
            case 'customer_complaint':
              title = '客户投诉通知';
              content = `客户 ${customer} 投诉商品质量问题，请尽快处理。`;
              break;
            case 'customer_urge':
              title = '客户催单通知';
              content = `客户 ${customer} 催促订单发货，请尽快安排配送。`;
              break;
            case 'customer_praise':
              title = '客户表扬通知';
              content = `客户 ${customer} 对我们的服务表示满意，感谢您的优质服务！`;
              break;
            case 'customer_survey':
              title = '客户调研通知';
              content = `客户 ${customer} 参与了我们的服务满意度调研，评分5分。`;
              break;
            default:
              title = '客户通知';
              content = `客户 ${customer} 相关消息。`;
          }
          break;
        
        default:
          title = '系统消息';
          content = '您有一条新的系统消息。';
          icon = 'fa-bell';
          actionLink = '#';
      }

      // Create message object
      const message = {
        id: `msg-${Date.now()}-${i}`,
        title,
        content,
        type,
        category,
        icon,
        actionLink,
        isRead: i > 5, // Make some messages unread
        createdAt: messageDate.toISOString()
      };

      mockMessages.push(message);
    }

    // Sort messages by created time (newest first)
    return mockMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  // Filter messages based on selected filters
  const filteredMessages = messages.filter(message => {
    // Filter by type
    if (filterType !== 'all' && message.type !== filterType) return false;
    
    // Filter by status
    if (filterStatus === 'read' && message.isRead === false) return false;
    if (filterStatus === 'unread' && message.isRead === true) return false;
    
    // Filter by search query
    if (searchQuery && !message.title.includes(searchQuery) && !message.content.includes(searchQuery)) return false;
    
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMessages = filteredMessages.slice(startIndex, endIndex);

  // Handle message read
  const handleReadMessage = async (messageId) => {
    try {
      // 调用API标记消息为已读
      await messagesApi.updateMessage(messageId, { isRead: true });
      
      const updatedMessages = messages.map(message => 
        message.id === messageId ? { ...message, isRead: true } : message
      );
      setMessages(updatedMessages);
      localStorage.setItem('adminMessages', JSON.stringify(updatedMessages));
      
      // Check if all messages are read
      const hasUnread = updatedMessages.some(msg => msg.isRead === false);
      setShowMarkAllRead(hasUnread);
    } catch (error) {
      console.error('标记消息为已读失败:', error);
      alert('操作失败，请稍后重试');
      // 仍然在前端标记为已读，但不更新后端
      const updatedMessages = messages.map(message => 
        message.id === messageId ? { ...message, isRead: true } : message
      );
      setMessages(updatedMessages);
      localStorage.setItem('adminMessages', JSON.stringify(updatedMessages));
    }
  };

  // Handle mark all as read
  const handleMarkAllRead = async () => {
    try {
      // 调用API标记所有消息为已读
      await messagesApi.markAllAsRead();
      
      const updatedMessages = messages.map(message => ({ ...message, isRead: true }));
      setMessages(updatedMessages);
      localStorage.setItem('adminMessages', JSON.stringify(updatedMessages));
      setShowMarkAllRead(false);
    } catch (error) {
      console.error('标记所有消息为已读失败:', error);
      alert('操作失败，请稍后重试');
      // 仍然在前端标记为已读，但不更新后端
      const updatedMessages = messages.map(message => ({ ...message, isRead: true }));
      setMessages(updatedMessages);
      localStorage.setItem('adminMessages', JSON.stringify(updatedMessages));
      setShowMarkAllRead(false);
    }
  };

  // Handle delete message
  const handleDeleteMessage = async (messageId) => {
    try {
      // 调用API删除消息
      await messagesApi.deleteMessage(messageId);
      
      const updatedMessages = messages.filter(message => message.id !== messageId);
      setMessages(updatedMessages);
      localStorage.setItem('adminMessages', JSON.stringify(updatedMessages));
      setShowDeleteConfirm(null);
      
      // Check if all messages are read
      const hasUnread = updatedMessages.some(msg => msg.isRead === false);
      setShowMarkAllRead(hasUnread);
    } catch (error) {
      console.error('删除消息失败:', error);
      alert('操作失败，请稍后重试');
      // 仍然在前端删除消息，但不更新后端
      const updatedMessages = messages.filter(message => message.id !== messageId);
      setMessages(updatedMessages);
      localStorage.setItem('adminMessages', JSON.stringify(updatedMessages));
      setShowDeleteConfirm(null);
    }
  };

  // Handle delete all messages
  const handleDeleteAllMessages = async () => {
    try {
      // 调用API删除所有消息
      await messagesApi.deleteAllMessages();
      
      setMessages([]);
      localStorage.removeItem('adminMessages');
      setShowMarkAllRead(false);
    } catch (error) {
      console.error('删除所有消息失败:', error);
      alert('操作失败，请稍后重试');
      // 仍然在前端删除所有消息，但不更新后端
      setMessages([]);
      localStorage.removeItem('adminMessages');
      setShowMarkAllRead(false);
    }
  };

  // Format time relative to now
  const formatRelativeTime = (dateString) => {
    return dayjs(dateString).fromNow();
  };

  // Get message type icon class
  const getMessageTypeIcon = (type) => {
    const iconMap = {
      'order': 'fa-shopping-cart text-primary',
      'inventory': 'fa-cubes text-warning',
      'system': 'fa-cog text-info',
      'customer': 'fa-user text-success'
    };
    return iconMap[type] || 'fa-bell text-gray-500';
  };

  // Get message type label
  const getMessageTypeLabel = (type) => {
    const labelMap = {
      'order': '订单消息',
      'inventory': '库存消息',
      'system': '系统消息',
      'customer': '客户消息'
    };
    return labelMap[type] || '其他消息';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">加载消息中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800">消息中心</h1>
        
        <div className="flex flex-wrap gap-2">
          {showMarkAllRead && (
            <button 
              onClick={handleMarkAllRead} 
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              全部标记为已读
            </button>
          )}
          
          {messages.length > 0 && (
            <button 
              onClick={() => setShowDeleteConfirm('all')} 
              className="px-4 py-2 bg-gray-100 text-red-600 rounded-md hover:bg-gray-200 transition-colors"
            >
              清空所有消息
            </button>
          )}
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)} 
              className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="all">全部类型</option>
              <option value="order">订单消息</option>
              <option value="inventory">库存消息</option>
              <option value="system">系统消息</option>
              <option value="customer">客户消息</option>
            </select>
            
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)} 
              className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="all">全部状态</option>
              <option value="unread">未读消息</option>
              <option value="read">已读消息</option>
            </select>
          </div>
          
          <div className="flex-1">
            <div className="relative">
              <input 
                type="text" 
                placeholder="搜索消息标题或内容..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
              <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Message list */}
      {filteredMessages.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <i className="fa fa-inbox text-5xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-700 mb-1">暂无消息</h3>
          <p className="text-gray-500">{filterType !== 'all' || filterStatus !== 'all' || searchQuery ? '当前筛选条件下没有找到消息' : '您的消息中心目前是空的'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="divide-y">
            {currentMessages.map(message => (
              <div 
                key={message.id} 
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer flex gap-4 ${message.isRead ? '' : 'bg-primary/5'}`}
                onClick={() => handleReadMessage(message.id)}
              >
                {/* Message icon */}
                <div className="mt-1">
                  <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${!message.isRead ? 'border-2 border-primary' : ''}`}>
                    <i className={`fa ${getMessageTypeIcon(message.type)}`}></i>
                  </div>
                </div>
                
                {/* Message content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-medium text-gray-900 ${!message.isRead ? 'font-bold' : ''}`}>{message.title}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{formatRelativeTime(message.createdAt)}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">{message.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{getMessageTypeLabel(message.type)}</span>
                    {!message.isRead && (
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (message.actionLink && message.actionLink !== '#') {
                        navigate(message.actionLink);
                      }
                    }}
                    className="text-gray-500 hover:text-primary"
                  >
                    <i className="fa fa-external-link"></i>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(message.id);
                    }}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <i className="fa fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <i className="fa fa-chevron-left"></i>
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page} 
                onClick={() => setCurrentPage(page)}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === page ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {page}
              </button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <i className="fa fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">确认删除</h3>
            <p className="text-gray-700 mb-6">
              {showDeleteConfirm === 'all' 
                ? '确定要清空所有消息吗？此操作不可恢复。' 
                : '确定要删除这条消息吗？此操作不可恢复。'}
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(null)} 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => showDeleteConfirm === 'all' ? handleDeleteAllMessages() : handleDeleteMessage(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageCenterPage;