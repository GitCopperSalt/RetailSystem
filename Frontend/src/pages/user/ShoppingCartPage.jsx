import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { shoppingCartApi } from '../../services/apiService';

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [shippingFee, setShippingFee] = useState(5.00); // Default shipping fee
  const [discountAmount, setDiscountAmount] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState('delivery'); // 'delivery' or 'pickup'

  // Load cart from API or localStorage
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      
      try {
        if (isAuthenticated) {
          // 如果已登录，从API获取购物车数据
          const cartData = await shoppingCartApi.getShoppingCarts();
          // 转换购物车数据格式以匹配前端预期的结构
          const formattedCart = cartData.map(item => ({
            id: item.product_id,
            name: item.product_name,
            category: item.category_name || '其他',
            price: parseFloat(item.price),
            originalPrice: parseFloat(item.price) * 1.1, // 模拟原价
            imageUrl: 'https://picsum.photos/200?random=' + item.product_id,
            quantity: item.quantity,
            stock: item.stock,
            option: item.option || null
          }));
          setCart(formattedCart);
        } else {
          // 未登录，从localStorage获取或使用模拟数据
          const savedCart = localStorage.getItem('userCart');
          let cartItems = savedCart ? JSON.parse(savedCart) : [];
          
          // If cart is empty, use mock data for demonstration
          if (cartItems.length === 0) {
            cartItems = [
              {
                id: 1,
                name: '有机蔬菜礼盒',
                category: '蔬菜',
                price: 89.90,
                originalPrice: 99.90,
                imageUrl: 'https://picsum.photos/200?random=1',
                quantity: 2,
                stock: 15,
                option: '大份装 (约5kg)'
              },
              {
                id: 2,
                name: '优质大米 5kg',
                category: '粮油',
                price: 49.90,
                originalPrice: 59.90,
                imageUrl: 'https://picsum.photos/200?random=2',
                quantity: 1,
                stock: 85
              }
            ];
            // Save mock cart to localStorage
            localStorage.setItem('userCart', JSON.stringify(cartItems));
          }
          
          setCart(cartItems);
        }
        
        // Load available coupons
        setAvailableCoupons([
          { id: 1, name: '满39元减5元', minAmount: 39, discount: 5 },
          { id: 2, name: '满99元减10元', minAmount: 99, discount: 10 },
          { id: 3, name: '满199元减20元', minAmount: 199, discount: 20 }
        ]);
      } catch (error) {
        console.error('加载购物车失败:', error);
        // 使用本地存储或模拟数据作为后备
        const savedCart = localStorage.getItem('userCart');
        const cartItems = savedCart ? JSON.parse(savedCart) : [];
        setCart(cartItems);
      } finally {
        setLoading(false);
      }
    };
    
    loadCart();
  }, [isAuthenticated]);

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // Calculate if shipping fee should be waived
  const calculateShippingFee = () => {
    const subtotal = parseFloat(calculateSubtotal());
    if (deliveryMethod === 'delivery') {
      return subtotal >= 39 ? 0 : shippingFee;
    }
    return 0; // No shipping fee for pickup
  };

  // Calculate total
  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const shipping = parseFloat(calculateShippingFee());
    const discount = parseFloat(getDiscountAmount());
    return (subtotal + shipping - discount).toFixed(2);
  };

  // Get discount amount based on selected coupon and subtotal
  const getDiscountAmount = () => {
    if (!selectedCoupon) return '0.00';
    const subtotal = parseFloat(calculateSubtotal());
    if (subtotal >= selectedCoupon.minAmount) {
      return selectedCoupon.discount.toFixed(2);
    }
    return '0.00';
  };

  // Update cart item quantity
  const updateQuantity = async (productId, option, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      if (isAuthenticated) {
        // 已登录用户，通过API更新购物车
        // 查找对应的购物车项ID
        const cartItem = await shoppingCartApi.getShoppingCarts();
        const itemToUpdate = cartItem.find(item => item.product_id === productId && item.option === option);
        
        if (itemToUpdate) {
          await shoppingCartApi.updateShoppingCart({
            id: itemToUpdate.id,
            quantity: newQuantity
          });
          // 重新加载购物车数据
          const updatedCartData = await shoppingCartApi.getShoppingCarts();
          const formattedCart = updatedCartData.map(item => ({
            id: item.product_id,
            name: item.product_name,
            category: item.category_name || '其他',
            price: parseFloat(item.price),
            originalPrice: parseFloat(item.price) * 1.1,
            imageUrl: 'https://picsum.photos/200?random=' + item.product_id,
            quantity: item.quantity,
            stock: item.stock,
            option: item.option || null
          }));
          setCart(formattedCart);
        }
      } else {
        // 未登录用户，更新本地存储
        setCart(prevCart => {
          const updatedCart = prevCart.map(item => {
            if (item.id === productId && item.option === option) {
              // Check if new quantity exceeds stock
              if (newQuantity > item.stock) {
                alert(`库存不足，最多只能购买${item.stock}件`);
                return item;
              }
              return { ...item, quantity: newQuantity };
            }
            return item;
          });
          
          // Save updated cart to localStorage
          localStorage.setItem('userCart', JSON.stringify(updatedCart));
          
          return updatedCart;
        });
      }
    } catch (error) {
      console.error('更新商品数量失败:', error);
      alert('更新商品数量失败，请稍后重试');
    }
  };

  // Remove item from cart
  const removeItem = async (productId, option) => {
    try {
      if (isAuthenticated) {
        // 已登录用户，通过API删除购物车商品
        // 查找对应的购物车项ID
        const cartItem = await shoppingCartApi.getShoppingCarts();
        const itemToRemove = cartItem.find(item => item.product_id === productId && item.option === option);
        
        if (itemToRemove) {
          await shoppingCartApi.deleteFromShoppingCart(itemToRemove.id);
          // 重新加载购物车数据
          const updatedCartData = await shoppingCartApi.getShoppingCarts();
          const formattedCart = updatedCartData.map(item => ({
            id: item.product_id,
            name: item.product_name,
            category: item.category_name || '其他',
            price: parseFloat(item.price),
            originalPrice: parseFloat(item.price) * 1.1,
            imageUrl: 'https://picsum.photos/200?random=' + item.product_id,
            quantity: item.quantity,
            stock: item.stock,
            option: item.option || null
          }));
          setCart(formattedCart);
        }
      } else {
        // 未登录用户，更新本地存储
        setCart(prevCart => {
          const updatedCart = prevCart.filter(item => 
            !(item.id === productId && item.option === option)
          );
          
          // Save updated cart to localStorage
          localStorage.setItem('userCart', JSON.stringify(updatedCart));
          
          return updatedCart;
        });
      }
    } catch (error) {
      console.error('删除商品失败:', error);
      alert('删除商品失败，请稍后重试');
    }
  };

  // Apply coupon
  const applyCoupon = async (coupon) => {
    const subtotal = parseFloat(calculateSubtotal());
    if (subtotal < coupon.minAmount) {
      alert(`订单金额需满${coupon.minAmount}元才能使用此优惠券`);
      return;
    }
    
    try {
      if (isAuthenticated) {
        // 已登录用户，通过API应用优惠券
        // 注意：目前我们的API中没有applyCoupon方法，这里使用注释标记
        // 实际项目中需要根据后端API实现来调整
        // const response = await cartApi.applyCoupon(coupon.code);
        setSelectedCoupon(coupon);
        setDiscountAmount(coupon.discount);
        alert(`优惠券已应用: ${coupon.name}`);
      } else {
        // 未登录用户，在前端处理
        setSelectedCoupon(coupon);
        setDiscountAmount(coupon.discount);
        alert(`优惠券已应用: ${coupon.name}`);
      }
    } catch (error) {
      console.error('应用优惠券失败:', error);
      alert('应用优惠券失败，请稍后重试');
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (window.confirm('确定要清空购物车吗？')) {
      try {
        if (isAuthenticated) {
          // 已登录用户，通过API清空购物车
          // 注意：目前我们的API中没有clearCart方法，这里使用注释标记
          // 实际项目中需要根据后端API实现来调整
          // await cartApi.clearCart();
          // 重新加载购物车数据
          const updatedCartData = await shoppingCartApi.getShoppingCarts();
          const formattedCart = updatedCartData.map(item => ({
            id: item.product_id,
            name: item.product_name,
            category: item.category_name || '其他',
            price: parseFloat(item.price),
            originalPrice: parseFloat(item.price) * 1.1,
            imageUrl: 'https://picsum.photos/200?random=' + item.product_id,
            quantity: item.quantity,
            stock: item.stock,
            option: item.option || null
          }));
          setCart(formattedCart);
        } else {
          // 未登录用户，清空本地存储
          setCart([]);
          localStorage.removeItem('userCart');
        }
      } catch (error) {
        console.error('清空购物车失败:', error);
        alert('清空购物车失败，请稍后重试');
      }
    }
  };

  // Proceed to checkout
  const proceedToCheckout = async () => {
    if (cart.length === 0) {
      alert('购物车为空，无法结算');
      return;
    }
    
    if (!isAuthenticated) {
      // 未登录用户，提示登录
      alert('请先登录再结算');
      navigate('/login');
      return;
    }
    
    try {
      // 已登录用户，准备订单数据
      const orderItems = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        option: item.option,
        unit_price: item.price
      }));
      
      // 保存订单数据到localStorage，然后跳转到结算页面
      localStorage.setItem('orderItems', JSON.stringify(orderItems));
      localStorage.setItem('orderSummary', JSON.stringify({
        subtotal: calculateSubtotal(),
        shippingFee: calculateShippingFee(),
        discountAmount: getDiscountAmount(),
        total: calculateTotal(),
        deliveryMethod: deliveryMethod,
        selectedCoupon: selectedCoupon
      }));
      
      navigate('/checkout');
    } catch (error) {
      console.error('创建订单失败:', error);
      alert('创建订单失败，请稍后重试');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-500">加载购物车中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">购物车</h1>
      
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm">
          <img 
            src="https://picsum.photos/120/120?random=empty" 
            alt="空购物车" 
            className="w-32 h-32 object-contain opacity-50 mb-4"
          />
          <p className="text-gray-500 text-lg mb-6">您的购物车还是空的</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            去购物
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">商品列表</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">商品信息</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">单价</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">数量</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">小计</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <tr key={`${item.id}-${item.option || 'default'}`}>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded-md mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500">类别: {item.category}</div>
                            {item.option && (
                              <div className="text-xs text-gray-500">规格: {item.option}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">¥{item.price.toFixed(2)}</div>
                        {item.originalPrice && (
                          <div className="text-xs text-gray-500 line-through">¥{item.originalPrice.toFixed(2)}</div>
                        )}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button 
                            onClick={() => updateQuantity(item.id, item.option, item.quantity - 1)}
                            className="h-8 w-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <input 
                            type="number" 
                            value={item.quantity} 
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value);
                              if (!isNaN(newQuantity) && newQuantity > 0) {
                                updateQuantity(item.id, item.option, newQuantity);
                              }
                            }}
                            className="h-8 w-12 mx-2 border border-gray-300 rounded text-center"
                            min="1"
                            max={item.stock}
                          />
                          <button 
                            onClick={() => updateQuantity(item.id, item.option, item.quantity + 1)}
                            className="h-8 w-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100"
                            disabled={item.quantity >= item.stock}
                          >
                            +
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">库存: {item.stock}件</div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">¥{(item.price * item.quantity).toFixed(2)}</div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          onClick={() => removeItem(item.id, item.option)}
                          className="text-red-500 hover:text-red-700"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">优惠券</h2>
              {availableCoupons.length > 0 ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">选择优惠券</label>
                    <select 
                      value={selectedCoupon ? selectedCoupon.id : ''}
                      onChange={(e) => {
                        const couponId = parseInt(e.target.value);
                        if (couponId) {
                          applyCoupon(availableCoupons.find(c => c.id === couponId));
                        } else {
                          setSelectedCoupon(null);
                          setDiscountAmount(0);
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">不使用优惠券</option>
                      {availableCoupons.map(coupon => (
                        <option 
                          key={coupon.id} 
                          value={coupon.id}
                          disabled={parseFloat(calculateSubtotal()) < coupon.minAmount}
                        >
                          {coupon.name} {parseFloat(calculateSubtotal()) < coupon.minAmount && '(订单金额不足)'}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedCoupon && (
                    <div className="p-3 bg-blue-50 rounded-md">
                      <div className="text-sm font-medium text-blue-800">已选择: {selectedCoupon.name}</div>
                      <div className="text-xs text-blue-600">折扣金额: ¥{getDiscountAmount()}</div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-gray-500">暂无可用优惠券</div>
              )}
            </div>
            
            <div className="md:w-1/3 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">配送方式</h2>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="deliveryMethod" 
                    value="delivery"
                    checked={deliveryMethod === 'delivery'}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">快递配送</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="deliveryMethod" 
                    value="pickup"
                    checked={deliveryMethod === 'pickup'}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">门店自提</span>
                </label>
              </div>
              {deliveryMethod === 'pickup' && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-700">最近门店: 城市中心店</div>
                  <div className="text-xs text-gray-500">地址: 城市中心商业街123号</div>
                  <div className="text-xs text-gray-500">营业时间: 09:00-21:00</div>
                </div>
              )}
            </div>
            
            <div className="md:w-1/3 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">订单汇总</h2>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>商品小计</span>
                  <span>¥{calculateSubtotal()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>配送费</span>
                  <span>¥{calculateShippingFee().toFixed(2)}</span>
                </div>
                {selectedCoupon && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>优惠券折扣</span>
                    <span>-¥{getDiscountAmount()}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>实付金额</span>
                    <span>¥{calculateTotal()}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={proceedToCheckout}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  去结算
                </button>
                <button 
                  onClick={clearCart}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition"
                >
                  清空购物车
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCartPage;