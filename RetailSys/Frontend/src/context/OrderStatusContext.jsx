import { createContext, useState, useEffect, useContext } from 'react';

// 创建订单状态管理上下文
const OrderStatusContext = createContext();

// 自定义hook用于使用订单状态上下文
export const useOrderStatus = () => {
  const context = useContext(OrderStatusContext);
  if (!context) {
    throw new Error('useOrderStatus must be used within an OrderStatusProvider');
  }
  return context;
};

// 订单状态配置
const ORDER_STATUS_CONFIG = {
  pending: { color: 'bg-warning/20 text-warning', label: '待接单', nextStatuses: ['processing', 'cancelled'] },
  processing: { color: 'bg-info/20 text-info', label: '准备中', nextStatuses: ['delivered', 'completed', 'cancelled'] },
  delivered: { color: 'bg-primary/20 text-primary', label: '配送中', nextStatuses: ['completed', 'cancelled'] },
  completed: { color: 'bg-success/20 text-success', label: '已完成', nextStatuses: ['refunded'] },
  cancelled: { color: 'bg-danger/20 text-danger', label: '已取消', nextStatuses: [] },
  refunded: { color: 'bg-gray-200 text-gray-700', label: '已退款', nextStatuses: [] }
};

// 用户端订单状态映射
const USER_ORDER_STATUS_CONFIG = {
  pending: { text: '待付款', class: 'text-yellow-500 bg-yellow-50', nextActions: ['pay', 'cancel'] },
  processing: { text: '处理中', class: 'text-blue-500 bg-blue-50', nextActions: ['urge'] },
  delivered: { text: '配送中', class: 'text-primary bg-primary/10', nextActions: ['track', 'confirm'] },
  completed: { text: '已完成', class: 'text-success bg-success/10', nextActions: ['review'] },
  cancelled: { text: '已取消', class: 'text-gray-400 bg-gray-50', nextActions: [] },
  refunded: { text: '已退款', class: 'text-red-500 bg-red-50', nextActions: [] }
};

export const OrderStatusProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingInfo, setTrackingInfo] = useState({}); // 存储配送状态的定位信息

  // 从localStorage加载订单数据
  useEffect(() => {
    const loadOrders = () => {
      try {
        setLoading(true);
        // 加载管理端订单
        const managementOrders = localStorage.getItem('managementOrders');
        // 加载用户端订单
        const userOrders = localStorage.getItem('userOrders');
        
        const allOrders = [];
        
        if (managementOrders) {
          try {
            const parsedManagementOrders = JSON.parse(managementOrders);
            allOrders.push(...parsedManagementOrders);
          } catch (error) {
            console.error('Error parsing management orders:', error);
          }
        }
        
        if (userOrders) {
          try {
            const parsedUserOrders = JSON.parse(userOrders);
            if (Array.isArray(parsedUserOrders)) {
              allOrders.push(...parsedUserOrders);
            } else {
              allOrders.push(parsedUserOrders);
            }
          } catch (error) {
            console.error('Error parsing user orders:', error);
          }
        }
        
        setOrders(allOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // 获取订单状态配置
  const getStatusInfo = (status, type = 'admin') => {
    if (type === 'admin') {
      return ORDER_STATUS_CONFIG[status] || { color: 'bg-gray-200 text-gray-700', label: '未知', nextStatuses: [] };
    } else {
      return USER_ORDER_STATUS_CONFIG[status] || { text: status, class: 'text-gray-500 bg-gray-50', nextActions: [] };
    }
  };

  // 更新订单状态
  const updateOrderStatus = (orderId, newStatus) => {
    return new Promise((resolve, reject) => {
      try {
        setOrders(prevOrders => {
          const updatedOrders = prevOrders.map(order => 
            order.id === orderId 
              ? {
                  ...order,
                  status: newStatus,
                  updatedAt: new Date().toISOString(),
                  // 根据状态添加相应的时间戳
                  ...(newStatus === 'delivered' && { deliveryTime: new Date().toISOString() }),
                  ...(newStatus === 'completed' && { completionTime: new Date().toISOString() }),
                  ...(newStatus === 'cancelled' && { cancelTime: new Date().toISOString() })
                }
              : order
          );

          // 根据订单类型分别保存到localStorage
          const managementOrders = updatedOrders.filter(order => order.customerName); // 简单判断是否为管理端订单
          const userOrders = updatedOrders.filter(order => !order.customerName);

          if (managementOrders.length > 0) {
            localStorage.setItem('managementOrders', JSON.stringify(managementOrders));
          }
          if (userOrders.length > 0) {
            localStorage.setItem('userOrders', JSON.stringify(userOrders));
          }

          return updatedOrders;
        });
        
        resolve({ success: true, orderId, newStatus });
      } catch (error) {
        console.error('Error updating order status:', error);
        reject(new Error('更新订单状态失败'));
      }
    });
  };

  // 获取单个订单信息
  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  // 获取特定状态的订单
  const getOrdersByStatus = (status) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  // 更新配送位置信息（为地图API集成预留接口）
  const updateDeliveryLocation = (orderId, location) => {
    setTrackingInfo(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        location: {
          ...location,
          timestamp: new Date().toISOString()
        }
      }
    }));
    
    // 实际项目中，这里会调用后端API保存位置信息
    console.log(`Updating delivery location for order ${orderId}:`, location);
  };

  // 获取配送位置信息
  const getDeliveryLocation = (orderId) => {
    return trackingInfo[orderId]?.location;
  };

  // 模拟实时更新配送位置（为地图实时跟踪预留功能）
  const startDeliveryTracking = (orderId) => {
    // 实际项目中，这里会设置WebSocket连接或定时轮询获取最新位置
    console.log(`Starting delivery tracking for order ${orderId}`);
    
    // 模拟返回一个跟踪ID，用于后续停止跟踪
    return `tracking_${orderId}_${Date.now()}`;
  };

  // 停止配送位置跟踪
  const stopDeliveryTracking = (trackingId) => {
    // 实际项目中，这里会关闭对应的WebSocket连接或停止轮询
    console.log(`Stopping delivery tracking with ID ${trackingId}`);
  };

  // 检查订单是否可以更新到指定状态
  const canUpdateStatus = (currentStatus, targetStatus) => {
    const statusInfo = getStatusInfo(currentStatus);
    return statusInfo.nextStatuses.includes(targetStatus);
  };

  // 格式化订单时间
  const formatOrderTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const value = {
    orders,
    loading,
    getStatusInfo,
    updateOrderStatus,
    getOrderById,
    getOrdersByStatus,
    updateDeliveryLocation,
    getDeliveryLocation,
    startDeliveryTracking,
    stopDeliveryTracking,
    canUpdateStatus,
    formatOrderTime,
    ORDER_STATUS_CONFIG,
    USER_ORDER_STATUS_CONFIG
  };

  return (
    <OrderStatusContext.Provider value={value}>
      {children}
    </OrderStatusContext.Provider>
  );
};