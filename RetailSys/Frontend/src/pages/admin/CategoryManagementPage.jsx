import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// 自定义message函数替代antd的message
const message = {
  success: (text) => console.log('Success:', text),
  error: (text) => console.error('Error:', text),
  warning: (text) => console.warn('Warning:', text),
};
import categoriesApi from '../../apis/categoriesApi';

const CategoryManagementPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasPermission } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParent, setSelectedParent] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  // Form states
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    parentId: '',
    icon: '',
    isActive: true,
    sortOrder: 0
  });
  const [errors, setErrors] = useState({});

  // Available icons for categories
  const availableIcons = [
    'fa-shopping-basket', 'fa-apple-alt', 'fa-wine-glass-alt', 'fa-utensils',
    'fa-bread-slice', 'fa-drumstick-bite', 'fa-fish', 'fa-cheese',
    'fa-coffee', 'fa-leaf', 'fa-wine-bottle', 'fa-hamburger',
    'fa-egg', 'fa-carrot', 'fa-birthday-cake', 'fa-mug-hot',
    'fa-wheat-awn', 'fa-pepper-hot', 'fa-apple-whole', 'fa-kiwi-bird',
    'fa-ice-cream', 'fa-drumstick-bite', 'fa-bacon', 'fa-cookie'
  ];



  // Load categories
  useEffect(() => {
    if (!isAuthenticated || !hasPermission('product_create') || !hasPermission('product_edit')) {
      navigate('/login');
      return;
    }

    fetchCategories();
  }, [isAuthenticated, hasPermission, navigate]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoryFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate category form
  const validateCategoryForm = () => {
    const newErrors = {};
    
    if (!categoryFormData.name.trim()) {
      newErrors.name = '请输入分类名称';
    } else {
      // Check if category name already exists (except when editing)
      const nameExists = categories.some(category => 
        category.name === categoryFormData.name && 
        category.id !== editingCategory?.id &&
        category.parentId === categoryFormData.parentId
      );
      if (nameExists) {
        newErrors.name = '该分类名称已存在于同级分类中';
      }
    }
    
    if (categoryFormData.description.trim().length > 200) {
      newErrors.description = '分类描述不能超过200个字符';
    }
    
    // Check if parentId is valid and not a child of this category (to prevent circular references)
    if (categoryFormData.parentId && editingCategory) {
      // Check if parent is this category itself
      if (categoryFormData.parentId === editingCategory.id) {
        newErrors.parentId = '分类不能将自身作为父分类';
      }
      
      // Check if parent is a child of this category
      const isDescendant = isCategoryDescendant(categoryFormData.parentId, editingCategory.id);
      if (isDescendant) {
        newErrors.parentId = '分类不能将其子分类作为父分类';
      }
    }
    
    if (categoryFormData.sortOrder < 0) {
      newErrors.sortOrder = '排序序号不能为负数';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to check if a category is a descendant of another
  const isCategoryDescendant = (childId, parentId) => {
    const childCategory = categories.find(c => c.id === childId);
    if (!childCategory) return false;
    
    if (childCategory.parentId === parentId) return true;
    if (!childCategory.parentId) return false;
    
    return isCategoryDescendant(childCategory.parentId, parentId);
  };

  // Handle add category
  const handleAddCategory = async () => {
    if (validateCategoryForm()) {
      try {
        // 准备API请求数据
        const categoryData = {
          name: categoryFormData.name,
          description: categoryFormData.description,
          parent_id: categoryFormData.parentId || null,
          status: categoryFormData.isActive ? 1 : 0,
          sort_order: categoryFormData.sortOrder
        };
        
        // 调用API创建分类
        await categoriesApi.createCategory(categoryData);
        
        // 重新获取分类列表
        await fetchCategories();
        
        // 重置表单并关闭模态框
        resetCategoryForm();
      } catch (error) {
        console.error('创建分类失败:', error);
      }
    }
  };

  // Handle edit category
  const handleEditCategory = async () => {
    if (validateCategoryForm() && editingCategory) {
      try {
        // 准备API请求数据
        const categoryData = {
          id: editingCategory.id,
          name: categoryFormData.name,
          description: categoryFormData.description,
          parent_id: categoryFormData.parentId || null,
          status: categoryFormData.isActive ? 1 : 0,
          sort_order: categoryFormData.sortOrder
        };
        
        // 调用API更新分类
        await categoriesApi.updateCategory(categoryData);
        
        // 重新获取分类列表
        await fetchCategories();
        
        // 重置表单并关闭模态框
        resetCategoryForm();
      } catch (error) {
        console.error('更新分类失败:', error);
      }
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (categoryId) => {
    try {
      // 调用API删除分类
      await categoriesApi.deleteCategory(categoryId);
      
      // 重新获取分类列表
      await fetchCategories();
      
      // 关闭确认对话框
      setShowDeleteConfirm(null);
      
      // 从展开集合中移除（如果有）
      if (expandedCategories.has(categoryId)) {
        const newExpanded = new Set(expandedCategories);
        newExpanded.delete(categoryId);
        setExpandedCategories(newExpanded);
      }
    } catch (error) {
      console.error('删除分类失败:', error);
      // API会处理子分类和关联商品的检查，这里显示错误消息
      alert(error.message || '删除分类失败，请检查是否有子分类或关联商品。');
      setShowDeleteConfirm(null);
    }
  };

  // Toggle category active status
  const handleToggleCategoryStatus = async (categoryId) => {
    try {
      const category = categories.find(c => c.id === categoryId);
      if (!category) {
        message.error('分类不存在');
        return;
      }
      
      // Update category status
      await categoriesApi.updateCategory({
        id: categoryId,
        status: !category.isActive ? 1 : 0
      });
      
      // Refresh category list
      await fetchCategories();
      
      // Show success message
      message.success(`分类已${!category.isActive ? '启用' : '禁用'}`);
    } catch (error) {
      console.error('更新分类状态失败:', error);
      message.error('操作失败，请重试。');
    }
  };

  // 从API获取分类数据
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const systemCategories = await categoriesApi.getCategories();
      
      // 确保数据结构正确
      if (!Array.isArray(systemCategories)) {
        console.warn('API返回的数据格式不正确，使用模拟数据');
        throw new Error('数据格式错误');
      }
      
      // 将API返回的状态码转换为布尔值，并添加必要的字段
      const processedCategories = systemCategories.map(category => ({
        id: category.id || 0,
        name: category.name || '',
        description: category.description || '',
        isActive: category.status === 1, // 假设API返回1表示启用，0表示禁用
        parentId: category.parent_id || null,
        sortOrder: category.sort_order || 0,
        icon: category.icon || ''
      }));
      
      // 过滤掉无效数据
      const validCategories = processedCategories.filter(cat => cat.id > 0 && cat.name.trim());
      
      // Sort categories by sortOrder
      validCategories.sort((a, b) => a.sortOrder - b.sortOrder);
      setCategories(validCategories);
    } catch (error) {
      console.error('获取分类失败:', error);
      // 如果API调用失败，可以使用一些基本的模拟数据
      const mockCategories = [
        { id: 1, name: '水果', description: '各类新鲜水果', parentId: null, isActive: true, sortOrder: 1, icon: 'fa-apple-whole' },
        { id: 2, name: '蔬菜', description: '各类新鲜蔬菜', parentId: null, isActive: true, sortOrder: 2, icon: 'fa-carrot' },
        { id: 3, name: '零食', description: '各种休闲零食', parentId: null, isActive: true, sortOrder: 3, icon: 'fa-cookie' },
        { id: 4, name: '热带水果', description: '来自热带的水果', parentId: 1, isActive: true, sortOrder: 1, icon: 'fa-kiwi-bird' },
        { id: 5, name: '叶菜类', description: '各种绿叶蔬菜', parentId: 2, isActive: true, sortOrder: 1, icon: 'fa-leaf' }
      ];
      setCategories(mockCategories);
    } finally {
      setLoading(false);
    }
  };

  // Reset category form and modal states
  const resetCategoryForm = () => {
    setCategoryFormData({
      name: '',
      description: '',
      parentId: '',
      icon: '',
      isActive: true,
      sortOrder: 0
    });
    setErrors({});
    setEditingCategory(null);
    setShowAddCategoryModal(false);
  };

  // Open add category modal
  const openAddCategoryModal = () => {
    resetCategoryForm();
    setShowAddCategoryModal(true);
  };

  // Open edit category modal
  const openEditCategoryModal = (category) => {
    setCategoryFormData({
      name: category.name,
      description: category.description,
      parentId: category.parentId,
      icon: category.icon,
      isActive: category.isActive,
      sortOrder: category.sortOrder
    });
    setEditingCategory(category);
    setShowAddCategoryModal(true);
  };

  // Handle expand/collapse category
  const handleToggleExpand = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Filter categories based on search query and selected parent
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          category.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesParent = !selectedParent || category.parentId === selectedParent;
    return matchesSearch && matchesParent;
  });

  // Render category tree structure
  const renderCategoryTree = (parentId = '', level = 0) => {
    const subcategories = filteredCategories.filter(category => category.parentId === parentId);
    
    if (subcategories.length === 0) return null;
    
    return (
      <ul className="mb-0">
        {subcategories.map(category => {
          const hasChildren = categories.some(c => c.parentId === category.id);
          return (
            <li key={category.id} className="mb-0">
              <div className="py-3 border-b border-gray-100">
                <div className="flex items-center">
                  {/* Expand/Collapse icon */}
                  {hasChildren && (
                    <button
                      className="mr-2 text-gray-500 hover:text-primary focus:outline-none"
                      onClick={() => handleToggleExpand(category.id)}
                    >
                      <i className={`fa ${expandedCategories.has(category.id) ? 'fa-chevron-down' : 'fa-chevron-right'} text-xs`}></i>
                    </button>
                  )}
                  {!hasChildren && (
                    <span className="mr-2 w-4"></span>
                  )}
                  
                  {/* Category name and icon */}
                  <div className={`flex items-center flex-1 ${level > 0 ? 'pl-4' : ''}`}>
                    {category.icon && (
                      <i className={`fa ${category.icon} text-primary mr-3`}></i>
                    )}
                    <div className="font-medium text-gray-900">{category.name}</div>
                    {!category.isActive && (
                      <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        已禁用
                      </span>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    <button
                      className="text-gray-500 hover:text-primary"
                      onClick={() => openEditCategoryModal(category)}
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                    <button
                      className="text-gray-500 hover:text-danger"
                      onClick={() => setShowDeleteConfirm(category.id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                    <button
                      className={`px-2 py-1 text-xs font-medium rounded ${category.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                      onClick={() => handleToggleCategoryStatus(category.id)}
                    >
                      {category.isActive ? '禁用' : '启用'}
                    </button>
                  </div>
                </div>
                
                {/* Category description */}
                {(category.description || level === 0) && (
                  <div className={`mt-1 text-sm text-gray-500 ${level > 0 ? 'pl-4' : ''}`}>
                    {category.description || '暂无描述'}
                  </div>
                )}
              </div>
              
              {/* Subcategories */}
              {expandedCategories.has(category.id) && (
                <div className="border-l-2 border-gray-100 ml-2">
                  {renderCategoryTree(category.id, level + 1)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  // Get all parent categories (categories without parentId)
  const parentCategories = categories.filter(category => !category.parentId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">加载分类数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">商品分类管理</h1>
          <p className="text-gray-500 mt-1">管理商品分类层级和详细信息</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={openAddCategoryModal}
        >
          <i className="fa fa-plus mr-2"></i>
          添加分类
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">搜索分类</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fa fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="输入分类名称或描述进行搜索"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">按父分类筛选</label>
            <select
              value={selectedParent}
              onChange={(e) => setSelectedParent(e.target.value)}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">所有分类</option>
              <option value="">无父分类</option>
              {parentCategories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Tree */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        {filteredCategories.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {renderCategoryTree()}
          </div>
        ) : (
          <div className="p-10 text-center">
            <i className="fa fa-folder-open text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">
              {searchQuery || selectedParent 
                ? '没有找到匹配的分类' 
                : '暂无分类数据，请添加新分类'}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingCategory ? '编辑分类' : '添加新分类'}
                </h3>
                <button 
                  className="text-gray-400 hover:text-gray-500"
                  onClick={resetCategoryForm}
                >
                  <i className="fa fa-times text-lg"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form>
                {/* Category Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分类名称
                    <span className="text-danger ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={categoryFormData.name}
                    onChange={handleInputChange}
                    placeholder="请输入分类名称"
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.name ? 'border-danger' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-danger">{errors.name}</p>}
                </div>
                
                {/* Category Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分类描述
                  </label>
                  <textarea
                    name="description"
                    value={categoryFormData.description}
                    onChange={handleInputChange}
                    placeholder="请输入分类描述信息"
                    rows={3}
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none ${errors.description ? 'border-danger' : 'border-gray-300'}`}
                  />
                  {errors.description && <p className="mt-1 text-sm text-danger">{errors.description}</p>}
                </div>
                
                {/* Parent Category */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    父分类
                  </label>
                  <select
                    name="parentId"
                    value={categoryFormData.parentId}
                    onChange={handleInputChange}
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.parentId ? 'border-danger' : 'border-gray-300'}`}
                  >
                    <option value="">无父分类（顶级分类）</option>
                    {parentCategories
                      .filter(category => !editingCategory || category.id !== editingCategory.id)
                      .map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                  </select>
                  {errors.parentId && <p className="mt-1 text-sm text-danger">{errors.parentId}</p>}
                </div>
                
                {/* Category Icon */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    分类图标
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                    <button
                      type="button"
                      onClick={() => setCategoryFormData(prev => ({ ...prev, icon: '' }))}
                      className={`flex flex-col items-center justify-center p-3 border rounded-lg ${!categoryFormData.icon ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary hover:bg-primary/5'}`}
                    >
                      <i className="fa fa-folder text-xl text-gray-400 mb-1"></i>
                      <span className="text-xs text-gray-500">无图标</span>
                    </button>
                    {availableIcons.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setCategoryFormData(prev => ({ ...prev, icon }))}
                        className={`flex flex-col items-center justify-center p-3 border rounded-lg ${categoryFormData.icon === icon ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary hover:bg-primary/5'}`}
                      >
                        <i className={`fa ${icon} text-xl text-primary mb-1`}></i>
                        <span className="text-xs text-gray-500">{icon.replace('fa-', '')}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Sort Order */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    排序序号
                  </label>
                  <input
                    type="number"
                    name="sortOrder"
                    value={categoryFormData.sortOrder}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.sortOrder ? 'border-danger' : 'border-gray-300'}`}
                  />
                  <p className="mt-1 text-xs text-gray-500">数字越小，排序越靠前</p>
                  {errors.sortOrder && <p className="mt-1 text-sm text-danger">{errors.sortOrder}</p>}
                </div>
                
                {/* Active Status */}
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="categoryIsActive"
                    name="isActive"
                    checked={categoryFormData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="categoryIsActive" className="ml-2 block text-sm text-gray-700">
                    启用此分类
                  </label>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-4">
                  <button 
                    type="button"
                    className="btn btn-white border border-gray-300 flex-1 py-2.5"
                    onClick={resetCategoryForm}
                  >
                    取消
                  </button>
                  <button 
                    type="button"
                    className="btn btn-primary flex-1 py-2.5"
                    onClick={editingCategory ? handleEditCategory : handleAddCategory}
                  >
                    {editingCategory ? '更新' : '保存'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-danger mb-4">
                  <i className="fa fa-exclamation-circle text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">确认删除分类</h3>
                <p className="text-gray-500">
                  您确定要删除此分类吗？删除后将无法恢复。
                  <br />
                  <br />
                  <span className="text-danger font-medium">请注意：如果分类下有子分类，您需要先删除或移动所有子分类。</span>
                </p>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  className="btn btn-white border border-gray-300 flex-1 py-2.5"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  取消
                </button>
                <button 
                  className="btn btn-danger flex-1 py-2.5"
                  onClick={() => handleDeleteCategory(showDeleteConfirm)}
                >
                  <i className="fa fa-trash mr-1"></i>
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagementPage;