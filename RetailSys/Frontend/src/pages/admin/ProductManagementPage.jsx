import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productApi, categoryApi } from '../../services/apiService';

const ProductManagementPage = () => {
  const { hasPermission } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    inventory: 0,
    categoryId: '',
    origin: '',
    description: '',
    imageUrl: ''
  });

  // 从后端API获取商品和分类数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 并行获取商品和分类数据
        const [productsResponse, categoriesResponse] = await Promise.all([
          productApi.getProducts(0, 100), // 获取所有商品，限制为100条
          categoryApi.getCategories()      // 获取所有分类
        ]);
        
        // 转换后端商品数据格式以匹配前端预期的结构
        // 注意：axios实现已直接返回数据
        const productsData = productsResponse.map(item => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          inventory: item.stock,
          categoryId: item.category_id || null,
          origin: item.origin || '未知产地',
          description: item.description || '',
          imageUrl: item.image_url || 'https://picsum.photos/100',
          createdAt: item.create_time || new Date().toISOString().split('T')[0]
        }));
        
        // 使用API返回的分类数据
        // 注意：axios实现已直接返回数据
        const categoriesData = categoriesResponse || [];
        
        setCategories(categoriesData);
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('获取数据失败:', error);
        // 发生错误时使用mock数据作为备用
        const mockProducts = [
          { id: 1, name: '有机蔬菜礼盒', price: 89.90, inventory: 45, categoryId: 1, origin: '本地农场', description: '精选多种有机蔬菜，新鲜健康', imageUrl: 'https://picsum.photos/100', createdAt: '2024-05-01' },
          { id: 2, name: '优质大米 5kg', price: 49.90, inventory: 120, categoryId: 3, origin: '东北五常', description: '优质五常大米，口感软糯', imageUrl: 'https://picsum.photos/100', createdAt: '2024-04-28' }
        ];
        const mockCategories = [
          { id: 1, name: '生鲜食品' },
          { id: 2, name: '日用品' },
          { id: 3, name: '粮油调味' },
          { id: 4, name: '休闲零食' },
          { id: 5, name: '其他' }
        ];
        setCategories(mockCategories);
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on search term and category
  useEffect(() => {
    let result = [...products];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.categoryId === parseInt(selectedCategory));
    }
    
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '未分类';
  };

  // Handle add product form change
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'inventory' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle add product submission
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (!newProduct.name || newProduct.price <= 0 || newProduct.inventory < 0 || !newProduct.categoryId) {
      alert('请填写完整的商品信息');
      return;
    }

    setLoading(true);
    try {
      // 准备提交给后端的数据格式
      const productData = {
        name: newProduct.name,
        price: newProduct.price,
        stock: newProduct.inventory,
        description: newProduct.description || '',
        categoryId: newProduct.categoryId
      };
      
      // 调用API添加商品
      const response = await productApi.createProduct(productData);
      
      // 刷新商品列表
      const productsResponse = await productApi.getProducts(0, 100);
      const productsData = productsResponse.items.map(item => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        inventory: item.stock,
        categoryId: item.category_id || '',
        origin: '未知产地',
        description: item.description || '',
        imageUrl: 'https://picsum.photos/100',
        createdAt: item.create_time || new Date().toISOString().split('T')[0]
      }));
      
      setProducts(productsData);
      setFilteredProducts(productsData);
      setIsAddModalOpen(false);
      
      // Reset form
      setNewProduct({
        name: '',
        price: 0,
        inventory: 0,
        categoryId: '',
        origin: '',
        description: '',
        imageUrl: ''
      });
    } catch (error) {
      console.error('添加商品失败:', error);
      alert('商品添加失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setCurrentProduct({ ...product });
    setIsEditModalOpen(true);
  };

  // Handle edit product form change
  const handleCurrentProductChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'inventory' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle save edited product
  const handleSaveEditProduct = async (e) => {
    e.preventDefault();
    
    if (!currentProduct.name || currentProduct.price <= 0 || currentProduct.inventory < 0 || !currentProduct.categoryId) {
      alert('请填写完整的商品信息');
      return;
    }

    setLoading(true);
    try {
      // 准备提交给后端的数据格式
      const productData = {
        name: currentProduct.name,
        price: currentProduct.price,
        stock: currentProduct.inventory,
        description: currentProduct.description || '',
        categoryId: currentProduct.categoryId
      };
      
      // 调用API更新商品
      const response = await productApi.updateProduct(currentProduct.id, productData);
      
      // 刷新商品列表
      const productsResponse = await productApi.getProducts(0, 100);
      const productsData = productsResponse.items.map(item => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        inventory: item.stock,
        categoryId: item.category_id || '',
        origin: '未知产地',
        description: item.description || '',
        imageUrl: 'https://picsum.photos/100',
        createdAt: item.create_time || new Date().toISOString().split('T')[0]
      }));
      
      setProducts(productsData);
      setFilteredProducts(productsData);
      setIsEditModalOpen(false);
      setCurrentProduct(null);
    } catch (error) {
      console.error('更新商品失败:', error);
      alert('商品更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('确定要删除这个商品吗？')) {
      setLoading(true);
      try {
        // 调用API删除商品
        await productApi.deleteProduct(productId);
        
        // 刷新商品列表
      const productsResponse = await productApi.getProducts(0, 100);
      const productsData = productsResponse.items.map(item => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        inventory: item.stock,
        categoryId: item.category_id || '',
        origin: '未知产地',
        description: item.description || '',
        imageUrl: 'https://via.placeholder.com/100',
        createdAt: item.create_time || new Date().toISOString().split('T')[0]
      }));
        
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('删除商品失败:', error);
        alert('商品删除失败，请重试');
      } finally {
        setLoading(false);
      }
    }
  };

  // Check if user can manage products
  const canManageProducts = hasPermission('manage_products') || hasPermission('all');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">加载商品数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">商品管理</h1>
          <p className="text-gray-500 mt-1">管理店铺的所有商品信息</p>
        </div>
        {canManageProducts && (
          <button 
            className="btn btn-primary mt-4 md:mt-0"
            onClick={() => setIsAddModalOpen(true)}
          >
            <i className="fa fa-plus mr-2"></i>
            添加商品
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="搜索商品名称或描述..."
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
            <option value="all">全部分类</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="bg-gray-50">
                <th>商品图片</th>
                <th>商品名称</th>
                <th>分类</th>
                <th>价格</th>
                <th>库存</th>
                <th>产地</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    <i className="fa fa-search-minus text-2xl mb-2"></i>
                    <p>没有找到匹配的商品</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2 max-w-xs">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{getCategoryName(product.categoryId)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">¥{product.price.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${product.inventory < 10 ? 'text-danger font-medium' : 'text-gray-500'}`}>
                        {product.inventory}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{product.origin}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{product.createdAt}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {canManageProducts && (
                          <button 
                            className="text-primary hover:text-primary/80 text-sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            编辑
                          </button>
                        )}
                        {canManageProducts && (
                          <button 
                            className="text-danger hover:text-danger/80 text-sm"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            删除
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">添加新商品</h3>
              <button 
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setIsAddModalOpen(false)}
              >
                <i className="fa fa-times text-xl"></i>
              </button>
            </div>
            <form className="p-6" onSubmit={handleAddProduct}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    商品名称 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="input"
                    value={newProduct.name}
                    onChange={handleNewProductChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    商品价格 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    min="0"
                    className="input"
                    value={newProduct.price}
                    onChange={handleNewProductChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="inventory" className="block text-sm font-medium text-gray-700 mb-1">
                    库存量 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="inventory"
                    name="inventory"
                    min="0"
                    className="input"
                    value={newProduct.inventory}
                    onChange={handleNewProductChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    商品分类 <span className="text-danger">*</span>
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    className="input"
                    value={newProduct.categoryId}
                    onChange={handleNewProductChange}
                    required
                  >
                    <option value="">请选择分类</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
                    产地
                  </label>
                  <input
                    type="text"
                    id="origin"
                    name="origin"
                    className="input"
                    value={newProduct.origin}
                    onChange={handleNewProductChange}
                  />
                </div>
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    商品图片 URL
                  </label>
                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    className="input"
                    value={newProduct.imageUrl}
                    onChange={handleNewProductChange}
                    placeholder="https://"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  商品描述
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  className="input resize-none"
                  value={newProduct.description}
                  onChange={handleNewProductChange}
                ></textarea>
              </div>
              <div className="mt-8 flex justify-end space-x-3">
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  保存商品
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">编辑商品</h3>
              <button 
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setIsEditModalOpen(false)}
              >
                <i className="fa fa-times text-xl"></i>
              </button>
            </div>
            <form className="p-6" onSubmit={handleSaveEditProduct}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-1">
                    商品名称 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="editName"
                    name="name"
                    className="input"
                    value={currentProduct.name}
                    onChange={handleCurrentProductChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    商品价格 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="editPrice"
                    name="price"
                    step="0.01"
                    min="0"
                    className="input"
                    value={currentProduct.price}
                    onChange={handleCurrentProductChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editInventory" className="block text-sm font-medium text-gray-700 mb-1">
                    库存量 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="editInventory"
                    name="inventory"
                    min="0"
                    className="input"
                    value={currentProduct.inventory}
                    onChange={handleCurrentProductChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editCategoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    商品分类 <span className="text-danger">*</span>
                  </label>
                  <select
                    id="editCategoryId"
                    name="categoryId"
                    className="input"
                    value={currentProduct.categoryId}
                    onChange={handleCurrentProductChange}
                    required
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="editOrigin" className="block text-sm font-medium text-gray-700 mb-1">
                    产地
                  </label>
                  <input
                    type="text"
                    id="editOrigin"
                    name="origin"
                    className="input"
                    value={currentProduct.origin}
                    onChange={handleCurrentProductChange}
                  />
                </div>
                <div>
                  <label htmlFor="editImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    商品图片 URL
                  </label>
                  <input
                    type="text"
                    id="editImageUrl"
                    name="imageUrl"
                    className="input"
                    value={currentProduct.imageUrl}
                    onChange={handleCurrentProductChange}
                    placeholder="https://"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  商品描述
                </label>
                <textarea
                  id="editDescription"
                  name="description"
                  rows="4"
                  className="input resize-none"
                  value={currentProduct.description}
                  onChange={handleCurrentProductChange}
                ></textarea>
              </div>
              <div className="mt-8 flex justify-end space-x-3">
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  更新商品
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagementPage;