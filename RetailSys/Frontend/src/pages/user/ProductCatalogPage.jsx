import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import productsApi from '../../apis/productsApi';

const ProductCatalogPage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState(['全部']);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('recommended');
  const [showDistanceFilter, setShowDistanceFilter] = useState(false);
  const [maxDistance, setMaxDistance] = useState(5); // km
  const [loading, setLoading] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const scrollToTopRef = useRef(null);
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('userCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 从后端API获取商品列表
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // 调用API获取商品列表
        const productsData = await productsApi.getProducts(0, 100); // 新API直接返回数据
        
        // 转换后端数据格式以匹配前端预期的结构
        const transformedProducts = productsData.map(item => ({
          id: item.id,
          name: item.name,
          category: '其他', // 目前后端没有分类字段，暂时设为其他
          price: parseFloat(item.price),
          originalPrice: parseFloat(item.price) * 1.1, // 模拟原价，比售价高10%
          stock: item.stock,
          imageUrl: 'https://picsum.photos/300', // 目前后端没有图片字段，使用占位图
          description: item.description || '暂无商品描述',
          sales: Math.floor(Math.random() * 500) + 100, // 随机生成销量
          rating: 4 + Math.random() * 1, // 随机生成评分
          reviewCount: Math.floor(Math.random() * 200) + 50, // 随机生成评论数
          distance: Math.random() * 5, // 随机生成距离
          isNew: Math.random() > 0.8, // 20%的概率为新品
          isFeatured: Math.random() > 0.7, // 30%的概率为推荐商品
          tags: [item.name.split(' ')[0]] // 简单取商品名第一个词作为标签
        }));
        
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
        
        // 提取唯一分类（由于后端没有分类字段，这里先只显示'全部'）
        setCategories(['全部']);
      } catch (error) {
        console.error('获取商品列表失败:', error);
        // 发生错误时使用mock数据作为备用
        const mockProducts = [
          {
            id: 1,
            name: '有机蔬菜礼盒',
            category: '蔬菜',
            price: 89.90,
            originalPrice: 99.90,
            stock: 15,
            imageUrl: 'https://picsum.photos/300',
            description: '精选有机蔬菜，健康无农药',
            sales: 328,
            rating: 4.8,
            reviewCount: 125,
            distance: 1.2,
            isNew: false,
            isFeatured: true,
            tags: ['有机', '健康']
          },
          {
            id: 2,
            name: '优质大米 5kg',
            category: '粮油',
            price: 49.90,
            originalPrice: 59.90,
            stock: 85,
            imageUrl: 'https://picsum.photos/300',
            description: '优质东北大米，颗粒饱满',
            sales: 542,
            rating: 4.6,
            reviewCount: 203,
            distance: 2.5,
            isNew: false,
            isFeatured: true,
            tags: ['大米', '优质']
          }
        ];
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
        setCategories(['全部', ...new Set(mockProducts.map(p => p.category))]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (selectedCategory !== '全部') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Filter by distance (if enabled)
    if (showDistanceFilter) {
      result = result.filter(product => product.distance <= maxDistance);
    }
    
    // Sort products
    switch (sortOption) {
      case 'price_low_to_high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high_to_low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'sales':
        result.sort((a, b) => b.sales - a.sales);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        result.sort((a, b) => a.distance - b.distance);
        break;
      case 'recommended':
      default:
        // Featured first, then new, then sales
        result.sort((a, b) => {
          if (a.isFeatured !== b.isFeatured) return b.isFeatured - a.isFeatured;
          if (a.isNew !== b.isNew) return b.isNew - a.isNew;
          return b.sales - a.sales;
        });
        break;
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchTerm, sortOption, showDistanceFilter, maxDistance]);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add to cart function
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      let newCart;
      
      if (existingItem) {
        // If item already in cart, increase quantity
        newCart = prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item to cart
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }
      
      // Save cart to localStorage
      localStorage.setItem('userCart', JSON.stringify(newCart));
      
      return newCart;
    });
    
    // Show success message
    alert(`${product.name} 已成功加入购物车！`);
  };

  // Navigate to product detail
  const viewProductDetail = (productId) => {
    navigate(`/user/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">加载商品中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="搜索商品、品牌或类别..."
              className="input w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Category Filters */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 min-w-max pb-2">
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${selectedCategory === category ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Sort and Filter Options */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <div className="text-lg font-medium text-gray-900">
            {filteredProducts.length} 个商品
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                className="input"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="recommended">推荐排序</option>
                <option value="sales">销量优先</option>
                <option value="rating">评分优先</option>
                <option value="price_low_to_high">价格从低到高</option>
                <option value="price_high_to_low">价格从高到低</option>
                <option value="distance">距离优先</option>
              </select>
            </div>
            
            {/* Distance Filter */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="distance-filter"
                className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                checked={showDistanceFilter}
                onChange={(e) => setShowDistanceFilter(e.target.checked)}
              />
              <label htmlFor="distance-filter" className="text-sm text-gray-700 whitespace-nowrap">
                距离筛选 ({maxDistance}km以内)
              </label>
              {showDistanceFilter && (
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <i className="fa fa-search-minus text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">未找到匹配的商品</h3>
            <p className="text-gray-500 mb-6">尝试使用不同的搜索词或筛选条件</p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('全部');
                setSortOption('recommended');
                setShowDistanceFilter(false);
              }}
            >
              清除所有筛选
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                  {/* Product Tags */}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {product.isNew && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">新品</span>
                    )}
                    {product.isFeatured && (
                      <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded">热卖</span>
                    )}
                    {product.stock < 10 && product.stock > 0 && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">仅剩{product.stock}件</span>
                    )}
                    {product.stock === 0 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">已售罄</span>
                    )}
                  </div>
                  {/* Distance */}
                  {showDistanceFilter && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center">
                      <i className="fa fa-map-marker mr-1"></i> {product.distance}km
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  {/* Category */}
                  <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                  
                  {/* Name */}
                  <h3 
                    className="text-base font-medium text-gray-900 mb-2 line-clamp-2 h-12 flex items-center cursor-pointer hover:text-primary"
                    onClick={() => viewProductDetail(product.id)}
                  >
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center text-yellow-500 mb-2">
                    <i className="fa fa-star"></i>
                    <span className="ml-1 text-sm text-gray-700">{product.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-lg font-bold text-danger">¥{product.price.toFixed(2)}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through ml-2">¥{product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">已售{product.sales}</div>
                  </div>
                  
                  {/* Action Button */}
                  <button
                    className={`btn w-full ${product.stock > 0 ? 'btn-primary' : 'btn-secondary cursor-not-allowed'}`}
                    onClick={() => product.stock > 0 && addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? (
                      <>
                        <i className="fa fa-shopping-cart mr-1"></i>
                        加入购物车
                      </>
                    ) : (
                      '已售罄'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          ref={scrollToTopRef}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 focus:outline-none"
          aria-label="Scroll to top"
        >
          <i className="fa fa-arrow-up"></i>
        </button>
      )}
    </div>
  );
};

export default ProductCatalogPage;