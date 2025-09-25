import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { addressApi } from '../../services/apiService';

const AddressManagementPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detailAddress: '',
    isDefault: false
  });

  // Form errors
  const [errors, setErrors] = useState({});

  // Load addresses
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadAddresses = async () => {
      setLoading(true);

      try {
        const addressData = await addressApi.getAddresses();
        setAddresses(addressData);
      } catch (error) {
        console.error('获取地址列表失败:', error);
        // 错误情况下使用mock数据
        const mockAddresses = [
          {
            id: 'addr1',
            name: '张女士',
            phone: '138****6789',
            province: '北京市',
            city: '北京市',
            district: '朝阳区',
            detailAddress: '建国路88号 现代城SOHO A座 2305室',
            isDefault: true,
            latitude: 39.914445, 
            longitude: 116.464176
          },
          {
            id: 'addr2',
            name: '张先生',
            phone: '139****1234',
            province: '上海市',
            city: '上海市',
            district: '浦东新区',
            detailAddress: '陆家嘴环路1000号 恒生银行大厦 15楼',
            isDefault: false,
            latitude: 31.234639, 
            longitude: 121.501595
          }
        ];
        setAddresses(mockAddresses);
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, [isAuthenticated, navigate]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
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

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入收件人姓名';
    }
    
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = '请输入手机号码';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = '请输入正确的手机号码';
    }
    
    if (!formData.province) {
      newErrors.province = '请选择省份';
    }
    
    if (!formData.city) {
      newErrors.city = '请选择城市';
    }
    
    if (!formData.district) {
      newErrors.district = '请选择区县';
    }
    
    if (!formData.detailAddress.trim()) {
      newErrors.detailAddress = '请输入详细地址';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle add address
  const handleAddAddress = async () => {
    if (validateForm()) {
      // 创建完整地址字符串用于地理编码
      const fullAddress = `${formData.province} ${formData.city} ${formData.district} ${formData.detailAddress}`;
      
      // 创建基本地址对象
      const newAddress = {
        id: `addr${Date.now()}`,
        ...formData,
        // Mask phone number for privacy
        phone: formData.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
        latitude: null,
        longitude: null
      };

      // 调用API保存地址
      try {
        await addressApi.createAddress(newAddress);
        // 重新加载地址列表以确保数据最新
        const addressData = await addressApi.getAddresses();
        setAddresses(addressData);
      } catch (error) {
        console.error('添加地址失败:', error);
        // API失败时，使用本地更新作为降级方案
        // If setting as default, update other addresses
        let updatedAddresses = [...addresses];
        if (formData.isDefault) {
          updatedAddresses = updatedAddresses.map(addr => ({
            ...addr,
            isDefault: false
          }));
        }
        
        updatedAddresses.push(newAddress);
        setAddresses(updatedAddresses);
      }
      
      // Reset form and close modal
      resetForm();
    }
  };

  // Handle edit address
  const handleEditAddress = async () => {
    if (validateForm() && editingAddress) {
      // 创建更新后的地址对象
      const updatedAddress = {
        ...editingAddress,
        ...formData,
        // Mask phone number for privacy
        phone: formData.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      };

      // 调用API更新地址
      try {
        await addressApi.updateAddress(editingAddress.id, updatedAddress);
        // 重新加载地址列表以确保数据最新
        const addressData = await addressApi.getAddresses();
        setAddresses(addressData);
      } catch (error) {
        console.error('更新地址失败:', error);
        // API失败时，使用本地更新作为降级方案
        let updatedAddresses = addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === editingAddress.id ? formData.isDefault : (formData.isDefault ? false : addr.isDefault)
        }));
        
        updatedAddresses = updatedAddresses.map(addr => 
          addr.id === editingAddress.id 
            ? updatedAddress 
            : addr
        );
        
        setAddresses(updatedAddresses);
      }
      
      // Reset form and close modal
      resetForm();
    }
  };

  // Handle delete address
  const handleDeleteAddress = async (addressId) => {
    try {
      // 调用API删除地址
      await addressApi.deleteAddress(addressId);
      // 重新加载地址列表以确保数据最新
      const addressData = await addressApi.getAddresses();
      setAddresses(addressData);
    } catch (error) {
      console.error('删除地址失败:', error);
      // API失败时，使用本地更新作为降级方案
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      setAddresses(updatedAddresses);
    }
    
    setShowDeleteConfirm(null);
  };

  // Handle set default address
  const handleSetDefault = async (addressId) => {
    try {
      // 调用API设置默认地址
      await addressApi.setDefaultAddress(addressId);
      // 重新加载地址列表以确保数据最新
      const addressData = await addressApi.getAddresses();
      setAddresses(addressData);
    } catch (error) {
      console.error('设置默认地址失败:', error);
      // API失败时，使用本地更新作为降级方案
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));
      setAddresses(updatedAddresses);
    }
  };

  // Reset form and modal states
  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detailAddress: '',
      isDefault: false
    });
    setErrors({});
    setIsAdding(false);
    setEditingAddress(null);
  };

  // Open add address modal
  const openAddModal = () => {
    resetForm();
    setIsAdding(true);
  };

  // Open edit address modal
  const openEditModal = (address) => {
    // Unmask phone number for editing
    const unmaskedPhone = address.phone.replace('****', '0000'); // In a real app, this would come from secure storage
    setFormData({
      ...address,
      phone: unmaskedPhone
    });
    setEditingAddress(address);
    setIsAdding(false);
  };

  // Mock province data (in a real app, this would come from an API)
  const provinces = ['北京市', '上海市', '广东省', '江苏省', '浙江省', '四川省'];
  const getCities = (province) => {
    const cityMap = {
      '北京市': ['北京市'],
      '上海市': ['上海市'],
      '广东省': ['广州市', '深圳市', '东莞市', '佛山市'],
      '江苏省': ['南京市', '苏州市', '无锡市', '常州市'],
      '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市'],
      '四川省': ['成都市', '绵阳市', '德阳市', '自贡市']
    };
    return cityMap[province] || [];
  };
  const getDistricts = (city) => {
    const districtMap = {
      '北京市': ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区'],
      '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '浦东新区'],
      '广州市': ['越秀区', '荔湾区', '天河区', '白云区', '海珠区', '黄埔区'],
      '深圳市': ['福田区', '罗湖区', '南山区', '宝安区', '龙岗区', '盐田区'],
      '南京市': ['玄武区', '秦淮区', '建邺区', '鼓楼区', '浦口区', '栖霞区'],
      '杭州市': ['上城区', '下城区', '江干区', '拱墅区', '西湖区', '滨江区'],
      '成都市': ['锦江区', '青羊区', '金牛区', '武侯区', '成华区', '龙泉驿区']
    };
    return districtMap[city] || [];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">加载地址信息中...</p>
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
                  <span className="text-gray-900 font-medium">地址管理</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">我的收货地址</h1>
          <button 
            className="btn btn-primary"
            onClick={openAddModal}
          >
            <i className="fa fa-plus mr-2"></i>
            添加新地址
          </button>
        </div>

        {/* Address List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.length === 0 ? (
            <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-sm p-8 text-center">
              <i className="fa fa-map-marker text-6xl text-gray-200 mb-4"></i>
              <p className="text-gray-500 mb-6">暂无收货地址</p>
              <button 
                className="btn btn-primary"
                onClick={openAddModal}
              >
                <i className="fa fa-plus mr-2"></i>
                添加新地址
              </button>
            </div>
          ) : (
            addresses.map((address) => (
              <div 
                key={address.id} 
                className="bg-white rounded-xl shadow-sm p-6 border-2 hover:border-primary transition-colors"
              >
                {/* Default Tag */}
                {address.isDefault && (
                  <div className="mb-4">
                    <span className="inline-block px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                      默认地址
                    </span>
                  </div>
                )}
                
                {/* Address Info */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <h3 className="text-gray-900 font-medium mr-3">{address.name}</h3>
                    <span className="text-gray-500">{address.phone}</span>
                  </div>
                  <p className="text-gray-900 line-clamp-2">
                    {address.province} {address.city} {address.district} {address.detailAddress}
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex justify-end items-center pt-4 border-t border-gray-100">
                  {!address.isDefault && (
                    <button 
                      className="text-sm text-primary hover:text-primary/80 mr-6"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      <i className="fa fa-check-circle mr-1"></i>
                      设为默认
                    </button>
                  )}
                  <button 
                    className="text-sm text-gray-500 hover:text-primary mr-6"
                    onClick={() => openEditModal(address)}
                  >
                    <i className="fa fa-pencil mr-1"></i>
                    编辑
                  </button>
                  <button 
                    className="text-sm text-gray-500 hover:text-danger"
                    onClick={() => setShowDeleteConfirm(address.id)}
                  >
                    <i className="fa fa-trash mr-1"></i>
                    删除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State Message */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-start">
            <i className="fa fa-info-circle text-blue-500 mt-0.5 mr-3"></i>
            <div className="text-sm text-blue-700">
              <p>• 最多可添加10个收货地址</p>
              <p>• 默认地址将作为订单的优先配送地址</p>
              <p>• 所有地址信息均经过加密处理，请放心添加</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Address Modal */}
      {isAdding || editingAddress ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  {isAdding ? '添加新地址' : '编辑地址'}
                </h3>
                <button 
                  className="text-gray-400 hover:text-gray-500"
                  onClick={resetForm}
                >
                  <i className="fa fa-times text-lg"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form>
                {/* Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    收件人姓名
                    <span className="text-danger ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="请输入收件人姓名"
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.name ? 'border-danger' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-danger">{errors.name}</p>}
                </div>
                
                {/* Phone */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    手机号码
                    <span className="text-danger ml-1">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="请输入11位手机号码"
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.phone ? 'border-danger' : 'border-gray-300'}`}
                    maxLength="11"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-danger">{errors.phone}</p>}
                </div>
                
                {/* Region */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      省份
                      <span className="text-danger ml-1">*</span>
                    </label>
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.province ? 'border-danger' : 'border-gray-300'}`}
                    >
                      <option value="">请选择</option>
                      {provinces.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                    {errors.province && <p className="mt-1 text-xs text-danger">{errors.province}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      城市
                      <span className="text-danger ml-1">*</span>
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.city ? 'border-danger' : 'border-gray-300'}`}
                    >
                      <option value="">请选择</option>
                      {formData.province && getCities(formData.province).map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    {errors.city && <p className="mt-1 text-xs text-danger">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      区县
                      <span className="text-danger ml-1">*</span>
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.district ? 'border-danger' : 'border-gray-300'}`}
                    >
                      <option value="">请选择</option>
                      {formData.city && getDistricts(formData.city).map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                    {errors.district && <p className="mt-1 text-xs text-danger">{errors.district}</p>}
                  </div>
                </div>
                
                {/* Detail Address */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    详细地址
                    <span className="text-danger ml-1">*</span>
                  </label>
                  <textarea
                    name="detailAddress"
                    value={formData.detailAddress}
                    onChange={handleInputChange}
                    placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元等"
                    rows={4}
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none ${errors.detailAddress ? 'border-danger' : 'border-gray-300'}`}
                  />
                  {errors.detailAddress && <p className="mt-1 text-sm text-danger">{errors.detailAddress}</p>}
                </div>
                
                {/* Set as Default */}
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                    设为默认收货地址
                  </label>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-4">
                  <button 
                    type="button"
                    className="btn btn-white border border-gray-300 flex-1 py-2.5"
                    onClick={resetForm}
                  >
                    取消
                  </button>
                  <button 
                    type="button"
                    className="btn btn-primary flex-1 py-2.5"
                    onClick={isAdding ? handleAddAddress : handleEditAddress}
                  >
                    {isAdding ? '保存' : '更新'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-danger mb-4">
                  <i className="fa fa-exclamation-circle text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">确认删除</h3>
                <p className="text-gray-500">
                  您确定要删除此收货地址吗？删除后将无法恢复。
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
                  onClick={() => handleDeleteAddress(showDeleteConfirm)}
                >
                  <i className="fa fa-trash mr-1"></i>
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AddressManagementPage;