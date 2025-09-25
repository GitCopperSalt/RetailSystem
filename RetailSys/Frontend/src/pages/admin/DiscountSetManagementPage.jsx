import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { discountApi, productApi, categoryApi } from '../../services/apiService';

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
  });

  // 权限检查
  useEffect(() => {
    if (!isAuthenticated || !hasPermission('manage_discounts')) {
      navigate('/login');
    }
  }, [isAuthenticated, hasPermission, navigate]);

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [discountSetsData, productsData, categoriesData] = await Promise.all([
          discountApi.getDiscountSets(),
          productApi.getProducts(),
          categoryApi.getCategories(),
        ]);
        setDiscountSets(discountSetsData || []);
        setProducts(productsData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && hasPermission('manage_discounts')) {
      loadData();
    }
  }, [isAuthenticated, hasPermission]);

  // 搜索和过滤
  const filteredSets = discountSets.filter(set => {
    const matchesSearch = set.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         set.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || set.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // 处理添加优惠套装
  const handleAddSet = async (e) => {
    e.preventDefault();
    try {
      await discountApi.createDiscountSet(setFormData);
      // 重新加载数据
      const discountSetsData = await discountApi.getDiscountSets();
      setDiscountSets(discountSetsData || []);
      setShowAddSetModal(false);
      // 重置表单
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
      });
    } catch (error) {
      console.error('添加优惠套装失败:', error);
    }
  };

  // 处理更新优惠套装
  const handleUpdateSet = async (e) => {
    e.preventDefault();
    try {
      if (editingSet) {
        await discountApi.updateDiscountSet(editingSet.id, setFormData);
        // 重新加载数据
        const discountSetsData = await discountApi.getDiscountSets();
        setDiscountSets(discountSetsData || []);
        setEditingSet(null);
        // 重置表单
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
        });
      }
    } catch (error) {
      console.error('更新优惠套装失败:', error);
    }
  };

  // 处理删除优惠套装
  const handleDeleteSet = async () => {
    try {
      if (showDeleteConfirm) {
        await discountApi.deleteDiscountSet(showDeleteConfirm);
        // 重新加载数据
        const discountSetsData = await discountApi.getDiscountSets();
        setDiscountSets(discountSetsData || []);
        setShowDeleteConfirm(null);
      }
    } catch (error) {
      console.error('删除优惠套装失败:', error);
    }
  };

  // 开始编辑优惠套装
  const startEditSet = (set) => {
    setEditingSet(set);
    setSetFormData({
      name: set.name,
      description: set.description,
      discountType: set.discountType,
      discountValue: set.discountValue,
      minQuantity: set.minQuantity,
      startDate: set.startDate ? new Date(set.startDate).toISOString().split('T')[0] : '',
      endDate: set.endDate ? new Date(set.endDate).toISOString().split('T')[0] : '',
      status: set.status,
      applicableProducts: set.applicableProducts || [],
      applicableCategories: set.applicableCategories || [],
    });
  };

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSetFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理多选框变化
  const handleCheckboxChange = (type, id) => {
    setSetFormData(prev => {
      const field = type === 'product' ? 'applicableProducts' : 'applicableCategories';
      const currentValues = prev[field] || [];
      if (currentValues.includes(id)) {
        return {
          ...prev,
          [field]: currentValues.filter(itemId => itemId !== id)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentValues, id]
        };
      }
    });
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingSet(null);
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
    });
  };

  // 渲染产品列表
  const renderProductList = () => {
    return products.map(product => (
      <div key={product.id} className="flex items-center mb-2">
        <input
          type="checkbox"
          id={`product-${product.id}`}
          checked={(setFormData.applicableProducts || []).includes(product.id)}
          onChange={() => handleCheckboxChange('product', product.id)}
          className="mr-2"
        />
        <label htmlFor={`product-${product.id}`}>{product.name}</label>
      </div>
    ));
  };

  // 渲染分类列表
  const renderCategoryList = () => {
    return categories.map(category => (
      <div key={category.id} className="flex items-center mb-2">
        <input
          type="checkbox"
          id={`category-${category.id}`}
          checked={(setFormData.applicableCategories || []).includes(category.id)}
          onChange={() => handleCheckboxChange('category', category.id)}
          className="mr-2"
        />
        <label htmlFor={`category-${category.id}`}>{category.name}</label>
      </div>
    ));
  };

  // 渲染优惠套装表格
  const renderDiscountSetsTable = () => {
    return (
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">名称</th>
            <th className="border border-gray-300 p-2 text-left">描述</th>
            <th className="border border-gray-300 p-2 text-left">折扣类型</th>
            <th className="border border-gray-300 p-2 text-left">折扣值</th>
            <th className="border border-gray-300 p-2 text-left">最小数量</th>
            <th className="border border-gray-300 p-2 text-left">开始日期</th>
            <th className="border border-gray-300 p-2 text-left">结束日期</th>
            <th className="border border-gray-300 p-2 text-left">状态</th>
            <th className="border border-gray-300 p-2 text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredSets.map(set => (
            <tr key={set.id} className={set.status === 'inactive' ? 'bg-gray-50' : ''}>
              <td className="border border-gray-300 p-2">{set.name}</td>
              <td className="border border-gray-300 p-2">{set.description}</td>
              <td className="border border-gray-300 p-2">
                {set.discountType === 'fixed_amount' ? '固定金额' : '百分比'}
              </td>
              <td className="border border-gray-300 p-2">
                {set.discountType === 'fixed_amount' ? `¥${set.discountValue}` : `${set.discountValue}%`}
              </td>
              <td className="border border-gray-300 p-2">{set.minQuantity}</td>
              <td className="border border-gray-300 p-2">
                {set.startDate ? new Date(set.startDate).toLocaleDateString() : '-'}
              </td>
              <td className="border border-gray-300 p-2">
                {set.endDate ? new Date(set.endDate).toLocaleDateString() : '-'}
              </td>
              <td className="border border-gray-300 p-2">
                <span className={`px-2 py-1 rounded ${set.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {set.status === 'active' ? '激活' : '禁用'}
                </span>
              </td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => startEditSet(set)}
                  className="px-3 py-1 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600"
                >
                  编辑
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(set.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 如果未认证或无权限，不显示内容
  if (!isAuthenticated || !hasPermission('manage_discounts')) {
    return null;
  }

  return (
    <div className="container-fluid p-4">
      <h1 className="text-2xl font-bold mb-4">优惠套装管理</h1>
      
      {/* 搜索和过滤 */}
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="搜索优惠套装..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded"
        >
          <option value="all">全部状态</option>
          <option value="active">激活</option>
          <option value="inactive">禁用</option>
        </select>
        <button
          onClick={() => setShowAddSetModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          添加优惠套装
        </button>
      </div>

      {/* 数据表格 */}
      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <div className="text-center py-8">加载中...</div>
        ) : (
          renderDiscountSetsTable()
        )}
      </div>

      {/* 添加/编辑优惠套装表单 */}
      {(showAddSetModal || editingSet) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded shadow w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">{editingSet ? '编辑优惠套装' : '添加优惠套装'}</h2>
            <form onSubmit={editingSet ? handleUpdateSet : handleAddSet}>
              <div className="mb-4">
                <label className="block mb-2">名称</label>
                <input
                  type="text"
                  name="name"
                  value={setFormData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">描述</label>
                <textarea
                  name="description"
                  value={setFormData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">折扣类型</label>
                <select
                  name="discountType"
                  value={setFormData.discountType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="fixed_amount">固定金额</option>
                  <option value="percentage">百分比</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">
                  折扣值 ({setFormData.discountType === 'fixed_amount' ? '¥' : '%'})
                </label>
                <input
                  type="number"
                  name="discountValue"
                  value={setFormData.discountValue}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">最小数量</label>
                <input
                  type="number"
                  name="minQuantity"
                  value={setFormData.minQuantity}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">开始日期</label>
                <input
                  type="date"
                  name="startDate"
                  value={setFormData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">结束日期</label>
                <input
                  type="date"
                  name="endDate"
                  value={setFormData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">状态</label>
                <select
                  name="status"
                  value={setFormData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="active">激活</option>
                  <option value="inactive">禁用</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">适用产品</label>
                <div className="border border-gray-300 rounded p-3 max-h-40 overflow-y-auto">
                  {renderProductList()}
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2">适用分类</label>
                <div className="border border-gray-300 rounded p-3 max-h-40 overflow-y-auto">
                  {renderCategoryList()}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (editingSet) {
                      cancelEdit();
                    } else {
                      setShowAddSetModal(false);
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {editingSet ? '更新' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">确认删除</h2>
            <p>您确定要删除这个优惠套装吗？此操作不可撤销。</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                取消
              </button>
              <button
                onClick={handleDeleteSet}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountSetManagementPage;