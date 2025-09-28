import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import orderApi from '../../apis/orderApi';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('wechat');
  const [shippingFee, setShippingFee] = useState(5.00);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [useCoupon, setUseCoupon] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false
  });

  // Load cart and user data
  useEffect(() => {
    if (!isAuthenticated) {
      // If not logged in, redirect to login
      localStorage.setItem('checkoutRedirect', true);
      navigate('/login');
      return;
    }

    const loadCheckoutData = () => {
      setLoading(true);

      setTimeout(() => {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('userCart');
        const cartItems = savedCart ? JSON.parse(savedCart) : [];
        
        // If cart is empty, redirect back to cart page
        if (cartItems.length === 0) {
          navigate('/user/cart');
          return;
        }

        setCart(cartItems);

        // Mock addresses data
        const mockAddresses = [
          {
            id: 1,
            name: '张三',
            phone: '13800138000',
            province: '北京市',
            city: '北京市',
            district: '朝阳区',
            detail: '建国路88号现代城5号楼1001室',
            isDefault: true
          },
          {
            id: 2,
            name: '张三',
            phone: '13800138000',
            province: '北京市',
            city: '北京市',
            district: '海淀区',
            detail: '中关村南大街5号理工科技大厦8层',
            isDefault: false
          }
        ];

        setAddresses(mockAddresses);
        // Select default address or first address if no default
        setSelectedAddress(mockAddresses.find(addr => addr.isDefault) || mockAddresses[0]);

        // Mock available coupons
        setAvailableCoupons([
          { id: 1, name: '满39元减5元', minAmount: 39, discount: 5 },
          { id: 2, name: '满99元减10元', minAmount: 99, discount: 10 },
          { id: 3, name: '新用户专享减15元', minAmount: 50, discount: 15, isNewUser: true }
        ]);

        setLoading(false);
      }, 800);
    };

    loadCheckoutData();
  }, [isAuthenticated, navigate]);

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // Calculate shipping fee
  const calculateShippingFee = () => {
    const subtotal = parseFloat(calculateSubtotal());
    if (deliveryMethod === 'delivery') {
      return subtotal >= 39 ? 0 : shippingFee;
    }
    return 0; // No shipping fee for pickup
  };

  // Calculate discount amount
  const calculateDiscount = () => {
    if (!useCoupon || !selectedCoupon) return '0.00';
    const subtotal = parseFloat(calculateSubtotal());
    if (subtotal >= selectedCoupon.minAmount) {
      return selectedCoupon.discount.toFixed(2);
    }
    return '0.00';
  };

  // Calculate total
  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const shipping = parseFloat(calculateShippingFee());
    const discount = parseFloat(calculateDiscount());
    return (subtotal + shipping - discount).toFixed(2);
  };

  // Handle address selection
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  // Handle new address form change
  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle new address form submit
  const handleNewAddressSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newAddress.name || !newAddress.phone || !newAddress.province || 
        !newAddress.city || !newAddress.district || !newAddress.detail) {
      alert('请填写完整的地址信息');
      return;
    }

    // Create new address object
    const address = {
      ...newAddress,
      id: Date.now(), // Generate unique ID
    };

    // Update addresses list
    setAddresses(prev => {
      // If this is set as default, unset other defaults
      if (newAddress.isDefault) {
        return [address, ...prev.map(a => ({ ...a, isDefault: false }))];
      }
      return [address, ...prev];
    });

    // Select the new address
    setSelectedAddress(address);

    // Reset form and close modal
    setNewAddress({
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      isDefault: false
    });
    setShowAddressModal(false);

    // Save addresses to localStorage (in a real app, you would save to server)
    localStorage.setItem('userAddresses', JSON.stringify([address, ...addresses]));
  };

  // Handle coupon selection
  const handleCouponSelect = (coupon) => {
    const subtotal = parseFloat(calculateSubtotal());
    if (subtotal >= coupon.minAmount) {
      setSelectedCoupon(coupon);
      setUseCoupon(true);
      setShowCouponModal(false);
    } else {
      alert(`订单金额需满${coupon.minAmount}元才能使用此优惠券`);
    }
  };

  // Handle order submission
  const handleSubmitOrder = async () => {
    // Validate required fields
    if (!selectedAddress) {
      alert('请选择或添加收货地址');
      return;
    }

    // Check if cart is empty
    if (cart.length === 0) {
      alert('购物车为空，请先添加商品');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate order data
      const orderData = {
        items: cart,
        address: selectedAddress,
        subtotal: calculateSubtotal(),
        shippingFee: calculateShippingFee(),
        discount: calculateDiscount(),
        total: calculateTotal(),
        paymentMethod: selectedPaymentMethod,
        deliveryMethod: deliveryMethod
      };

      // Call API to create order
      const order = await orderApi.createOrder(orderData);

      // Clear cart
      localStorage.removeItem('userCart');
      
      setIsSubmitting(false);

      // Redirect to order success page with order ID
      navigate(`/user/order-success/${order.id}`);
    } catch (error) {
      console.error('创建订单失败:', error);
      alert('创建订单失败，请稍后重试');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">加载结算信息中...</p>
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
                  <span className="text-gray-900 font-medium">结算</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Address Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">收货信息</h2>
                <button 
                  className="text-sm text-primary hover:text-primary/80"
                  onClick={() => setShowAddressModal(true)}
                >
                  <i className="fa fa-plus-circle mr-1"></i>新增地址
                </button>
              </div>
              
              <div className="p-6">
                {addresses.length > 0 ? (
                  <div className="space-y-4">
                    {addresses.map(address => (
                      <div 
                        key={address.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedAddress && selectedAddress.id === address.id ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-primary'}`}
                        onClick={() => handleAddressSelect(address)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">{address.name}</span>
                            <span className="text-sm text-gray-500 ml-4">{address.phone}</span>
                            {address.isDefault && (
                              <span className="text-xs text-white bg-primary px-1.5 py-0.5 rounded ml-2">默认</span>
                            )}
                          </div>
                          <div className={`h-5 w-5 rounded-full border ${selectedAddress && selectedAddress.id === address.id ? 'border-primary bg-primary text-white' : 'border-gray-300'} flex items-center justify-center`}>
                            {selectedAddress && selectedAddress.id === address.id && <i className="fa fa-check text-xs"></i>}
                          </div>
                        </div>
                        <div className="text-sm text-gray-700 mt-2">
                          {address.province} {address.city} {address.district} {address.detail}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <i className="fa fa-map-marker text-3xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500 mb-4">还没有添加收货地址</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowAddressModal(true)}
                    >
                      添加收货地址
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Delivery Method Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-900">配送方式</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  <div 
                    className={`flex items-center p-4 rounded-lg border cursor-pointer ${deliveryMethod === 'delivery' ? 'border-primary bg-primary/10' : 'border-gray-200'}`}
                    onClick={() => setDeliveryMethod('delivery')}
                  >
                    <div className={`h-5 w-5 rounded-full border ${deliveryMethod === 'delivery' ? 'border-primary bg-primary text-white' : 'border-gray-300'} flex items-center justify-center`}>
                      {deliveryMethod === 'delivery' && <i className="fa fa-check text-xs"></i>}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">快递配送</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {parseFloat(calculateSubtotal()) >= 39 ? '免运费' : `运费 ¥${shippingFee.toFixed(2)}`}，预计今日送达
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`flex items-center p-4 rounded-lg border cursor-pointer ${deliveryMethod === 'pickup' ? 'border-primary bg-primary/10' : 'border-gray-200'}`}
                    onClick={() => setDeliveryMethod('pickup')}
                  >
                    <div className={`h-5 w-5 rounded-full border ${deliveryMethod === 'pickup' ? 'border-primary bg-primary text-white' : 'border-gray-300'} flex items-center justify-center`}>
                      {deliveryMethod === 'pickup' && <i className="fa fa-check text-xs"></i>}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">门店自提</div>
                      <div className="text-xs text-gray-500 mt-0.5">免运费，可到附近门店自提</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Method Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-900">支付方式</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  <div 
                    className={`flex items-center p-4 rounded-lg border cursor-pointer ${selectedPaymentMethod === 'wechat' ? 'border-primary bg-primary/10' : 'border-gray-200'}`}
                    onClick={() => setSelectedPaymentMethod('wechat')}
                  >
                    <div className={`h-5 w-5 rounded-full border ${selectedPaymentMethod === 'wechat' ? 'border-primary bg-primary text-white' : 'border-gray-300'} flex items-center justify-center`}>
                      {selectedPaymentMethod === 'wechat' && <i className="fa fa-check text-xs"></i>}
                    </div>
                    <div className="ml-3 flex items-center">
                      <i className="fa fa-wechat text-2xl text-green-500 mr-3"></i>
                      <div>
                        <div className="text-sm font-medium text-gray-900">微信支付</div>
                        <div className="text-xs text-gray-500 mt-0.5">使用微信扫码支付，安全便捷</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Notes Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-900">订单备注</h2>
              </div>
              
              <div className="p-6">
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors" 
                  placeholder="选填，请输入订单备注信息（如：送达时间要求等）"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-6">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-900">订单摘要</h2>
              </div>
              
              {/* Cart Items Preview */}
              <div className="p-6 border-b border-gray-100 max-h-64 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex py-2 border-b border-gray-100 last:border-0">
                    <div className="flex-shrink-0 h-16 w-16">
                      <img 
                        className="h-16 w-16 rounded-md object-cover" 
                        src={item.imageUrl} 
                        alt={item.name}
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</div>
                      {item.option && (
                        <div className="text-xs text-gray-500 mt-1">{item.option}</div>
                      )}
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-sm text-gray-900">¥{item.price.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">x{item.quantity}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Price Summary */}
              <div className="p-6">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">商品总价</span>
                    <span className="text-gray-900">¥{calculateSubtotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">运费</span>
                    <span className="text-gray-900">¥{calculateShippingFee().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">优惠券</span>
                    <div className="flex items-center">
                      {useCoupon && selectedCoupon ? (
                        <>
                          <span className="text-danger">-¥{calculateDiscount()}</span>
                          <button 
                            className="text-xs text-primary ml-2 hover:text-primary/80"
                            onClick={() => {
                              setUseCoupon(false);
                              setSelectedCoupon(null);
                            }}
                          >
                            取消
                          </button>
                        </>
                      ) : (
                        <button 
                          className="text-primary hover:text-primary/80"
                          onClick={() => setShowCouponModal(true)}
                        >
                          选择优惠券
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Total */}
                <div className="flex justify-between text-lg font-bold mb-6 pb-6 border-b border-gray-200">
                  <span className="text-gray-900">实付款</span>
                  <span className="text-danger">¥{calculateTotal()}</span>
                </div>
                
                {/* Submit Order Button */}
                <button 
                  className="btn btn-primary w-full py-3 text-lg"
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting || !selectedAddress}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa fa-spinner fa-spin mr-2"></i>
                      提交中...
                    </>
                  ) : (
                    '提交订单'
                  )}
                </button>
                
                {/* Terms Agreement */}
                <div className="mt-4 text-xs text-gray-500">
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" defaultChecked />
                    <span className="ml-2">我已阅读并同意 <a href="#" className="text-primary hover:underline">用户协议</a>和<a href="#" className="text-primary hover:underline">隐私政策</a></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">选择优惠券</h3>
                  <button 
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setShowCouponModal(false)}
                  >
                    <i className="fa fa-times"></i>
                  </button>
                </div>
              </div>
              
              <div className="p-6 max-h-80 overflow-y-auto">
                {availableCoupons.length > 0 ? (
                  <div className="space-y-3">
                    {availableCoupons.map(coupon => {
                      const subtotal = parseFloat(calculateSubtotal());
                      const applicable = subtotal >= coupon.minAmount;
                      return (
                        <div 
                          key={coupon.id}
                          className={`flex items-center p-3 rounded-lg border cursor-pointer ${selectedCoupon && selectedCoupon.id === coupon.id ? 'border-primary bg-primary/10' : applicable ? 'border-gray-200' : 'border-gray-200 opacity-50 cursor-not-allowed'}`}
                          onClick={() => applicable && handleCouponSelect(coupon)}
                        >
                          <div className="flex-shrink-0 h-16 w-16 rounded-lg bg-danger/10 flex items-center justify-center text-danger font-bold">
                            -{coupon.discount}元
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="text-sm font-medium text-gray-900">{coupon.name}</div>
                            <div className="text-xs text-gray-500 mt-1">订单满{coupon.minAmount}元可用</div>
                            {coupon.isNewUser && (
                              <div className="text-xs text-primary mt-0.5">新用户专享</div>
                            )}
                          </div>
                          {selectedCoupon && selectedCoupon.id === coupon.id && (
                            <div className="h-5 w-5 rounded-full border border-primary bg-primary text-white flex items-center justify-center">
                              <i className="fa fa-check text-xs"></i>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <i className="fa fa-ticket text-3xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">暂无可用优惠券</p>
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  className="btn btn-secondary w-full sm:w-auto"
                  onClick={() => setShowCouponModal(false)}
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleNewAddressSubmit}>
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">新增收货地址</h3>
                    <button 
                      type="button" 
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => setShowAddressModal(false)}
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">收货人</label>
                        <input 
                          type="text" 
                          name="name" 
                          value={newAddress.name}
                          onChange={handleNewAddressChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                          placeholder="请输入收货人姓名"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">手机号码</label>
                        <input 
                          type="tel" 
                          name="phone" 
                          value={newAddress.phone}
                          onChange={handleNewAddressChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                          placeholder="请输入手机号码"
                          required
                          pattern="1[3-9]\d{9}"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">省份</label>
                        <select 
                          name="province" 
                          value={newAddress.province}
                          onChange={handleNewAddressChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                          required
                        >
                          <option value="">请选择</option>
                          <option value="北京市">北京市</option>
                          <option value="上海市">上海市</option>
                          <option value="广东省">广东省</option>
                          <option value="江苏省">江苏省</option>
                          <option value="浙江省">浙江省</option>
                          {/* More provinces would be added here */}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">城市</label>
                        <select 
                          name="city" 
                          value={newAddress.city}
                          onChange={handleNewAddressChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                          required
                        >
                          <option value="">请选择</option>
                          {newAddress.province === '北京市' && (
                            <option value="北京市">北京市</option>
                          )}
                          {newAddress.province === '上海市' && (
                            <option value="上海市">上海市</option>
                          )}
                          {newAddress.province === '广东省' && (
                            <>
                              <option value="广州市">广州市</option>
                              <option value="深圳市">深圳市</option>
                              <option value="东莞市">东莞市</option>
                            </>
                          )}
                          {/* More cities would be added here based on selected province */}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">区县</label>
                        <select 
                          name="district" 
                          value={newAddress.district}
                          onChange={handleNewAddressChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                          required
                        >
                          <option value="">请选择</option>
                          {newAddress.city === '北京市' && (
                            <>
                              <option value="朝阳区">朝阳区</option>
                              <option value="海淀区">海淀区</option>
                              <option value="东城区">东城区</option>
                              <option value="西城区">西城区</option>
                            </>
                          )}
                          {/* More districts would be added here based on selected city */}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">详细地址</label>
                      <textarea 
                        name="detail" 
                        value={newAddress.detail}
                        onChange={handleNewAddressChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        placeholder="请输入详细地址信息，如街道、门牌号、小区、楼栋号、单元等"
                        rows="3"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        name="isDefault" 
                        id="isDefault"
                        value={newAddress.isDefault}
                        checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                        className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                        设置为默认收货地址
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button 
                    type="submit" 
                    className="btn btn-primary w-full sm:w-auto"
                  >
                    保存
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary w-full sm:w-auto mt-3 sm:mt-0 sm:mr-3"
                    onClick={() => setShowAddressModal(false)}
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;