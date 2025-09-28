import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ordersApi from '../../apis/ordersApi';

function OrderManagementPage() {
  const navigate = useNavigate();
  const { isAuthenticated, hasPermission } = useAuth();

  // 状态管理
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(null);

  // 分页参数
  const [offset] = useState(0);
  const [limit] = useState(10);

  // 模拟数据生成函数（用于API调用失败时的备用数据）
  const generateMockOrders = useCallback(() => {
    const statuses = ['pending', 'processing', 'delivered', 'completed', 'cancelled'];
    const mockOrders = Array.from({ length: 20 }, (_, index) => {
      // 生成随机订单数据
      const id = `ORD${Date.now().toString().slice(-6)}${index.toString().padStart(3, '0')}`;
      const customerName = `客户${Math.floor(Math.random() * 1000)}`;
      const customerPhone = `13${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10000000)}`;
      const orderTime = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toLocaleString('zh-CN');
      const totalAmount = Math.floor(Math.random() * 500) + 20;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const fulfillmentType = Math.random() > 0.5 ? 'delivery' : 'pickup';
      const address = fulfillmentType === 'delivery' ? `测试地址${Math.floor(Math.random() * 100)}号` : '';
      const storeName = fulfillmentType === 'pickup' ? `自提店${Math.floor(Math.random() * 10)}` : '自提店';
      const storeAddress = fulfillmentType === 'pickup' ? `自提地址${Math.floor(Math.random() * 100)}号` : '';
      const paymentMethod = Math.random() > 0.5 ? 'wechat' : 'alipay';
      
      // 生成订单商品列表
      const items = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
        id: `ITEM${Math.floor(Math.random() * 10000)}`,
        name: `商品${i + 1}`,
        price: Math.floor(Math.random() * 100) + 10,
        quantity: Math.floor(Math.random() * 5) + 1,
        imageUrl: `https://picsum.photos/80?random=${i}`
      }));
      
      // 合并基础订单和随机订单，并按时间排序
      return {
        id,
        customerName,
        customerPhone,
        orderTime,
        totalAmount,
        status,
        fulfillmentType,
        address,
        storeName,
        storeAddress,
        paymentMethod,
        items,
        notes: Math.random() > 0.7 ? '这是一条订单备注' : '',
        prepTime: '30分钟',
        deliveryFee: fulfillmentType === 'delivery' ? 5 : 0,
        deliveryTime: status === 'delivered' || status === 'completed' ? 
          new Date(Date.now() - Math.floor(Math.random() * 60 * 60 * 1000)).toLocaleString('zh-CN') : '',
        pickupTime: status === 'completed' && fulfillmentType === 'pickup' ? 
          new Date(Date.now() - Math.floor(Math.random() * 60 * 60 * 1000)).toLocaleString('zh-CN') : '',
        cancelReason: status === 'cancelled' ? '客户取消订单' : '',
        hasRefund: false,
        refundStatus: ''
      };
    });
    
    return mockOrders.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));
  }, []);

  // 从API获取订单数据
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      // 将selectedStatus从'all'转换为空字符串以匹配后端API的参数格式
      const status = selectedStatus === 'all' ? '' : selectedStatus;
      
      // 调用ordersApi中的getOrderList方法获取订单列表
      const orderList = await ordersApi.getOrderList({ offset, limit, status });
      
      // 检查API返回的数据
      if (Array.isArray(orderList)) {
        // 格式化订单数据以匹配前端展示需求
        const formattedOrders = orderList.map(order => ({
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
  }, [offset, limit, selectedStatus, generateMockOrders]);

  // 过滤订单（根据搜索词和状态）
  const filterOrders = useCallback(() => {
    if (!searchTerm && selectedStatus === 'all') {
      setFilteredOrders(orders);
      return;
    }
    
    const filtered = orders.filter(order => {
      // 状态过滤
      const statusMatch = selectedStatus === 'all' || order.status === selectedStatus;
      
      // 搜索词过滤（匹配订单ID、客户名、电话号码）
      const searchMatch = !searchTerm || 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm);
      
      return statusMatch && searchMatch;
    });
    
    setFilteredOrders(filtered);
  }, [searchTerm, selectedStatus, orders]);

  // 处理轮询停止
  const stopPolling = useCallback(() => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  }, [pollingInterval]);

  // 处理轮询开始
  const startPolling = useCallback(() => {
    // 先清除可能存在的定时器
    stopPolling();
    
    // 设置新的轮询定时器
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000); // 每30秒轮询一次
    
    setPollingInterval(interval);
  }, [fetchOrders, stopPolling]);
  
  // 处理搜索输入变化
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // 处理状态选择变化
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  // 处理订单取消
  const handleCancelOrder = async (orderId, reason) => {
    try {
      // 调用ordersApi中的updateOrder方法取消订单
      await ordersApi.updateOrder({ orderId, status: 'cancelled', cancelReason: reason });
      // 取消成功后重新获取订单列表
      fetchOrders();
    } catch (error) {
      console.error('取消订单失败:', error);
      alert('取消订单失败，请重试');
    }
  };

  // 处理订单详情查看
  const handleViewDetails = (order) => {
    setCurrentOrder(order);
    setIsDetailModalOpen(true);
  };

  // 关闭订单详情模态框
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setCurrentOrder(null);
  };

  // 渲染订单状态标签
  const renderStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: '待处理', className: 'bg-yellow-100 text-yellow-800' },
      processing: { label: '处理中', className: 'bg-blue-100 text-blue-800' },
      delivered: { label: '已送达', className: 'bg-green-100 text-green-800' },
      completed: { label: '已完成', className: 'bg-green-200 text-green-900' },
      cancelled: { label: '已取消', className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  // 渲染订单表格
  const renderOrderTable = () => {
    // 实现订单表格渲染逻辑
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                订单ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                客户信息
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                订单时间
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                总金额
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{order.customerName}</div>
                  <div className="text-gray-400 text-xs">{order.customerPhone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.orderTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  ¥{order.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderStatusBadge(order.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    详情
                  </button>
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <div className="inline-block">
                      <button
                        onClick={() => handleCancelOrder(order.id, '客户取消')}
                        className="text-red-600 hover:text-red-900"
                      >
                        取消
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // 检查权限并在权限不足时重定向
  useEffect(() => {
    if (!isAuthenticated || !hasPermission('manage-orders')) {
      navigate('/login');
      return;
    }

    // 初始加载订单数据
    fetchOrders();
    
    // 启动轮询
    startPolling();
    
    // 组件卸载时清理
    return () => {
      stopPolling();
    };
  }, [isAuthenticated, hasPermission, navigate, fetchOrders, startPolling, stopPolling]);

  // 当搜索词或状态筛选器变化时，重新过滤订单
  useEffect(() => {
    filterOrders();
  }, [searchTerm, selectedStatus, orders, filterOrders]);

  // 渲染订单详情模态框
  const renderDetailModal = () => {
    if (!isDetailModalOpen || !currentOrder) {
      return null;
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">订单详情</h2>
              <button
                onClick={handleCloseDetailModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 订单基本信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">订单ID</h3>
                <p className="text-base font-medium text-gray-900">{currentOrder.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">订单时间</h3>
                <p className="text-base text-gray-900">{currentOrder.orderTime}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">客户名称</h3>
                <p className="text-base text-gray-900">{currentOrder.customerName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">客户电话</h3>
                <p className="text-base text-gray-900">{currentOrder.customerPhone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">支付方式</h3>
                <p className="text-base text-gray-900">{currentOrder.paymentMethod === 'wechat' ? '微信支付' : '支付宝'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">订单状态</h3>
                <div className="mt-1">{renderStatusBadge(currentOrder.status)}</div>
              </div>
            </div>

            {/* 配送信息 */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">配送信息</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {currentOrder.fulfillmentType === 'delivery' ? (
                  <>
                    <p className="text-sm text-gray-500 mb-1">配送地址</p>
                    <p className="text-base text-gray-900 mb-3">{currentOrder.address}</p>
                    <p className="text-sm text-gray-500 mb-1">配送费用</p>
                    <p className="text-base text-gray-900">¥{currentOrder.deliveryFee.toFixed(2)}</p>
                    {currentOrder.deliveryTime && (
                      <>
                        <p className="text-sm text-gray-500 mt-3 mb-1">送达时间</p>
                        <p className="text-base text-gray-900">{currentOrder.deliveryTime}</p>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-500 mb-1">自提门店</p>
                    <p className="text-base text-gray-900 mb-1">{currentOrder.storeName}</p>
                    <p className="text-sm text-gray-500 mb-1">门店地址</p>
                    <p className="text-base text-gray-900 mb-3">{currentOrder.storeAddress}</p>
                    {currentOrder.pickupTime && (
                      <>
                        <p className="text-sm text-gray-500 mb-1">自提时间</p>
                        <p className="text-base text-gray-900">{currentOrder.pickupTime}</p>
                      </>
                    )}
                  </>
                )}
                {currentOrder.notes && (
                  <>
                    <p className="text-sm text-gray-500 mt-3 mb-1">备注</p>
                    <p className="text-base text-gray-900">{currentOrder.notes}</p>
                  </>
                )}
              </div>
            </div>

            {/* 订单商品 */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">订单商品</h3>
              <div className="space-y-3">
                {currentOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center py-3 border-b border-gray-100">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-12 w-12 object-cover rounded-md mr-4"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">¥{item.price.toFixed(2)} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 ml-4">
                      ¥{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 订单金额 */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">商品总额</span>
                <span className="text-gray-900">¥{currentOrder.totalAmount.toFixed(2)}</span>
              </div>
              {currentOrder.deliveryFee > 0 && (
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">配送费</span>
                  <span className="text-gray-900">¥{currentOrder.deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-medium mt-4">
                <span className="text-gray-900">实付金额</span>
                <span className="text-gray-900">¥{(currentOrder.totalAmount + currentOrder.deliveryFee).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
        </div>
      </div>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 筛选和搜索 */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">订单筛选</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="搜索订单ID、客户名称或电话号码..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="all">全部状态</option>
                  <option value="pending">待支付</option>
                  <option value="processing">处理中</option>
                  <option value="delivered">已送达</option>
                  <option value="completed">已完成</option>
                  <option value="cancelled">已取消</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 订单列表 */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {loading ? (
            <div className="px-4 py-8 text-center text-gray-500">加载中...</div>
          ) : (
            <>
              {renderOrderTable()}
              {filteredOrders.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500">暂无匹配的订单</div>
              )}
            </>
          )}
        </div>
      </main>

      {/* 订单详情模态框 */}
      {renderDetailModal()}
    </div>
  );
};

// 导出组件
export default OrderManagementPage;