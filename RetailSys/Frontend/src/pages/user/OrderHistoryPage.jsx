import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import orderApi from '../../apis/orderApi';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';

// Configure dayjs
dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Load orders
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      
      try {
        // 从API获取订单列表
        const orderData = await orderApi.getOrders();
        setOrders(orderData);
      } catch (error) {
        console.error('获取订单列表失败:', error);
        // 使用模拟数据作为后备
        const mockOrders = generateMockOrders();
        setOrders(mockOrders);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated]);

  // Handle not logged in state
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <i className="fa fa-user-circle text-6xl text-gray-200 mb-4"></i>
          <h2 className="text-xl font-bold text-gray-900 mb-2">请先登录</h2>
          <p className="text-gray-500 mb-6">登录后即可查看您的订单历史</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            <i className="fa fa-sign-in mr-2"></i>
            立即登录
          </button>
          <button 
            className="btn btn-white border border-gray-300 ml-4"
            onClick={() => navigate('/')}
          >
            <i className="fa fa-home mr-2"></i>
            返回首页
          </button>
        </div>
      </div>
    );
  }

  // Generate mock orders for demonstration
  const generateMockOrders = () => {
    const mockOrders = [];
    const statuses = ['pending', 'processing', 'delivered', 'completed', 'cancelled', 'refunded'];
    const products = [
        { id: 1, name: '有机牛奶 1L', price: 19.90, imageUrl: 'https://picsum.photos/100?random=20' },
        { id: 2, name: '全麦面包 400g', price: 15.80, imageUrl: 'https://picsum.photos/100?random=21' },
        { id: 3, name: '新鲜鸡蛋 12枚', price: 22.50, imageUrl: 'https://picsum.photos/100?random=22' },
        { id: 4, name: '有机蔬菜礼盒', price: 59.90, imageUrl: 'https://picsum.photos/100?random=23' },
        { id: 5, name: '精选水果拼盘', price: 45.80, imageUrl: 'https://picsum.photos/100?random=24' },
        { id: 6, name: '优质大米 5kg', price: 68.00, imageUrl: 'https://picsum.photos/100?random=25' },
        { id: 7, name: '橄榄油 500ml', price: 79.90, imageUrl: 'https://picsum.photos/100?random=26' },
        { id: 8, name: '坚果礼盒装', price: 98.00, imageUrl: 'https://picsum.photos/100?random=27' },
      ];

    for (let i = 0; i < 12; i++) {
      const orderDate = dayjs().subtract(i, 'day');
      const orderProducts = [];
      const productCount = Math.floor(Math.random() * 4) + 1;
      const selectedProducts = new Set();

      // Select random products without duplicates
      while (selectedProducts.size < productCount) {
        selectedProducts.add(Math.floor(Math.random() * products.length));
      }

      // Create order products
      selectedProducts.forEach(idx => {
        const product = products[idx];
        orderProducts.push({
          ...product,
          quantity: Math.floor(Math.random() * 3) + 1
        });
      });

      // Calculate total
      const total = orderProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);

      // Determine order status based on days ago
      let status;
      if (i === 0) {
        status = 'pending'; // Today's order is pending
      } else if (i === 1) {
        status = 'processing'; // Yesterday's order is processing
      } else if (i < 5) {
        status = 'delivered'; // Recent orders are delivered
      } else {
        // Older orders are completed or have other statuses
        status = statuses[Math.floor(Math.random() * statuses.length)];
      }

      // 添加支付状态字段，已送达订单随机设置支付状态
      const isPaid = status === 'delivered' ? Math.random() > 0.5 : 
                    (status === 'completed' || status === 'refunded') ? true : false;
                     
      mockOrders.push({
        id: `ORD${orderDate.format('YYYYMMDD')}${String(i + 100).slice(-3)}`,
        createdAt: orderDate.toISOString(),
        products: orderProducts,
        total: total.toFixed(2),
        status: status,
        paid: isPaid,
        deliveryMethod: Math.random() > 0.3 ? 'delivery' : 'pickup',
        paymentMethod: Math.random() > 0.2 ? 'wechat' : 'alipay',
        address: {
          name: '张女士',
          phone: '138****6789',
          address: '北京市朝阳区建国路88号',
          isDefault: true
        }
      });
    }

    return mockOrders;
  };

  // Filter orders based on criteria
  const filteredOrders = orders.filter(order => {
    // Filter by status
    if (filterStatus !== 'all' && order.status !== filterStatus) {
      return false;
    }

    // Filter by date range
    const orderDate = dayjs(order.createdAt);
    const today = dayjs();
    if (dateRange === '7days' && orderDate.isBefore(today.subtract(7, 'day'))) {
      return false;
    } else if (dateRange === '30days' && orderDate.isBefore(today.subtract(30, 'day'))) {
      return false;
    } else if (dateRange === '90days' && orderDate.isBefore(today.subtract(90, 'day'))) {
      return false;
    }

    // Filter by search query
    if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders?.slice(indexOfFirstItem, indexOfLastItem) || [];
  // 确保totalPages始终是有效的数值，防止map方法调用失败
  const totalPages = Math.max(1, Math.ceil((filteredOrders?.length || 0) / itemsPerPage) || 1);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toggle order details expansion
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Get status display text
  const getStatusText = (status) => {
    const statusMap = {
      'pending': { text: '待付款', class: 'text-yellow-500 bg-yellow-50' },
      'processing': { text: '处理中', class: 'text-blue-500 bg-blue-50' },
      'delivered': { text: '已送达', class: 'text-green-500 bg-green-50' },
      'completed': { text: '已完成', class: 'text-gray-500 bg-gray-50' },
      'cancelled': { text: '已取消', class: 'text-gray-400 bg-gray-50' },
      'refunded': { text: '已退款', class: 'text-red-500 bg-red-50' }
    };
    return statusMap[status] || { text: status, class: 'text-gray-500 bg-gray-50' };
  };

  // Handle repurchase
  const handleRepurchase = (order) => {
    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem('userCart') || '[]');
    
    // Add all products from the order to cart
    order.products.forEach(product => {
      const existingItem = cart.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += product.quantity;
      } else {
        cart.push({ ...product });
      }
    });
    
    // Save updated cart to localStorage
    localStorage.setItem('userCart', JSON.stringify(cart));
    
    // Navigate to cart page
    navigate('/user/cart');
  };

  // Handle check order
  const handleCheckOrder = (orderId) => {
    // For now, we'll just expand the order details
    toggleOrderDetails(orderId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">加载订单列表中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a href="/" className="hover:text-primary">
                  首页
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="fa fa-chevron-right text-xs mx-2"></i>
                  <span className="text-gray-900 font-medium">我的订单</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">我的订单</h1>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">订单状态</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">全部订单</option>
                <option value="pending">待付款</option>
                <option value="processing">处理中</option>
                <option value="delivered">已送达</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
                <option value="refunded">已退款</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">时间范围</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">全部时间</option>
                <option value="7days">近7天</option>
                <option value="30days">近30天</option>
                <option value="90days">近90天</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">订单编号搜索</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="请输入订单编号"
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Order List */}
        {currentOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <i className="fa fa-shopping-bag text-6xl text-gray-200 mb-4"></i>
            <p className="text-gray-500 mb-6">暂无相关订单</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/user/products')}
            >
              <i className="fa fa-shopping-bag mr-2"></i>
              去购物
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {currentOrders.map((order) => {
              const statusInfo = getStatusText(order.status);
              const orderDate = dayjs(order.createdAt);
              // 根据用户需求调整订单操作权限
  const canPay = order.status === 'delivered' && !order.paid;
  const canCancel = order.status === 'pending' || order.status === 'processing';
  const canUrge = order.status === 'processing';
  const canRefund = ['delivered'].includes(order.status);
  const canRepurchase = ['completed'].includes(order.status);
              
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-4 sm:mb-0">
                      <div className="flex items-center mb-2">
                        <span className="text-sm text-gray-500 mr-3">订单编号：</span>
                        <span className="text-sm font-medium text-gray-900">{order.id}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>下单时间：{orderDate.format('YYYY-MM-DD HH:mm:ss')}</span>
                        <span className="mx-2">|</span>
                        <span>{orderDate.fromNow()}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.class}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>

                  {/* Order Products */}
                  <div 
                    className={`transition-all duration-300 overflow-hidden ${expandedOrder === order.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    {order.products?.map((product) => (
                      <div 
                        key={product.id} 
                        className="p-6 border-b border-gray-100 flex items-center"
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-grow">
                          <h3 className="text-gray-900 font-medium mb-1 line-clamp-1">{product.name}</h3>
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">x{product.quantity}</div>
                            <div className="text-sm font-medium text-gray-900">¥{product.price.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Order Summary */}
                    <div className="p-6 bg-gray-50">
                      <div className="flex flex-col sm:flex-row justify-between">
                        <div className="mb-4 sm:mb-0">
                          <div className="flex items-center mb-2 text-sm">
                            <span className="text-gray-500 mr-2">配送方式：</span>
                            <span className="text-gray-900">
                              {order.deliveryMethod === 'delivery' ? '快递配送' : '门店自提'}
                            </span>
                          </div>
                          <div className="flex items-center mb-2 text-sm">
                            <span className="text-gray-500 mr-2">支付方式：</span>
                            <span className="text-gray-900">
                              {order.paymentMethod === 'wechat' ? '微信支付' : '支付宝'}
                            </span>
                          </div>
                          {order.deliveryMethod === 'delivery' && (
                            <div className="text-sm">
                              <span className="text-gray-500 mr-2">收货地址：</span>
                              <span className="text-gray-900">
                                {order.address.name} {order.address.phone} {order.address.address}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex justify-end items-center mb-1 text-sm">
                            <span className="text-gray-500 mr-2">商品总价：</span>
                            <span className="text-gray-900">¥{order.total}</span>
                          </div>
                          <div className="flex justify-end items-center mb-1 text-sm">
                            <span className="text-gray-500 mr-2">运费：</span>
                            <span className="text-gray-900">¥0.00</span>
                          </div>
                          <div className="flex justify-end items-center text-base font-bold text-danger">
                            <span className="text-gray-900 mr-2">实付金额：</span>
                            <span>¥{order.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="p-6 flex flex-col sm:flex-row justify-between items-center border-t border-gray-100">
                    <button 
                      className="text-sm text-gray-500 hover:text-primary mb-4 sm:mb-0"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      <i className={`fa ${expandedOrder === order.id ? 'fa-chevron-up' : 'fa-chevron-down'} mr-1`}></i>
                      {expandedOrder === order.id ? '收起' : '查看详情'}
                    </button>
                    <div className="flex flex-wrap justify-center gap-2">
                      {canPay && (
                      <button 
                        className="btn btn-primary px-4 py-2 text-sm"
                        onClick={() => navigate(`/user/checkout?orderId=${order.id}`)}
                      >
                        <i className="fa fa-credit-card mr-1"></i>
                        去支付
                      </button>
                    )}
                    {canCancel && (
                      <button 
                        className="btn btn-white border border-gray-300 px-4 py-2 text-sm"
                        onClick={() => {
                          // In a real app, this would call an API
                          const updatedOrders = orders.map(o => 
                            o.id === order.id ? { ...o, status: 'cancelled' } : o
                          );
                          setOrders(updatedOrders);
                          localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
                        }}
                      >
                        <i className="fa fa-times-circle mr-1 text-gray-500"></i>
                        取消订单
                      </button>
                    )}
                    {canUrge && (
                      <button 
                        className="btn btn-white border border-gray-300 px-4 py-2 text-sm"
                      >
                        <i className="fa fa-bell mr-1 text-yellow-500"></i>
                        催促发货
                      </button>
                    )}
                    {canRefund && (
                      <button 
                        className="btn btn-white border border-gray-300 px-4 py-2 text-sm"
                      >
                        <i className="fa fa-undo mr-1 text-blue-500"></i>
                        申请退款
                      </button>
                    )}
                    {canRepurchase && (
                      <button 
                        className="btn btn-white border border-gray-300 px-4 py-2 text-sm"
                        onClick={() => handleRepurchase(order)}
                      >
                        <i className="fa fa-refresh mr-1 text-green-500"></i>
                        再次购买
                      </button>
                    )}
                      {order.status === 'delivered' && order.paid && (
                        <button 
                          className="btn btn-white border border-gray-300 px-4 py-2 text-sm"
                          onClick={() => {
                            // In a real app, this would call an API
                            const updatedOrders = orders.map(o => 
                              o.id === order.id ? { ...o, status: 'completed' } : o
                            );
                            setOrders(updatedOrders);
                            localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
                          }}
                        >
                          <i className="fa fa-check-circle mr-1 text-success"></i>
                          确认收货
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center" aria-label="Pagination">
              <button
                className={`px-4 py-2 mx-1 rounded-lg border ${currentPage === 1 ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-300 hover:border-primary hover:text-primary'}`}
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="fa fa-chevron-left"></i>
              </button>
              {/* 确保分页数组始终是可迭代的，避免map方法调用失败 */}
              {Array.from({ length: Math.max(1, totalPages || 1) }, (_, i) => i + 1)?.map((page) => (
                <button
                  key={page}
                  className={`px-4 py-2 mx-1 rounded-lg border ${currentPage === page ? 'border-primary bg-primary text-white' : 'border-gray-300 hover:border-primary hover:text-primary'}`}
                  onClick={() => paginate(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className={`px-4 py-2 mx-1 rounded-lg border ${currentPage === Math.max(1, totalPages || 1) ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-300 hover:border-primary hover:text-primary'}`}
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.max(1, totalPages || 1)}
              >
                <i className="fa fa-chevron-right"></i>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;