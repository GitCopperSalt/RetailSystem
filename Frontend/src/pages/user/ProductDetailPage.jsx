import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi, shoppingCartApi } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'reviews', 'shipping'
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('userCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 从后端API获取商品详情
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        // 调用API获取商品详情
        const response = await productApi.getProductById(productId);
        
        // 转换后端数据格式以匹配前端预期的结构
        const productData = {
          id: response.id,
          name: response.name,
          category: '其他', // 目前后端没有分类字段，暂时设为其他
          price: parseFloat(response.price),
          originalPrice: parseFloat(response.price) * 1.1, // 模拟原价，比售价高10%
          stock: response.stock,
          imageUrl: 'https://picsum.photos/500', // 目前后端没有图片字段，使用占位图
          gallery: [
            'https://picsum.photos/500',
            'https://picsum.photos/500',
            'https://picsum.photos/500'
          ],
          description: response.description || '暂无商品描述',
          features: [
            '品质保证',
            '新鲜直达',
            '优质服务',
            '价格优惠',
            '安全放心'
          ],
          specifications: {
            '净含量': '待补充',
            '保质期': '待补充',
            '储存方式': '待补充',
            '产地': '待补充',
            '包装': '待补充'
          },
          sales: Math.floor(Math.random() * 500) + 100, // 随机生成销量
          rating: 4 + Math.random() * 1, // 随机生成评分
          reviewCount: Math.floor(Math.random() * 200) + 50, // 随机生成评论数
          distance: Math.random() * 5, // 随机生成距离
          isNew: false,
          isFeatured: false,
          tags: [response.name.split(' ')[0]], // 简单取商品名第一个词作为标签
          options: [
            { id: 'default', name: '默认规格', price: parseFloat(response.price) }
          ]
        };
        
        setProduct(productData);
        
        // 设置默认选项
        if (productData.options && productData.options.length > 0) {
          setSelectedOption(productData.options[0]);
        }
        
        // 模拟评论数据
        const mockReviews = [
          {
            id: 1,
            userName: '顾客**',
            rating: 5,
            date: '2024-05-15',
            content: '商品质量很好，很满意这次购物体验。',
            images: []
          },
          {
            id: 2,
            userName: '顾客**',
            rating: 4,
            date: '2024-05-12',
            content: '整体还不错，下次还会再来。',
            images: [
              'https://picsum.photos/100',
              'https://picsum.photos/100'
            ]
          },
          {
            id: 3,
            userName: '顾客**',
            rating: 5,
            date: '2024-05-10',
            content: '已经多次购买了，品质一直很稳定。',
            images: []
          }
        ];
        
        setReviews(mockReviews);
      } catch (error) {
        console.error('获取商品详情失败:', error);
        // 发生错误时使用mock数据作为备用
        const mockProduct = {
          id: parseInt(productId),
          name: '商品' + productId,
          category: '其他',
          price: 99.90,
          originalPrice: 109.90,
          stock: 50,
          imageUrl: 'https://picsum.photos/500',
          gallery: [
            'https://picsum.photos/500',
            'https://picsum.photos/500'
          ],
          description: '商品详情加载失败',
          features: ['商品详情加载失败'],
          specifications: {'信息': '加载失败'},
          sales: 100,
          rating: 4.5,
          reviewCount: 50,
          distance: 1.5,
          isNew: false,
          isFeatured: false,
          tags: ['商品'],
          options: [
            { id: 'default', name: '默认规格', price: 99.90 }
          ]
        };
        setProduct(mockProduct);
        setSelectedOption(mockProduct.options[0]);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Handle quantity change
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0 && (!product || newQuantity <= product.stock)) {
      setQuantity(newQuantity);
    }
  };

  // Add to cart function
  const addToCart = async () => {
    if (!product || product.stock === 0) return;

    // Create product item for cart
    const cartItem = {
      ...product,
      quantity: quantity,
      price: selectedOption ? selectedOption.price : product.price,
      option: selectedOption ? selectedOption.name : null
    };

    try {
      if (isAuthenticated) {
        // 已登录用户，通过API添加商品到购物车
        await shoppingCartApi.addToShoppingCart({
          productId: productId,
          quantity: quantity,
          optionId: selectedOption?.id || 'default'
        });
        alert(`${product.name} 已成功加入购物车！`);
      } else {
        // 未登录用户，更新本地存储
        setCart(prevCart => {
          // Check if item with same options already exists in cart
          const existingItemIndex = prevCart.findIndex(item => 
            item.id === product.id && item.option === cartItem.option
          );
          
          let newCart;
          
          if (existingItemIndex >= 0) {
            // If item already in cart, update quantity
            newCart = [...prevCart];
            newCart[existingItemIndex].quantity += quantity;
          } else {
            // Add new item to cart
            newCart = [...prevCart, cartItem];
          }
          
          // Save cart to localStorage
          localStorage.setItem('userCart', JSON.stringify(newCart));
          
          return newCart;
        });
        
        // Show success message
        alert(`${product.name} 已成功加入购物车！`);
      }
    } catch (error) {
      console.error('添加商品到购物车失败:', error);
      alert('添加商品到购物车失败，请稍后重试');
    } finally {
      // Reset quantity
      setQuantity(1);
    }
  };

  // Navigate to cart
  const goToCart = () => {
    navigate('/user/cart');
  };

  // Get current price based on selected option
  const getCurrentPrice = () => {
    if (!product) return 0;
    return selectedOption ? selectedOption.price : product.price;
  };

  // Get total price (current price * quantity)
  const getTotalPrice = () => {
    return (getCurrentPrice() * quantity).toFixed(2);
  };

  // Check if product is out of stock
  const isOutOfStock = () => {
    return product && product.stock === 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">加载商品详情中...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <i className="fa fa-exclamation-triangle text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">商品不存在</h3>
          <p className="text-gray-500 mb-6">您查看的商品可能已下架或不存在</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/user/products')}
          >
            返回商品列表
          </button>
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
                  <a href="/user/products" className="hover:text-primary">
                    商品列表
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="fa fa-chevron-right text-xs mx-2"></i>
                  <span className="text-gray-900 font-medium">{product.name}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-80 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.gallery && product.gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4">
                  {product.gallery.map((image, index) => (
                    <div key={index} className="h-20 overflow-hidden rounded-lg cursor-pointer border-2 border-transparent hover:border-primary">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Category */}
              <div className="text-sm text-gray-500 mb-2">{product.category}</div>
              
              {/* Name */}
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center text-yellow-500 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fa ${i < Math.floor(product.rating) ? 'fa-star' : i < product.rating ? 'fa-star-half-o' : 'fa-star-o'}`}></i>
                  ))}
                </div>
                <span className="text-sm text-gray-700">{product.rating}/5</span>
                <span className="text-xs text-gray-500 mx-2">|</span>
                <span className="text-sm text-gray-700">{product.reviewCount} 条评价</span>
                <span className="text-xs text-gray-500 mx-2">|</span>
                <span className="text-sm text-gray-700">已售 {product.sales} 件</span>
              </div>
              
              {/* Price */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-baseline mb-2">
                  <span className="text-xl font-bold text-danger">¥{getCurrentPrice().toFixed(2)}</span>
                  {product.originalPrice > getCurrentPrice() && (
                    <span className="text-sm text-gray-500 line-through ml-2">¥{product.originalPrice.toFixed(2)}</span>
                  )}
                  {product.originalPrice > getCurrentPrice() && (
                    <span className="text-xs text-white bg-danger px-2 py-0.5 rounded ml-2">
                      {(Math.round((1 - getCurrentPrice() / product.originalPrice) * 100))}折
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  库存: {product.stock} 件
                  {product.stock < 10 && product.stock > 0 && (
                    <span className="text-warning ml-2">库存紧张，欲购从速</span>
                  )}
                </div>
              </div>
              
              {/* Product Options */}
              {product.options && product.options.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">选择规格</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.options.map(option => (
                      <button
                        key={option.id}
                        className={`px-4 py-2 rounded-lg text-sm border transition-colors ${selectedOption && selectedOption.id === option.id ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-700 hover:border-primary hover:text-primary'}`}
                        onClick={() => setSelectedOption(option)}
                      >
                        {option.name} - ¥{option.price.toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">购买数量</h3>
                <div className="flex items-center">
                  <button
                    className="h-10 w-10 rounded-l-lg border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <i className="fa fa-minus"></i>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    min="1"
                    max={product.stock}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0 && value <= product.stock) {
                        setQuantity(value);
                      }
                    }}
                    className="h-10 w-20 border-t border-b border-gray-300 text-center text-gray-900"
                  />
                  <button
                    className="h-10 w-10 rounded-r-lg border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                  <div className="ml-4 text-sm text-gray-500">
                    共 {getTotalPrice()} 元
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className={`btn btn-primary flex-1 py-3 text-lg ${isOutOfStock() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={addToCart}
                  disabled={isOutOfStock()}
                >
                  <i className="fa fa-shopping-cart mr-2"></i>
                  加入购物车
                </button>
                <button
                  className={`btn btn-secondary flex-1 py-3 text-lg ${cart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={goToCart}
                  disabled={cart.length === 0}
                >
                  <i className="fa fa-shopping-bag mr-2"></i>
                  去购物车 ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </button>
              </div>
              
              {/* Delivery Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 text-sm">
                  <div className="flex items-center">
                    <i className="fa fa-truck text-primary mr-2"></i>
                    <span className="text-gray-700">配送至: </span>
                    <span className="text-gray-900 ml-1">北京市朝阳区</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fa fa-clock-o text-primary mr-2"></i>
                    <span className="text-gray-700">预计送达: </span>
                    <span className="text-gray-900 ml-1">今日 16:00-18:00</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fa fa-map-marker text-primary mr-2"></i>
                    <span className="text-gray-700">距离: </span>
                    <span className="text-gray-900 ml-1">{product.distance}km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b">
              <div className="flex">
                <button
                  className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('details')}
                >
                  商品详情
                </button>
                <button
                  className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  商品评价 ({reviews.length})
                </button>
                <button
                  className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'shipping' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('shipping')}
                >
                  配送信息
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'details' && (
                <div>
                  {/* Product Description */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">商品介绍</h3>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {product.description}
                    </div>
                  </div>
                  
                  {/* Product Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">商品特点</h3>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <i className="fa fa-check-circle text-success mt-1 mr-3"></i>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Product Specifications */}
                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">规格参数</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <tbody className="divide-y divide-gray-200">
                            {Object.entries(product.specifications).map(([key, value]) => (
                              <tr key={key}>
                                <td className="px-4 py-3 text-sm text-gray-500 w-1/3">{key}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  {/* Review Summary */}
                  <div className="flex flex-col md:flex-row md:items-center mb-8">
                    <div className="md:w-1/3 text-center mb-4 md:mb-0">
                      <div className="text-4xl font-bold text-gray-900 mb-1">{product.rating.toFixed(1)}</div>
                      <div className="flex items-center justify-center text-yellow-500 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`fa ${i < Math.floor(product.rating) ? 'fa-star' : i < product.rating ? 'fa-star-half-o' : 'fa-star-o'}`}></i>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">共 {product.reviewCount} 条评价</div>
                    </div>
                    <div className="md:w-2/3">
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map(star => {
                          // Mock data for star distribution
                          const distribution = star === 5 ? 65 : star === 4 ? 20 : star === 3 ? 10 : star === 2 ? 3 : 2;
                          return (
                            <div key={star} className="flex items-center">
                              <div className="w-12 text-sm text-gray-700">{star}星</div>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-500" style={{ width: `${distribution}%` }}></div>
                              </div>
                              <div className="w-12 text-sm text-gray-500 text-right">{distribution}%</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {/* Review List */}
                  <div className="space-y-6">
                    {reviews.length > 0 ? (
                      reviews.map(review => (
                        <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-medium">
                              {review.userName.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{review.userName}</div>
                              <div className="flex items-center text-yellow-500 text-xs">
                                {[...Array(5)].map((_, i) => (
                                  <i key={i} className={`fa ${i < review.rating ? 'fa-star' : 'fa-star-o'}`}></i>
                                ))}
                              </div>
                            </div>
                            <div className="ml-auto text-xs text-gray-500">{review.date}</div>
                          </div>
                          <div className="text-sm text-gray-700 mb-3">{review.content}</div>
                          {review.images && review.images.length > 0 && (
                            <div className="flex space-x-2">
                              {review.images.map((image, index) => (
                                <div key={index} className="h-20 w-20 overflow-hidden rounded-md">
                                  <img
                                    src={image}
                                    alt={`Review image ${index + 1}`}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <i className="fa fa-comment-o text-4xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500">暂无评价</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'shipping' && (
                <div>
                  <div className="space-y-6">
                    {/* Delivery Options */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">配送方式</h3>
                      <div className="space-y-4">
                        <div className="flex items-start p-4 border border-gray-200 rounded-lg">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center bg-primary text-white">
                            <i className="fa fa-check text-xs"></i>
                          </div>
                          <div className="ml-3">
                            <h4 className="text-base font-medium text-gray-900">快递配送</h4>
                            <p className="text-sm text-gray-500 mt-1">满39元免配送费，未满收取5元配送费</p>
                            <p className="text-sm text-gray-500 mt-1">预计送达时间：今日 16:00-18:00</p>
                          </div>
                        </div>
                        <div className="flex items-start p-4 border border-gray-200 rounded-lg">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full border border-gray-300"></div>
                          <div className="ml-3">
                            <h4 className="text-base font-medium text-gray-900">门店自提</h4>
                            <p className="text-sm text-gray-500 mt-1">订单完成后可到附近门店自提</p>
                            <p className="text-sm text-gray-500 mt-1">最近门店：旗舰店 (距离1.2km)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Payment Methods */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">支付方式</h3>
                      <div className="space-y-4">
                        <div className="flex items-start p-4 border border-gray-200 rounded-lg">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center bg-primary text-white">
                            <i className="fa fa-check text-xs"></i>
                          </div>
                          <div className="ml-3">
                            <h4 className="text-base font-medium text-gray-900">微信支付</h4>
                            <p className="text-sm text-gray-500 mt-1">使用微信扫码支付，安全便捷</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Return Policy */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">退换货政策</h3>
                      <div className="text-sm text-gray-700 space-y-2">
                        <p>1. 生鲜商品（蔬菜、水果、肉类等）如存在质量问题，请在收到商品后24小时内联系客服申请退换货。</p>
                        <p>2. 非生鲜商品如存在质量问题，请在收到商品后7天内联系客服申请退换货。</p>
                        <p>3. 退换货时请保持商品包装完好，附带有发票或购物凭证。</p>
                        <p>4. 因个人原因（如不喜欢、买错等）申请退换货，需保证商品完好无损，且由买家承担退换货运费。</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">猜你喜欢</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Mock related products */}
            {[1, 2, 3, 4, 5].map((_, index) => {
              // Get a random product from the list, but not the current one
              const randomIndex = Math.floor(Math.random() * 3); // 固定使用3作为随机范围
              const mockProduct = {
                id: randomIndex + 10,
                name: `推荐商品 ${index + 1}`,
                price: 49.90 + Math.floor(Math.random() * 100),
                imageUrl: `https://picsum.photos/300?random=${index + 10}`,
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

export default ProductDetailPage;