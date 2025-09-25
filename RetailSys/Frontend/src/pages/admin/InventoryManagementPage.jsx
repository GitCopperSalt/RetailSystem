import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const InventoryManagementPage = () => {
  const { hasPermission } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [updateAmount, setUpdateAmount] = useState('');
  const [updateType, setUpdateType] = useState('add');
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [replenishmentList, setReplenishmentList] = useState([]);
  const [categories, setCategories] = useState([]);

  // Mock data for products
  useEffect(() => {
    // Simulate API call
    const fetchInventory = async () => {
      setTimeout(() => {
        const mockProducts = [
          {
            id: 1,
            name: '有机蔬菜礼盒',
            category: '蔬菜',
            price: 89.90,
            currentStock: 15,
            lowStockThreshold: 10,
            unit: '盒',
            sku: 'SKU-VEG-001',
            imageUrl: 'https://via.placeholder.com/80',
            lastStockUpdate: '2024-05-18 08:30:12',
            expiryDate: '2024-05-25',
            salesThisWeek: 12,
            reorderPoint: 15,
            supplier: '绿色农场'
          },
          {
            id: 2,
            name: '优质大米 5kg',
            category: '粮油',
            price: 49.90,
            currentStock: 85,
            lowStockThreshold: 20,
            unit: '袋',
            sku: 'SKU-GRA-001',
            imageUrl: 'https://via.placeholder.com/80',
            lastStockUpdate: '2024-05-17 14:20:59',
            expiryDate: '2024-11-30',
            salesThisWeek: 45,
            reorderPoint: 30,
            supplier: '金谷米业'
          },
          {
            id: 3,
            name: '纯牛奶 1L*12',
            category: '乳制品',
            price: 69.90,
            currentStock: 32,
            lowStockThreshold: 15,
            unit: '箱',
            sku: 'SKU-MILK-001',
            imageUrl: 'https://via.placeholder.com/80',
            lastStockUpdate: '2024-05-18 09:15:34',
            expiryDate: '2024-06-20',
            salesThisWeek: 58,
            reorderPoint: 25,
            supplier: '光明乳业'
          },
          {
            id: 4,
            name: '精选苹果 10个装',
            category: '水果',
            price: 39.90,
            currentStock: 8,
            lowStockThreshold: 10,
            unit: '盒',
            sku: 'SKU-FRUIT-001',
            imageUrl: 'https://via.placeholder.com/80',
            lastStockUpdate: '2024-05-18 10:05:47',
            expiryDate: '2024-05-22',
            salesThisWeek: 32,
            reorderPoint: 15,
            supplier: '果园直供'
          },
          {
            id: 5,
            name: '天然矿泉水 500ml*24',
            category: '饮料',
            price: 29.90,
            currentStock: 120,
            lowStockThreshold: 50,
            unit: '箱',
            sku: 'SKU-DRINK-001',
            imageUrl: 'https://via.placeholder.com/80',
            lastStockUpdate: '2024-05-16 16:45:23',
            expiryDate: '2024-12-31',
            salesThisWeek: 28,
            reorderPoint: 60,
            supplier: '农夫山泉'
          },
          {
            id: 6,
            name: '厨房清洁套装',
            category: '日用品',
            price: 59.90,
            currentStock: 45,
            lowStockThreshold: 20,
            unit: '套',
            sku: 'SKU-HOUS-001',
            imageUrl: 'https://via.placeholder.com/80',
            lastStockUpdate: '2024-05-15 11:30:18',
            expiryDate: '2025-03-15',
            salesThisWeek: 15,
            reorderPoint: 25,
            supplier: '清洁用品供应商'
          },
          {
            id: 7,
            name: '休闲饼干礼盒',
            category: '零食',
            price: 49.90,
            currentStock: 68,
            lowStockThreshold: 25,
            unit: '盒',
            sku: 'SKU-SNACK-001',
            imageUrl: 'https://via.placeholder.com/80',
            lastStockUpdate: '2024-05-17 10:20:45',
            expiryDate: '2024-08-30',
            salesThisWeek: 19,
            reorderPoint: 30,
            supplier: '零食批发'
          },
          {
            id: 8,
            name: '特级橄榄油 500ml',
            category: '粮油',
            price: 129.90,
            currentStock: 5,
            lowStockThreshold: 10,
            unit: '瓶',
            sku: 'SKU-OIL-001',
            imageUrl: 'https://via.placeholder.com/80',
            lastStockUpdate: '2024-05-16 15:15:36',
            expiryDate: '2025-01-31',
            salesThisWeek: 22,
            reorderPoint: 15,
            supplier: '进口食品供应商'
          }
        ];

        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
        
        // Extract unique categories
        const uniqueCategories = ['all', ...new Set(mockProducts.map(p => p.category))];
        setCategories(uniqueCategories);
        
        // Generate replenishment list based on reorder points
        const lowStockProducts = mockProducts.filter(p => p.currentStock <= p.reorderPoint);
        setReplenishmentList(lowStockProducts);
        
        setLoading(false);
      }, 800);
    };

    fetchInventory();
  }, []);

  // Filter products based on search term, category, and low stock status
  useEffect(() => {
    let result = [...products];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term) ||
        product.supplier.toLowerCase().includes(term)
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by low stock
    if (showLowStockOnly) {
      result = result.filter(product => product.currentStock <= product.lowStockThreshold);
    }
    
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, showLowStockOnly, products]);

  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get stock status info
  const getStockStatusInfo = (currentStock, lowStockThreshold, expiryDate) => {
    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
    
    if (daysUntilExpiry < 3 && daysUntilExpiry >= 0) {
      return { color: 'bg-red-100 text-red-800', label: '即将过期' };
    }
    if (daysUntilExpiry < 0) {
      return { color: 'bg-black bg-opacity-10 text-gray-800', label: '已过期' };
    }
    if (currentStock <= lowStockThreshold) {
      return { color: 'bg-warning/20 text-warning', label: '库存不足' };
    }
    return { color: 'bg-success/20 text-success', label: '库存充足' };
  };

  // Handle stock update
  const handleStockUpdate = (productId, amount, type) => {
    if (!amount || isNaN(amount) || parseInt(amount) <= 0) {
      alert('请输入有效的数量');
      return;
    }

    const updateQuantity = parseInt(amount);
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        let newStock = type === 'add' 
          ? product.currentStock + updateQuantity 
          : Math.max(0, product.currentStock - updateQuantity);
        
        return {
          ...product,
          currentStock: newStock,
          lastStockUpdate: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
      }
      return product;
    }));

    // Update replenishment list
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        let newStock = type === 'add' 
          ? product.currentStock + updateQuantity 
          : Math.max(0, product.currentStock - updateQuantity);
        
        return {
          ...product,
          currentStock: newStock
        };
      }
      return product;
    });
    
    const lowStockProducts = updatedProducts.filter(p => p.currentStock <= p.reorderPoint);
    setReplenishmentList(lowStockProducts);

    // Close modal
    setIsUpdateModalOpen(false);
    setCurrentProduct(null);
    setUpdateAmount('');
    setUpdateType('add');
  };

  // Handle low stock threshold update
  const handleThresholdUpdate = (productId, newThreshold) => {
    if (isNaN(newThreshold) || parseInt(newThreshold) < 0) {
      alert('请输入有效的库存预警值');
      return;
    }

    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, lowStockThreshold: parseInt(newThreshold) }
        : product
    ));
  };

  // Generate new replenishment list
  const generateReplenishmentList = () => {
    const lowStockProducts = products.filter(p => p.currentStock <= p.reorderPoint);
    setReplenishmentList(lowStockProducts);
    alert(`已生成补货清单，共${lowStockProducts.length}种商品需要补货`);
  };

  // Check if user can manage inventory
  const canManageInventory = hasPermission('manage_inventory') || hasPermission('all');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">加载库存数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">库存管理</h1>
          <p className="text-gray-500 mt-1">实时跟踪商品库存，处理预警和补货</p>
        </div>
        <div className="mt-4 md:mt-0">
          {canManageInventory && (
            <button 
              className="btn btn-primary mr-2"
              onClick={generateReplenishmentList}
            >
              <i className="fa fa-list-ul mr-1"></i>生成补货清单
            </button>
          )}
          {replenishmentList.length > 0 && (
            <button 
              className="btn btn-secondary"
              onClick={() => alert(`补货清单：\n${replenishmentList.map(p => `- ${p.name} (当前库存: ${p.currentStock}, 建议补货: ${p.reorderPoint - p.currentStock + 10})`).join('\n')}`)}
            >
              <i className="fa fa-shopping-cart mr-1"></i>查看补货清单 ({replenishmentList.length})
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="搜索商品名称、SKU或供应商..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            className="input"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? '全部分类' : cat}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-auto flex items-center">
          <input
            type="checkbox"
            id="low-stock-only"
            className="mr-2 h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
            checked={showLowStockOnly}
            onChange={(e) => setShowLowStockOnly(e.target.checked)}
          />
          <label htmlFor="low-stock-only" className="text-sm text-gray-700">仅显示库存预警商品</label>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="bg-gray-50">
                <th>商品信息</th>
                <th>SKU</th>
                <th>类别</th>
                <th>当前库存</th>
                <th>库存状态</th>
                <th>预警阈值</th>
                <th>过期日期</th>
                <th>最后更新</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                    <i className="fa fa-search-minus text-2xl mb-2"></i>
                    <p>没有找到匹配的商品</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const statusInfo = getStockStatusInfo(product.currentStock, product.lowStockThreshold, product.expiryDate);
                  const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);
                  const isLowStock = product.currentStock <= product.lowStockThreshold;
                  const isNearExpiry = daysUntilExpiry >= 0 && daysUntilExpiry < 3;
                  const isExpired = daysUntilExpiry < 0;
                  
                  return (
                    <tr 
                      key={product.id} 
                      className={`hover:bg-gray-50 ${(isLowStock || isNearExpiry || isExpired) ? 'bg-yellow-50' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              src={product.imageUrl} 
                              alt={product.name} 
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{product.supplier}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{product.sku}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.currentStock} {product.unit}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        {isNearExpiry && (
                          <div className="text-xs text-red-600 mt-1">仅余{daysUntilExpiry}天过期</div>
                        )}
                        {isExpired && (
                          <div className="text-xs text-gray-600 mt-1">已过期{Math.abs(daysUntilExpiry)}天</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {canManageInventory ? (
                          <div className="flex items-center">
                            <input
                              type="number"
                              className="input w-16"
                              value={product.lowStockThreshold}
                              onChange={(e) => handleThresholdUpdate(product.id, e.target.value)}
                            />
                            <span className="ml-2 text-sm text-gray-500">{product.unit}</span>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-900">
                            {product.lowStockThreshold} {product.unit}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{product.expiryDate}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{product.lastStockUpdate}</div>
                      </td>
                      <td className="px-6 py-4">
                        {canManageInventory && (
                          <button 
                            className="btn btn-primary text-sm"
                            onClick={() => {
                              setCurrentProduct(product);
                              setIsUpdateModalOpen(true);
                            }}
                          >
                            调整库存
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Update Modal */}
      {isUpdateModalOpen && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">调整库存 - {currentProduct.name}</h3>
              <button 
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => {
                  setIsUpdateModalOpen(false);
                  setCurrentProduct(null);
                  setUpdateAmount('');
                  setUpdateType('add');
                }}
              >
                <i className="fa fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">当前库存</span>
                  <span className="text-base font-medium text-gray-900">{currentProduct.currentStock} {currentProduct.unit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${currentProduct.currentStock > currentProduct.lowStockThreshold ? 'bg-success' : 'bg-warning'}`}
                    style={{ width: `${Math.min(100, (currentProduct.currentStock / (currentProduct.lowStockThreshold * 3)) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>预警: {currentProduct.lowStockThreshold}</span>
                  <span>充足</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  调整类型
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="update-type"
                      value="add"
                      checked={updateType === 'add'}
                      onChange={() => setUpdateType('add')}
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">入库</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="update-type"
                      value="remove"
                      checked={updateType === 'remove'}
                      onChange={() => setUpdateType('remove')}
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">出库</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label 
                  htmlFor="update-amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {updateType === 'add' ? '入库数量' : '出库数量'}
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    id="update-amount"
                    className="input"
                    value={updateAmount}
                    onChange={(e) => setUpdateAmount(e.target.value)}
                    placeholder="请输入数量"
                    min="1"
                  />
                  <span className="ml-2 text-sm text-gray-500">{currentProduct.unit}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsUpdateModalOpen(false);
                    setCurrentProduct(null);
                    setUpdateAmount('');
                    setUpdateType('add');
                  }}
                >
                  取消
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleStockUpdate(currentProduct.id, updateAmount, updateType)}
                >
                  确认{updateType === 'add' ? '入库' : '出库'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">总商品数</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{products.length}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <i className="fa fa-box text-primary text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">库存预警商品</p>
              <h3 className="text-2xl font-bold text-warning mt-1">
                {products.filter(p => p.currentStock <= p.lowStockThreshold).length}
              </h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <i className="fa fa-exclamation-triangle text-warning text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">即将过期商品</p>
              <h3 className="text-2xl font-bold text-danger mt-1">
                {products.filter(p => getDaysUntilExpiry(p.expiryDate) >= 0 && getDaysUntilExpiry(p.expiryDate) < 3).length}
              </h3>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <i className="fa fa-calendar-times text-danger text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagementPage;