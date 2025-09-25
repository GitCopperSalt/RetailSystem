import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { discountSetsApi } from '../../apis/discountSetsApi';

const DiscountSetManagementPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasPermission } = useAuth();
  const [discountSets, setDiscountSets] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSet, setEditingSet] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showAddSetModal, setShowAddSetModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form states
  const [setFormData, setSetFormData] = useState({
    name: '',
    description: '',
    discountType: 'fixed_amount', // 'fixed_amount' or 'percentage'
    discountValue: 0,
    minQuantity: 1,
    startDate: '',
    endDate: '',
    status: 'active',
    applicableProducts: [],
    applicableCategories: [],
    isAutoApply: true,
    maxDiscount: 0,
    usageLimitPerUser: 0,
    totalUsageLimit: 0
  });
  const [errors, setErrors] = useState({});
  const [searchProductsQuery, setSearchProductsQuery] = useState('');
  const [availableProducts, setAvailableProducts] = useState([]);

  // Load discount sets, products, and categories
  useEffect(() => {
    if (!isAuthenticated || !hasPermission('product_edit')) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        // 并行获取数据
        const [discountSetsData, productsData, categoriesData] = await Promise.all([
          discountSetsApi.getDiscountSets(),
          discountSetsApi.getAvailableProducts(),
          discountSetsApi.getAvailableCategories()
        ]);

        // 格式化数据以适应前端显示需求
        const formattedProducts = productsData.items ? productsData.items.map(item => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          inventory: item.stock,
          categoryId: item.category_id || '',
          origin: item.origin || '未知产地',
          description: item.description || '',
          imageUrl: item.image_url || 'https://picsum.photos/100',
          createdAt: item.create_time || new Date().toISOString().split('T')[0]
        })) : [];

        const formattedCategories = categoriesData.map(category => ({
          id: category.id,
          name: category.name,
          description: category.description || '',
          parentId: category.parent_id || '',
          icon: category.icon || 'fa-tag',
          isActive: category.is_active || true,
          sortOrder: category.sort_order || 0
        }));

        setDiscountSets(discountSetsData.items || []);
        setProducts(formattedProducts);
        setCategories(formattedCategories);
      } catch (error) {
        console.error('加载数据失败:', error);
        // 在API失败时使用模拟数据作为后备
        useMockData();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, hasPermission, navigate]);

  // 使用模拟数据作为后备
  const useMockData = () => {
    // 准备模拟的折扣数据
    const systemDiscountSets = [
      {
        id: 'grain_oil_bundle',
        name: '粮油组合优惠',
        description: '购买任意两种粮油产品享受优惠',
        discountType: 'percentage',
        discountValue: 15,
        minQuantity: 2,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        status: 'active',
        applicableProducts: [],
        applicableCategories: ['food', 'drinks'],
        isAutoApply: true,
        maxDiscount: 50,
        usageLimitPerUser: 3,
        totalUsageLimit: 100,
        usageCount: 23,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'fresh_produce_bundle',
        name: '生鲜大礼包',
        description: '精选新鲜水果和蔬菜组合优惠',
        discountType: 'fixed_amount',
        discountValue: 20,
        minQuantity: 3,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 15 * 86400000).toISOString(),
        status: 'active',
        applicableProducts: [],
        applicableCategories: ['fresh_produce'],
        isAutoApply: true,
        maxDiscount: 100,
        usageLimitPerUser: 2,
        totalUsageLimit: 50,
        usageCount: 12,
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: 'snack_combo',
        name: '零食组合套餐',
        description: '购买指定三种零食享受特价',
        discountType: 'fixed_amount',
        discountValue: 15,
        minQuantity: 3,
        startDate: new Date(Date.now() - 30 * 86400000).toISOString(),
        endDate: new Date(Date.now() - 15 * 86400000).toISOString(),
        status: 'expired',
        applicableProducts: ['snack1', 'snack2', 'snack3', 'snack4', 'snack5'],
        applicableCategories: [],
        isAutoApply: true,
        maxDiscount: 50,
        usageLimitPerUser: 0,
        totalUsageLimit: 0,
        usageCount: 87,
        createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 86400000).toISOString()
      }
    ];

    // 准备模拟的商品数据
    const systemProducts = [
      {
        id: 'apple',
        name: '红富士苹果',
        description: '新鲜红富士苹果，脆甜多汁',
        price: 12.99,
        stock: 150,
        category: 'fruits',
        images: ['apple1.jpg', 'apple2.jpg'],
        origin: '山东',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'banana',
        name: '香蕉',
        description: '新鲜香蕉，香甜软糯',
        price: 5.99,
        stock: 200,
        category: 'fruits',
        images: ['banana1.jpg'],
        origin: '海南',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'carrot',
        name: '胡萝卜',
        description: '新鲜胡萝卜，营养丰富',
        price: 3.50,
        stock: 300,
        category: 'vegetables',
        images: ['carrot1.jpg'],
        origin: '本地',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'milk',
        name: '纯牛奶',
        description: '优质纯牛奶，富含钙质',
        price: 8.99,
        stock: 100,
        category: 'dairy',
        images: ['milk1.jpg'],
        origin: '内蒙古',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'rice',
        name: '大米',
        description: '优质大米，口感细腻',
        price: 59.90,
        stock: 50,
        category: 'food',
        images: ['rice1.jpg'],
        origin: '东北',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'oil',
        name: '食用油',
        description: '健康食用油，营养均衡',
        price: 89.90,
        stock: 30,
        category: 'food',
        images: ['oil1.jpg'],
        origin: '本地',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'snack1',
        name: '薯片',
        description: '美味薯片，口感酥脆',
        price: 9.90,
        stock: 200,
        category: 'snacks',
        images: ['snack1.jpg'],
        origin: '本地',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'snack2',
        name: '巧克力',
        description: '进口巧克力，丝滑口感',
        price: 19.90,
        stock: 100,
        category: 'snacks',
        images: ['snack2.jpg'],
        origin: '比利时',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'snack3',
        name: '饼干',
        description: '奶油饼干，香甜可口',
        price: 12.90,
        stock: 150,
        category: 'snacks',
        images: ['snack3.jpg'],
        origin: '本地',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'snack4',
        name: '坚果',
        description: '混合坚果，营养健康',
        price: 29.90,
        stock: 80,
        category: 'snacks',
        images: ['snack4.jpg'],
        origin: '美国',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'snack5',
        name: '糖果',
        description: '水果味糖果，甜蜜滋味',
        price: 15.90,
        stock: 120,
        category: 'snacks',
        images: ['snack5.jpg'],
        origin: '本地',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    // 准备模拟的分类数据
    const systemCategories = [
      {
        id: 'fresh_produce',
        name: '生鲜',
        description: '新鲜水果和蔬菜',
        parentId: '',
        icon: 'fa-apple-alt',
        isActive: true,
        sortOrder: 1
      },
      {
        id: 'fruits',
        name: '水果',
        description: '各类新鲜水果',
        parentId: 'fresh_produce',
        icon: 'fa-apple-whole',
        isActive: true,
        sortOrder: 1
      },
      {
        id: 'vegetables',
        name: '蔬菜',
        description: '各类新鲜蔬菜',
        parentId: 'fresh_produce',
        icon: 'fa-carrot',
        isActive: true,
        sortOrder: 2
      },
      {
        id: 'food',
        name: '食品',
        description: '各类食品',
        parentId: '',
        icon: 'fa-utensils',
        isActive: true,
        sortOrder: 3
      },
      {
        id: 'snacks',
        name: '零食',
        description: '各类休闲零食',
        parentId: 'food',
        icon: 'fa-cookie',
        isActive: true,
        sortOrder: 1
      },
      {
        id: 'drinks',
        name: '饮料',
        description: '各类饮品',
        parentId: 'food',
        icon: 'fa-wine-bottle',
        isActive: true,
        sortOrder: 2
      },
      {
        id: 'dairy',
        name: '乳制品',
        description: '牛奶、酸奶、奶酪等',
        parentId: 'food',
        icon: 'fa-cheese',
        isActive: true,
        sortOrder: 3
      }
    ];

    setDiscountSets(systemDiscountSets);
    setProducts(systemProducts);
    setCategories(systemCategories);
    setAvailableProducts(systemProducts);
  };

  // Filter available products based on search query
  useEffect(() => {
    if (searchProductsQuery) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchProductsQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchProductsQuery.toLowerCase())
      );
      setAvailableProducts(filtered);
    } else {
      setAvailableProducts(products);
    }
  }, [searchProductsQuery, products]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSetFormData(prev => ({
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

  // Toggle product selection
  const toggleProductSelection = (productId) => {
    setSetFormData(prev => {
      if (prev.applicableProducts.includes(productId)) {
        return {
          ...prev,
          applicableProducts: prev.applicableProducts.filter(id => id !== productId)
        };
      } else {
        return {
          ...prev,
          applicableProducts: [...prev.applicableProducts, productId]
        };
      }
    });
  };

  // Toggle category selection
  const toggleCategorySelection = (categoryId) => {
    setSetFormData(prev => {
      if (prev.applicableCategories.includes(categoryId)) {
        return {
          ...prev,
          applicableCategories: prev.applicableCategories.filter(id => id !== categoryId)
        };
      } else {
        return {
          ...prev,
          applicableCategories: [...prev.applicableCategories, categoryId]
        };
      }
    });
  };

  // Validate discount set form
  const validateSetForm = () => {
    const newErrors = {};
    
    if (!setFormData.name.trim()) {
      newErrors.name = '请输入优惠套装名称';
    }
    
    if (!setFormData.description.trim()) {
      newErrors.description = '请输入优惠套装描述';
    }
    
    if (setFormData.discountValue <= 0) {
      newErrors.discountValue = '优惠金额必须大于0';
    }
    
    if (setFormData.discountType === 'percentage' && setFormData.discountValue > 100) {
      newErrors.discountValue = '折扣百分比不能超过100%';
    }
    
    if (setFormData.minQuantity <= 0) {
      newErrors.minQuantity = '最低购买数量必须大于0';
    }
    
    if (!setFormData.startDate) {
      newErrors.startDate = '请选择开始日期';
    }
    
    if (!setFormData.endDate) {
      newErrors.endDate = '请选择结束日期';
    }
    
    if (setFormData.startDate && setFormData.endDate) {
      const startDate = new Date(setFormData.startDate);
      const endDate = new Date(setFormData.endDate);
      if (startDate > endDate) {
        newErrors.endDate = '结束日期不能早于开始日期';
      }
    }
    
    // Check if at least one product or category is selected
    if (setFormData.applicableProducts.length === 0 && setFormData.applicableCategories.length === 0) {
      newErrors.applicableProducts = '请至少选择一个适用产品或分类';
    }
    
    if (setFormData.maxDiscount < 0) {
      newErrors.maxDiscount = '最大优惠金额不能为负数';
    }
    
    if (setFormData.usageLimitPerUser < 0) {
      newErrors.usageLimitPerUser = '每用户使用次数不能为负数';
    }
    
    if (setFormData.totalUsageLimit < 0) {
      newErrors.totalUsageLimit = '总使用次数不能为负数';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle add discount set
  const handleAddSet = async () => {
    if (validateSetForm()) {
      try {
        setLoading(true);
        // 准备提交给后端的数据格式
        const setData = {
          ...setFormData,
          startDate: `${setFormData.startDate}T00:00:00.000Z`,
          endDate: `${setFormData.endDate}T23:59:59.999Z`
        };
        
        // 调用API创建新的优惠套装
        const newSet = await discountSetsApi.createDiscountSet(setData);
        
        // 添加到列表中
        const updatedSets = [...discountSets, newSet];
        setDiscountSets(updatedSets);
        
        // Reset form and close modal
        resetSetForm();
        alert('优惠套装创建成功！');
      } catch (error) {
        console.error('创建优惠套装失败:', error);
        alert('优惠套装创建失败，请重试');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle edit discount set
  const handleEditSet = async () => {
    if (validateSetForm() && editingSet) {
      try {
        setLoading(true);
        // 准备提交给后端的数据格式
        const setData = {
          ...setFormData,
          startDate: `${setFormData.startDate}T00:00:00.000Z`,
          endDate: `${setFormData.endDate}T23:59:59.999Z`
        };
        
        // 调用API更新优惠套装
        const updatedSet = await discountSetsApi.updateDiscountSet(editingSet.id, setData);
        
        // 更新列表中的数据
        const updatedSets = discountSets.map(discountSet => 
          discountSet.id === editingSet.id ? updatedSet : discountSet
        );
        
        setDiscountSets(updatedSets);
        
        // Reset form and close modal
        resetSetForm();
        alert('优惠套装更新成功！');
      } catch (error) {
        console.error('更新优惠套装失败:', error);
        alert('优惠套装更新失败，请重试');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle delete discount set
  const handleDeleteSet = async (setId) => {
    try {
      setLoading(true);
      // 调用API删除优惠套装
      await discountSetsApi.deleteDiscountSet(setId);
      
      // 从列表中移除
      const updatedSets = discountSets.filter(discountSet => discountSet.id !== setId);
      setDiscountSets(updatedSets);
      
      setShowDeleteConfirm(null);
      alert('优惠套装删除成功！');
    } catch (error) {
      console.error('删除优惠套装失败:', error);
      alert('优惠套装删除失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // Toggle discount set status
  const handleToggleSetStatus = async (setId) => {
    try {
      setLoading(true);
      // 获取当前优惠套装
      const discountSet = discountSets.find(set => set.id === setId);
      if (!discountSet) return;
      
      // 计算新状态
      const newStatus = discountSet.status === 'active' ? 'inactive' : 'active';
      
      // 调用API切换状态
      const updatedSet = await discountSetsApi.toggleDiscountSetStatus(setId, newStatus);
      
      // 更新列表中的数据
      const updatedSets = discountSets.map(set => 
        set.id === setId ? updatedSet : set
      );
      
      setDiscountSets(updatedSets);
      alert(`优惠套装已${newStatus === 'active' ? '启用' : '停用'}！`);
    } catch (error) {
      console.error('切换优惠套装状态失败:', error);
      alert('切换优惠套装状态失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // Reset discount set form and modal states
  const resetSetForm = () => {
    setSetFormData({
      name: '',
      description: '',
      discountType: 'fixed_amount',
      discountValue: 0,
      minQuantity: 1,
      startDate: '',
      endDate: '',
      status: 'active',
      applicableProducts: [],
      applicableCategories: [],
      isAutoApply: true,
      maxDiscount: 0,
      usageLimitPerUser: 0,
      totalUsageLimit: 0
    });
    setErrors({});
    setEditingSet(null);
    setShowAddSetModal(false);
    setSearchProductsQuery('');
  };

  // Open add discount set modal
  const openAddSetModal = () => {
    resetSetForm();
    setShowAddSetModal(true);
  };

  // Open edit discount set modal
  const openEditSetModal = (discountSet) => {
    setSetFormData({
      name: discountSet.name,
      description: discountSet.description,
      discountType: discountSet.discountType,
      discountValue: discountSet.discountValue,
      minQuantity: discountSet.minQuantity,
      startDate: discountSet.startDate.split('T')[0],
      endDate: discountSet.endDate.split('T')[0],
      status: discountSet.status,
      applicableProducts: [...discountSet.applicableProducts],
      applicableCategories: [...discountSet.applicableCategories],
      isAutoApply: discountSet.isAutoApply,
      maxDiscount: discountSet.maxDiscount,
      usageLimitPerUser: discountSet.usageLimitPerUser,
      totalUsageLimit: discountSet.totalUsageLimit
    });
    setEditingSet(discountSet);
    setShowAddSetModal(true);
  };

  // Get category name by ID
  const getCategoryNameById = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : '未知分类';
  };

  // Get product name by ID
  const getProductNameById = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : '未知产品';
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };

  // Filter discount sets based on search query and status
  const filteredSets = discountSets.filter(discountSet => {
    const matchesSearch = 
      discountSet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discountSet.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || discountSet.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get status display text and badge color
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'active':
        return { text: '进行中', color: 'bg-green-100 text-green-800' };
      case 'inactive':
        return { text: '已停用', color: 'bg-gray-100 text-gray-800' };
      case 'expired':
        return { text: '已过期', color: 'bg-red-100 text-red-800' };
      default:
        return { text: '未知状态', color: 'bg-blue-100 text-blue-800' };
    }
  };

  // Get discount display text
  const getDiscountDisplay = (type, value) => {
    if (type === 'fixed_amount') {
      return `¥${value}`;
    } else {
      return `${value}%`;
    }
  };

  // Get applicable items display text
  const getApplicableItemsDisplay = (products, categories) => {
    if (products.length > 0 && categories.length > 0) {
      return `${products.length}个产品 + ${categories.length}个分类`;
    } else if (products.length > 0) {
      return `${products.length}个产品`;
    } else if (categories.length > 0) {
      return `${categories.length}个分类`;
    } else {
      return '无适用项';
    }
  };

  // Get usage statistics display
  const getUsageDisplay = (usageCount, totalUsageLimit) => {
    if (totalUsageLimit > 0) {
      return `${usageCount}/${totalUsageLimit}`;
    } else {
      return `${usageCount}/无限制`;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">加载优惠套装数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">优惠套装管理</h1>
          <p className="text-gray-500 mt-1">创建和管理商品优惠组合套装</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={openAddSetModal}
        >
          <i className="fa fa-plus mr-2"></i>
          添加优惠套装
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">搜索优惠套装</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fa fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="输入优惠套装名称或描述进行搜索"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">按状态筛选</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">所有状态</option>
              <option value="active">进行中</option>
              <option value="inactive">已停用</option>
              <option value="expired">已过期</option>
            </select>
          </div>
        </div>
      </div>

      {/* Discount Sets List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredSets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    优惠套装名称
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    优惠信息
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    适用范围
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    有效期
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    使用次数
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSets.map((discountSet) => {
                  const statusDisplay = getStatusDisplay(discountSet.status);
                  return (
                    <tr key={discountSet.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{discountSet.name}</div>
                        <div className="text-sm text-gray-500 max-w-xs mt-1">{discountSet.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {discountSet.discountType === 'fixed_amount' ? '固定金额优惠' : '百分比折扣'}
                        </div>
                        <div className="text-xl font-bold text-primary mt-1">
                          {getDiscountDisplay(discountSet.discountType, discountSet.discountValue)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          最低购买 {discountSet.minQuantity} 件
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {getApplicableItemsDisplay(discountSet.applicableProducts, discountSet.applicableCategories)}
                        </div>
                        {discountSet.applicableCategories.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {discountSet.applicableCategories.map(id => getCategoryNameById(id)).join(', ')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(discountSet.startDate)} - {formatDate(discountSet.endDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusDisplay.color}`}>
                          {statusDisplay.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getUsageDisplay(discountSet.usageCount, discountSet.totalUsageLimit)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-primary hover:text-primary/80 mr-4"
                          onClick={() => openEditSetModal(discountSet)}
                        >
                          编辑
                        </button>
                        {discountSet.status !== 'expired' && (
                          <button 
                            className={`${discountSet.status === 'active' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'} mr-4`}
                            onClick={() => handleToggleSetStatus(discountSet.id)}
                          >
                            {discountSet.status === 'active' ? '停用' : '启用'}
                          </button>
                        )}
                        <button 
                          className="text-danger hover:text-danger/80"
                          onClick={() => setShowDeleteConfirm(discountSet.id)}
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <i className="fa fa-tag text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">
              {searchQuery || filterStatus !== 'all' 
                ? '没有找到匹配的优惠套装' 
                : '暂无优惠套装数据，请添加新套装'}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Discount Set Modal */}
      {showAddSetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingSet ? '编辑优惠套装' : '添加新优惠套装'}
                </h3>
                <button 
                  className="text-gray-400 hover:text-gray-500"
                  onClick={resetSetForm}
                >
                  <i className="fa fa-times text-lg"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form>
                {/* Basic Information */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">基本信息</h4>
                  
                  {/* Set Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      优惠套装名称
                      <span className="text-danger ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={setFormData.name}
                      onChange={handleInputChange}
                      placeholder="请输入优惠套装名称（如：粮油组合优惠）"
                      className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.name ? 'border-danger' : 'border-gray-300'}`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-danger">{errors.name}</p>}
                  </div>
                  
                  {/* Set Description */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      优惠套装描述
                      <span className="text-danger ml-1">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={setFormData.description}
                      onChange={handleInputChange}
                      placeholder="请输入优惠套装描述信息"
                      rows={3}
                      className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none ${errors.description ? 'border-danger' : 'border-gray-300'}`}
                    />
                    {errors.description && <p className="mt-1 text-sm text-danger">{errors.description}</p>}
                  </div>
                  
                  {/* Discount Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Discount Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        优惠类型
                        <span className="text-danger ml-1">*</span>
                      </label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="discountType"
                            value="fixed_amount"
                            checked={setFormData.discountType === 'fixed_amount'}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <span className="ml-2 text-sm text-gray-700">固定金额</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="discountType"
                            value="percentage"
                            checked={setFormData.discountType === 'percentage'}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <span className="ml-2 text-sm text-gray-700">百分比折扣</span>
                        </label>
                      </div>
                    </div>
                    
                    {/* Discount Value */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        优惠值
                        <span className="text-danger ml-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="discountValue"
                          value={setFormData.discountValue}
                          onChange={handleInputChange}
                          min="0"
                          step={setFormData.discountType === 'fixed_amount' ? '0.01' : '1'}
                          placeholder="0"
                          className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.discountValue ? 'border-danger' : 'border-gray-300'}`}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">
                            {setFormData.discountType === 'fixed_amount' ? '元' : '%'}
                          </span>
                        </div>
                      </div>
                      {errors.discountValue && <p className="mt-1 text-sm text-danger">{errors.discountValue}</p>}
                    </div>
                  </div>
                  
                  {/* Min Quantity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        最低购买数量
                        <span className="text-danger ml-1">*</span>
                      </label>
                      <input
                        type="number"
                        name="minQuantity"
                        value={setFormData.minQuantity}
                        onChange={handleInputChange}
                        min="1"
                        placeholder="1"
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.minQuantity ? 'border-danger' : 'border-gray-300'}`}
                      />
                      {errors.minQuantity && <p className="mt-1 text-sm text-danger">{errors.minQuantity}</p>}
                    </div>
                    
                    {/* Max Discount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        最大优惠金额（可选）
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="maxDiscount"
                          value={setFormData.maxDiscount}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                          placeholder="0"
                          className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.maxDiscount ? 'border-danger' : 'border-gray-300'}`}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">元</span>
                        </div>
                      </div>
                      {errors.maxDiscount && <p className="mt-1 text-sm text-danger">{errors.maxDiscount}</p>}
                      <p className="mt-1 text-xs text-gray-500">设置为0表示无限制</p>
                    </div>
                  </div>
                </div>
                
                {/* Validity Period */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">有效期</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Start Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        开始日期
                        <span className="text-danger ml-1">*</span>
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={setFormData.startDate}
                        onChange={handleInputChange}
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.startDate ? 'border-danger' : 'border-gray-300'}`}
                      />
                      {errors.startDate && <p className="mt-1 text-sm text-danger">{errors.startDate}</p>}
                    </div>
                    
                    {/* End Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        结束日期
                        <span className="text-danger ml-1">*</span>
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={setFormData.endDate}
                        onChange={handleInputChange}
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.endDate ? 'border-danger' : 'border-gray-300'}`}
                      />
                      {errors.endDate && <p className="mt-1 text-sm text-danger">{errors.endDate}</p>}
                    </div>
                  </div>
                </div>
                
                {/* Applicable Products */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">适用范围</h4>
                  
                  {/* Search Products */}
                  <div className="mb-4">
                    <input
                      type="text"
                      value={searchProductsQuery}
                      onChange={(e) => setSearchProductsQuery(e.target.value)}
                      placeholder="搜索产品..."
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
                  {/* Products Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">选择适用产品</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-3 bg-gray-50 rounded-lg">
                      {availableProducts.length > 0 ? (
                        availableProducts.map(product => (
                          <label key={product.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={setFormData.applicableProducts.includes(product.id)}
                              onChange={() => toggleProductSelection(product.id)}
                              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <span className="text-sm text-gray-700">{product.name}</span>
                          </label>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 col-span-full text-center">没有找到匹配的产品</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Categories Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">选择适用分类</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto p-3 bg-gray-50 rounded-lg">
                      {categories.filter(cat => !cat.parentId).map(category => (
                        <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setFormData.applicableCategories.includes(category.id)}
                            onChange={() => toggleCategorySelection(category.id)}
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">{category.name}</span>
                        </label>
                      ))}
                    </div>
                    {errors.applicableProducts && (
                      <p className="mt-2 text-sm text-danger">{errors.applicableProducts}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">至少选择一个产品或分类</p>
                  </div>
                </div>
                
                {/* Advanced Settings */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">高级设置</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Usage Limit Per User */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        每用户使用次数限制（可选）
                      </label>
                      <input
                        type="number"
                        name="usageLimitPerUser"
                        value={setFormData.usageLimitPerUser}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="0"
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.usageLimitPerUser ? 'border-danger' : 'border-gray-300'}`}
                      />
                      {errors.usageLimitPerUser && <p className="mt-1 text-sm text-danger">{errors.usageLimitPerUser}</p>}
                      <p className="mt-1 text-xs text-gray-500">设置为0表示无限制</p>
                    </div>
                    
                    {/* Total Usage Limit */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        总使用次数限制（可选）
                      </label>
                      <input
                        type="number"
                        name="totalUsageLimit"
                        value={setFormData.totalUsageLimit}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="0"
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.totalUsageLimit ? 'border-danger' : 'border-gray-300'}`}
                      />
                      {errors.totalUsageLimit && <p className="mt-1 text-sm text-danger">{errors.totalUsageLimit}</p>}
                      <p className="mt-1 text-xs text-gray-500">设置为0表示无限制</p>
                    </div>
                  </div>
                  
                  {/* Auto Apply */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isAutoApply"
                      name="isAutoApply"
                      checked={setFormData.isAutoApply}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="isAutoApply" className="ml-2 block text-sm text-gray-700">
                      自动应用此优惠
                    </label>
                  </div>
                </div>
                
                {/* Status */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">状态</h4>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="active"
                        checked={setFormData.status === 'active'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">启用</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="inactive"
                        checked={setFormData.status === 'inactive'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">停用</span>
                    </label>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-4">
                  <button 
                    type="button"
                    className="btn btn-white border border-gray-300 flex-1 py-2.5"
                    onClick={resetSetForm}
                  >
                    取消
                  </button>
                  <button 
                    type="button"
                    className="btn btn-primary flex-1 py-2.5"
                    onClick={editingSet ? handleEditSet : handleAddSet}
                  >
                    {editingSet ? '更新' : '保存'}
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">确认删除优惠套装</h3>
                <p className="text-gray-500">
                  您确定要删除此优惠套装吗？删除后将无法恢复。
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
                  onClick={() => handleDeleteSet(showDeleteConfirm)}
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

export default DiscountSetManagementPage;