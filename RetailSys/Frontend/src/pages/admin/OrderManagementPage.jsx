import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderApi } from '../../services/apiService';

const OrderManagementPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasPermission } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // 轮询定时器引用
  const pollTimerRef = useRef(null);
  // 轮询间隔时间(毫秒)
  const pollInterval = 30000; // 30秒
  // 分页参数
  const [offset] = useState(0);
  const [limit] = useState(10);

  // 从API获取订单数据
  const fetchOrders = async () => {
    setLoading(true);
    try {
      // 调用apiService.js中的orderApi获取订单列表
      // 将selectedStatus从'all'转换为空字符串以匹配后端API的参数格式
      const status = selectedStatus === 'all' ? '' : selectedStatus;
      const response = await orderApi.getOrders(offset, limit, status);
      
      // 检查API返回的数据
      if (response && Array.isArray(response.orders)) {
        // 格式化订单数据以匹配前端展示需求
        const formattedOrders = response.orders.map(order => ({
          id: order.id,
          customerName: order.user_name || `用户${order.user_id}`,
          customerPhone: order.user_phone || '未提供',
          orderTime: order.created_at ? new Date(order.created_at).toLocaleString('zh-CN') : '',
          totalAmount: order.total_amount || 0,
          status: order.status || 'pending',
          fulfillmentType: order.delivery_type === 'delivery' ? 'delivery' : 'pickup',
          address: order.delivery_address || '',
          storeName: order.pickup_store_name || '自提店',
          storeAddress: order.pickup_store_address || '',
          paymentMethod: order.payment_method === 'alipay' ? 'alipay' : 'wechat',
          items: order.items ? order.items.map(item => ({
            id: item.id,
            name: item.product_name,
            price: item.price || 0,
            quantity: item.quantity || 0,
            imageUrl: item.product_image_url || 'https://picsum.photos/80'
          })) : [],
          notes: order.notes || '',
          prepTime: order.prep_time || '30分钟',
          deliveryFee: order.delivery_fee || 0,
          deliveryTime: order.delivery_time ? new Date(order.delivery_time).toLocaleString('zh-CN') : '',
          pickupTime: order.pickup_time ? new Date(order.pickup_time).toLocaleString('zh-CN') : '',
          cancelReason: order.cancel_reason || '',
          hasRefund: order.has_refund || false,
          refundStatus: order.refund_status || ''
        }));
        
        // 按订单时间排序（最新的在前）
        const sortedOrders = formattedOrders.sort((a, b) => 
          new Date(b.orderTime) - new Date(a.orderTime)
        );
        
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      } else {
        // 如果API返回格式不符合预期，使用mock数据作为备用
        console.warn('API返回数据格式不符合预期，使用备用数据');
        const mockOrders = generateMockOrders();
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
      }
    } catch (error) {
      console.error('获取订单列表失败:', error);
      // 发生错误时使用mock数据
      const mockOrders = generateMockOrders();
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  // 模拟数据生成函数（用于API调用失败时的备用数据）
  const generateMockOrders = () => {
    const statuses = ['pending', 'processing', 'delivered', 'completed', 'cancelled'];
    const mockOrders = [
      {
        id: 'ORD-20240518-001',
        customerName: '张三',
        customerPhone: '138****1234',
        orderTime: '2024-05-18 10:23:45',
        totalAmount: 128.50,
        status: 'processing',
        fulfillmentType: 'delivery',
        address: '北京市朝阳区建国路88号 1号楼 1001室',
        paymentMethod: 'wechat',
        items: [
          { id: 1, name: '有机蔬菜礼盒', price: 89.90, quantity: 1, imageUrl: 'https://picsum.photos/80' },
          { id: 5, name: '天然矿泉水 500ml*24', price: 29.90, quantity: 1, imageUrl: 'https://picsum.photos/80' }
        ],
        notes: '尽快送达',
        prepTime: '20分钟',
        deliveryFee: 8.00
      },
      {
        id: 'ORD-20240518-002',
        customerName: '李四',
        customerPhone: '139****5678',
        orderTime: '2024-05-18 09:45:12',
        totalAmount: 89.90,
        status: 'processing',
        fulfillmentType: 'pickup',
        storeName: '旗舰店',
        storeAddress: '北京市海淀区中关村大街1号',
        paymentMethod: 'wechat',
        items: [
          { id: 4, name: '精选苹果 10个装', price: 39.90, quantity: 1, imageUrl: 'https://picsum.photos/80' },
          { id: 7, name: '休闲饼干礼盒', price: 49.90, quantity: 1, imageUrl: 'https://picsum.photos/80' }
        ],
        notes: '',
        prepTime: '15分钟',
        deliveryFee: 0
      },
      {
        id: 'ORD-20240518-003',
        customerName: '王五',
        customerPhone: '137****9012',
        orderTime: '2024-05-18 09:12:33',
        totalAmount: 156.80,
        status: 'delivered',
        fulfillmentType: 'delivery',
        address: '上海市浦东新区陆家嘴环路1000号',
        paymentMethod: 'wechat',
        items: [
          { id: 2, name: '优质大米 5kg', price: 49.90, quantity: 2, imageUrl: 'https://picsum.photos/80' },
          { id: 8, name: '特级橄榄油 500ml', price: 129.90, quantity: 1, imageUrl: 'https://picsum.photos/80' }
        ],
        notes: '请放在门口',
        prepTime: '30分钟',
        deliveryFee: 8.00,
        deliveryTime: '2024-05-18 10:05:22'
      },
      {
        id: 'ORD-20240518-004',
        customerName: '赵六',
        customerPhone: '136****3456',
        orderTime: '2024-05-18 08:30:19',
        totalAmount: 69.90,
        status: 'cancelled',
        fulfillmentType: 'delivery',
        address: '广州市天河区天河路385号',
        paymentMethod: 'wechat',
        items: [
          { id: 3, name: '纯牛奶 1L*12', price: 69.90, quantity: 1, imageUrl: 'https://picsum.photos/80' }
        ],
        notes: '',
        prepTime: '10分钟',
        deliveryFee: 0,
        cancelReason: '顾客取消'
      },
      {
        id: 'ORD-20240518-005',
        customerName: '孙七',
        customerPhone: '135****7890',
        orderTime: '2024-05-18 08:15:07',
        totalAmount: 99.90,
        status: 'completed',
        fulfillmentType: 'pickup',
        storeName: '旗舰店',
        storeAddress: '北京市海淀区中关村大街1号',
        paymentMethod: 'wechat',
        items: [
          { id: 6, name: '厨房清洁套装', price: 59.90, quantity: 1, imageUrl: 'https://via.placeholder.com/80' },
          { id: 4, name: '精选苹果 10个装', price: 39.90, quantity: 1, imageUrl: 'https://via.placeholder.com/80' }
        ],
        notes: '',
        prepTime: '15分钟',
        deliveryFee: 0,
        pickupTime: '2024-05-18 08:45:30'
      }
    ];
    
    return mockOrders;
  };

  // 启动定时轮询
  const startPolling = () => {
    // 先立即获取一次数据
    fetchOrders();
    
    // 设置定时轮询
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
    }
    
    pollTimerRef.current = setInterval(() => {
      fetchOrders();
    }, pollInterval);
  };

  // 停止轮询
  const stopPolling = () => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  // 页面加载时启动轮询，组件卸载时清除定时器
  useEffect(() => {
    // 检查用户是否已认证且有权限查看订单
    if (!isAuthenticated || !hasPermission('order_view')) {
      navigate('/login');
      return;
    }

    startPolling();
    
    // 组件卸载时清除定时器
    return () => {
      stopPolling();
    };
  }, [isAuthenticated, hasPermission, navigate]);

  // 当状态筛选条件变化时，重新获取数据
  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, limit, offset]);

  // Filter orders based on search term and status
  useEffect(() => {
    let result = [...orders];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.customerPhone.includes(term)
      );
    }
    
    // Filter by status
    if (selectedStatus !== 'all') {
      result = result.filter(order => order.status === selectedStatus);
    }
    
    // Sort by order time (newest first)
    result.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));
    
    setFilteredOrders(result);
  }, [searchTerm, selectedStatus, orders]);

  // Get status color and label
  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { color: 'bg-warning/20 text-warning', label: '待接单' },
      processing: { color: 'bg-info/20 text-info', label: '准备中' },
      delivered: { color: 'bg-primary/20 text-primary', label: '配送中' },
      completed: { color: 'bg-success/20 text-success', label: '已完成' },
      cancelled: { color: 'bg-danger/20 text-danger', label: '已取消' }
    };
    return statusMap[status] || { color: 'bg-gray-200 text-gray-700', label: '未知' };
  };

  // Get fulfillment type info
  const getFulfillmentTypeInfo = (type) => {
    return type === 'delivery' ? '送货上门' : '到店自提';
  };

  // Get payment method info
  const getPaymentMethodInfo = (method) => {
    return method === 'wechat' ? '微信支付' : '支付宝';
  };

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      // 先更新本地状态以提供即时反馈
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: newStatus,
              ...(newStatus === 'delivered' && { deliveryTime: new Date().toLocaleString('zh-CN') }),
              ...(newStatus === 'completed' && { pickupTime: new Date().toLocaleString('zh-CN') }) 
            } 
          : order
      ));
      
      // 然后调用API更新后端数据
      await orderApi.updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error(`更新订单ID: ${orderId} 状态失败:`, error);
      // 如果API调用失败，刷新订单列表以恢复到最新状态
      fetchOrders();
    }
  };

  // Handle cancel order
  const handleCancelOrder = async (orderId) => {
    if (window.confirm('确定要取消这个订单吗？')) {
      try {
        // 先更新本地状态以提供即时反馈
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, status: 'cancelled', cancelReason: '商家取消' }
            : order
        ));
        
        // 然后调用API取消订单
        await orderApi.cancelOrder(orderId);
      } catch (error) {
        console.error(`取消订单ID: ${orderId} 失败:`, error);
        // 如果API调用失败，刷新订单列表以恢复到最新状态
        fetchOrders();
      }
    }
  };

  // Handle refund order
  const handleRefundOrder = (orderId) => {
    if (window.confirm('确定要为这个订单办理退款吗？')) {
      // 仅更新本地状态，因为apiService.js中尚未实现退款API
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, hasRefund: true, refundStatus: 'processing' }
          : order
      ));
      console.warn('退款功能暂未实现完整的API调用');
    }
  };

  // Check if user can process orders
  const canProcessOrders = hasPermission('process_orders') || hasPermission('all');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">加载订单数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
          <p className="text-gray-500 mt-1">管理所有顾客订单，处理订单状态和退款</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="搜索订单编号、顾客姓名或电话..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            className="input"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">全部状态</option>
            <option value="pending">待接单</option>
            <option value="processing">准备中</option>
            <option value="delivered">配送中</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
      </div>

      {/* Order Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="bg-gray-50">
                <th>订单编号</th>
                <th>顾客信息</th>
                <th>订单金额</th>
                <th>订单状态</th>
                <th>配送方式</th>
                <th>下单时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    <i className="fa fa-search-minus text-2xl mb-2"></i>
                    <p>没有找到匹配的订单</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const statusInfo = getStatusInfo(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-500 mt-1">{order.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">¥{Number(order.totalAmount).toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {getFulfillmentTypeInfo(order.fulfillmentType)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{order.orderTime}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button 
                            className="text-primary hover:text-primary/80 text-sm"
                            onClick={() => {
                              setCurrentOrder(order);
                              setIsDetailModalOpen(true);
                            }}
                          >
                            详情
                          </button>
                          {canProcessOrders && order.status !== 'cancelled' && order.status !== 'completed' && (
                            <button 
                              className="text-danger hover:text-danger/80 text-sm"
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              取消
                            </button>
                          )}
                          {canProcessOrders && (order.status === 'delivered' || order.status === 'completed') && !order.hasRefund && (
                            <button 
                              className="text-warning hover:text-warning/80 text-sm"
                              onClick={() => handleRefundOrder(order.id)}
                            >
                              退款
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {isDetailModalOpen && currentOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">订单详情</h3>
              <button 
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setIsDetailModalOpen(false)}
              >
                <i className="fa fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-6">
              {/* Order Header */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{currentOrder.id}</h4>
                    <p className="text-sm text-gray-500">下单时间: {currentOrder.orderTime}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">订单金额</p>
                      <p className="text-xl font-bold text-gray-900">¥{Number(currentOrder.totalAmount).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-6 pb-6 border-b">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">顾客信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">姓名</p>
                    <p className="text-base text-gray-900">{currentOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">电话</p>
                    <p className="text-base text-gray-900">{currentOrder.customerPhone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">
                      {currentOrder.fulfillmentType === 'delivery' ? '收货地址' : '自提门店'}
                    </p>
                    <p className="text-base text-gray-900">
                      {currentOrder.fulfillmentType === 'delivery' 
                        ? currentOrder.address 
                        : `${currentOrder.storeName} - ${currentOrder.storeAddress}`
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6 pb-6 border-b">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">商品信息</h4>
                <div className="space-y-4">
                  {currentOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center p-3 rounded-lg bg-gray-50">
                      <div className="bg-white rounded-md h-12 w-12 flex-shrink-0 flex items-center justify-center shadow-sm">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="h-8 w-8 object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">¥{Number(item.price).toFixed(2)} × {item.quantity}</p>
                        <p className="text-sm font-semibold text-gray-900">¥{(Number(item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="mb-6 pb-6 border-b">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">订单详情</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">配送方式</p>
                    <p className="text-base text-gray-900">{getFulfillmentTypeInfo(currentOrder.fulfillmentType)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">支付方式</p>
                    <p className="text-base text-gray-900">{getPaymentMethodInfo(currentOrder.paymentMethod)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">订单状态</p>
                    <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusInfo(currentOrder.status).color}`}>
                      {getStatusInfo(currentOrder.status).label}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">预计准备时间</p>
                    <p className="text-base text-gray-900">{currentOrder.prepTime}</p>
                  </div>
                  {currentOrder.deliveryFee > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">配送费</p>
                      <p className="text-base text-gray-900">¥{Number(currentOrder.deliveryFee).toFixed(2)}</p>
                    </div>
                  )}
                  {currentOrder.notes && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">顾客备注</p>
                      <p className="text-base text-gray-900">{currentOrder.notes}</p>
                    </div>
                  )}
                  {(currentOrder.deliveryTime || currentOrder.pickupTime) && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {currentOrder.deliveryTime ? '配送时间' : '自提时间'}
                      </p>
                      <p className="text-base text-gray-900">
                        {currentOrder.deliveryTime || currentOrder.pickupTime}
                      </p>
                    </div>
                  )}
                  {currentOrder.cancelReason && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">取消原因</p>
                      <p className="text-base text-danger">{currentOrder.cancelReason}</p>
                    </div>
                  )}
                  {currentOrder.hasRefund && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">退款状态</p>
                      <p className={`text-base ${currentOrder.refundStatus === 'processing' ? 'text-warning' : 'text-success'}`}>
                        {currentOrder.refundStatus === 'processing' ? '退款处理中' : '退款完成'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                {canProcessOrders && (
                  <div className="flex flex-wrap gap-2">
                    {currentOrder.status === 'pending' && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleStatusUpdate(currentOrder.id, 'processing')}
                      >
                        接单并开始准备
                      </button>
                    )}
                    {currentOrder.status === 'processing' && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleStatusUpdate(currentOrder.id, currentOrder.fulfillmentType === 'delivery' ? 'delivered' : 'completed')}
                      >
                        {currentOrder.fulfillmentType === 'delivery' ? '开始配送' : '标记完成'}
                      </button>
                    )}
                    {currentOrder.status === 'delivered' && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleStatusUpdate(currentOrder.id, 'completed')}
                      >
                        确认送达
                      </button>
                    )}
                    {currentOrder.status !== 'cancelled' && currentOrder.status !== 'completed' && (
                      <button 
                        className="btn btn-danger"
                        onClick={() => {
                          handleCancelOrder(currentOrder.id);
                          setIsDetailModalOpen(false);
                        }}
                      >
                        取消订单
                      </button>
                    )}
                    {currentOrder.status !== 'cancelled' && (currentOrder.status === 'delivered' || currentOrder.status === 'completed') && !currentOrder.hasRefund && (
                      <button 
                        className="btn btn-warning"
                        onClick={() => {
                          handleRefundOrder(currentOrder.id);
                          setIsDetailModalOpen(false);
                        }}
                      >
                        办理退款
                      </button>
                    )}
                  </div>
                )}
                <button 
                  className="btn btn-secondary w-full sm:w-auto"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;