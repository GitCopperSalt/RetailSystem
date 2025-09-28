import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import orderApi from '../../apis/orderApi';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);

  // Load order details
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadOrderDetails = async () => {
      setLoading(true);
      
      try {
        // 从API获取订单详情
        const orderData = await orderApi.getOrderDetail(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('获取订单详情失败:', error);
        // 使用模拟数据作为后备
        setOrder({
          id: orderId || `ORD${Date.now()}`,
          total: '139.80',
          status: 'pending',
          createdAt: new Date().toISOString(),
          deliveryMethod: 'delivery',
          paymentMethod: 'wechat'
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId, isAuthenticated, navigate]);

  // Countdown to automatic redirect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Redirect to order list page after countdown
      navigate('/user/orders');
    }
  }, [countdown, navigate]);

  // Handle view order
  const handleViewOrder = () => {
    // 确保跳转到正确的订单管理页面
    navigate('/user/orders');
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    navigate('/user/products');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">加载订单信息中...</p>
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
                  <a href="/user/cart" className="hover:text-primary">
                    购物车
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="fa fa-chevron-right text-xs mx-2"></i>
                  <a href="/user/checkout" className="hover:text-primary">
                    结算
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="fa fa-chevron-right text-xs mx-2"></i>
                  <span className="text-gray-900 font-medium">订单提交成功</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-8 text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 text-success mb-6">
              <i className="fa fa-check-circle text-4xl"></i>
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">订单提交成功！</h2>
            <p className="text-gray-500 mb-8">您的订单已成功提交，我们将尽快为您处理</p>

            {/* Order Summary Card */}
            <div className="max-w-md mx-auto bg-gray-50 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div className="text-gray-500">订单编号</div>
                <div className="text-gray-900 font-medium text-right">{order.id}</div>
                <div className="text-gray-500">下单时间</div>
                <div className="text-gray-900 text-right">
                  {new Date(order.createdAt).toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                  }
                </div>
                <div className="text-gray-500">支付方式</div>
                <div className="text-gray-900 text-right">
                  {order.paymentMethod === 'wechat' ? '微信支付' : '支付宝'}
                </div>
                <div className="text-gray-500">配送方式</div>
                <div className="text-gray-900 text-right">
                  {order.deliveryMethod === 'delivery' ? '快递配送' : '门店自提'}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">订单金额</div>
                  <div className="text-lg font-bold text-danger">¥{order.total}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="btn btn-primary px-8 py-3 text-lg"
                onClick={handleViewOrder}
              >
                <i className="fa fa-list-alt mr-2"></i>
                查看订单
              </button>
              <button 
                className="btn btn-secondary px-8 py-3 text-lg"
                onClick={handleContinueShopping}
              >
                <i className="fa fa-shopping-bag mr-2"></i>
                继续购物
              </button>
            </div>

            {/* Auto Redirect Notice */}
            <p className="text-xs text-gray-400 mt-8">
              {countdown > 0 && `将在 ${countdown} 秒后自动跳转到订单列表页...`}
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-10">
          <h3 className="text-xl font-bold text-gray-900 mb-6">订单后续流程</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                <i className="fa fa-credit-card text-xl"></i>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">支付订单</h4>
                <p className="text-gray-500 text-sm">
                  请在30分钟内完成支付，超时订单将自动取消
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-4">
                <i className="fa fa-shopping-basket text-xl"></i>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">商家备货</h4>
                <p className="text-gray-500 text-sm">
                  支付成功后，商家将尽快为您备货
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-start">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-4">
                <i className="fa fa-truck text-xl"></i>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">配送收货</h4>
                <p className="text-gray-500 text-sm">
                  商品发货后，您可以在订单详情查看物流信息
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6">为您推荐</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Mock recommended products */}
            {[1, 2, 3, 4, 5].map((_, index) => {
              const mockProduct = {
                id: index + 200,
                name: `推荐商品 ${index + 1}`,
                price: 29.90 + Math.floor(Math.random() * 80),
                imageUrl: `https://picsum.photos/300?random=${index + 1}`, // 使用picsum.photos替代via.placeholder.com
                rating: 4 + Math.random()
              };
              
              return (
                <div 
                  key={mockProduct.id} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/user/product/${mockProduct.id}`)}
                >
                  <div className="h-32 overflow-hidden">
                    <img
                      src={mockProduct.imageUrl}
                      alt={mockProduct.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 h-10">{mockProduct.name}</h3>
                    <div className="flex items-center text-yellow-500 mb-1">
                      <i className="fa fa-star text-xs"></i>
                      <span className="ml-1 text-xs text-gray-700">{mockProduct.rating.toFixed(1)}</span>
                    </div>
                    <div className="text-sm font-bold text-danger">¥{mockProduct.price.toFixed(2)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;