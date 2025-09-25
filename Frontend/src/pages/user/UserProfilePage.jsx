import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    email: '',
    avatar: '',
    preferences: {
      notification: {
        order_status: true,
        promotions: true,
        new_products: false
      },
      default_delivery_address: '',
      language: 'zh-CN',
      currency: 'CNY'
    },
    gender: '',
    birthday: ''
  });
  const [errors, setErrors] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load user profile data
    loadUserProfile();
    loadUserAddresses();
  }, [isAuthenticated, currentUser, navigate]);

  // Load user profile data
  const loadUserProfile = () => {
    // Get user profile from localStorage or use mock data
    let userProfile = JSON.parse(localStorage.getItem('userProfile') || 'null');
    
    if (userProfile && currentUser) {
      setProfileForm(userProfile);
      if (userProfile.avatar) {
        setAvatarPreview(userProfile.avatar);
      }
    } else {
      // Use mock data if no profile exists
      const mockProfile = {
        name: currentUser?.username || '张三',
        phone: currentUser?.phone || '138****1234',
        email: currentUser?.email || '',
        avatar: '',
        preferences: {
          notification: {
            order_status: true,
            promotions: true,
            new_products: false
          },
          default_delivery_address: '',
          language: 'zh-CN',
          currency: 'CNY'
        },
        gender: '',
        birthday: ''
      };
      setProfileForm(mockProfile);
      
      // Save mock profile to localStorage
      if (currentUser) {
        localStorage.setItem('userProfile', JSON.stringify(mockProfile));
      }
    }
  };

  // Load user addresses
  const loadUserAddresses = () => {
    let userAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
    
    // If no addresses in localStorage, use mock data
    if (userAddresses.length === 0) {
      userAddresses = [
        {
          id: '1',
          name: '张三',
          phone: '13812341234',
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
          address: '建国路88号',
          zipCode: '100022',
          isDefault: true,
          label: '家'
        }
      ];
      localStorage.setItem('userAddresses', JSON.stringify(userAddresses));
    }
    
    setAddresses(userAddresses);
  };

  // Handle profile form input change
  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle preferences change
  const handlePreferencesChange = (section, key, value) => {
    setProfileForm(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [section]: {
          ...prev.preferences[section],
          [key]: value
        }
      }
    }));
  };

  // Handle avatar upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setErrors(prev => ({
          ...prev,
          avatar: '请上传有效的图片文件'
        }));
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          avatar: '图片大小不能超过2MB'
        }));
        return;
      }
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target.result);
        setProfileForm(prev => ({
          ...prev,
          avatar: event.target.result
        }));
        setErrors(prev => ({
          ...prev,
          avatar: ''
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate profile form
  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!profileForm.name.trim()) {
      newErrors.name = '请输入您的姓名';
    }
    
    if (!profileForm.phone.trim()) {
      newErrors.phone = '请输入您的手机号码';
    } else if (!/^1[3-9]\d{9}$/.test(profileForm.phone)) {
      newErrors.phone = '请输入有效的手机号码';
    }
    
    if (profileForm.email.trim() && !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(profileForm.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save profile changes
  const saveProfileChanges = () => {
    if (validateProfileForm()) {
      // Save to localStorage
      localStorage.setItem('userProfile', JSON.stringify(profileForm));
      
      // Update user info in auth context if available
      if (updateUserInfo) {
        updateUserInfo({
          ...userInfo,
          username: profileForm.name,
          phone: profileForm.phone
        });
      }
      
      setIsEditing(false);
      
      // Show success message
      setSuccessMessage('个人信息更新成功！');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  // Cancel profile editing
  const cancelProfileEditing = () => {
    setIsEditing(false);
    loadUserProfile();
    setErrors({});
  };

  // Handle password form input change
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate password form
  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = '请输入当前密码';
    }
    
    if (!passwordForm.newPassword) {
      newErrors.newPassword = '请输入新密码';
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = '新密码长度至少为6位';
    } else if (passwordForm.newPassword === passwordForm.currentPassword) {
      newErrors.newPassword = '新密码不能与当前密码相同';
    }
    
    if (!passwordForm.confirmNewPassword) {
      newErrors.confirmNewPassword = '请确认新密码';
    } else if (passwordForm.confirmNewPassword !== passwordForm.newPassword) {
      newErrors.confirmNewPassword = '两次输入的新密码不一致';
    }
    
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Change password
  const changePassword = () => {
    if (validatePasswordForm()) {
      // In a real application, this would send a request to the server
      // For demo purposes, we'll just clear the form and show a success message
      
      // Reset password form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setPasswordErrors({});
      setShowChangePasswordModal(false);
      
      // Show success message
      setSuccessMessage('密码修改成功！');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  // Set default delivery address
  const setDefaultDeliveryAddress = (addressId) => {
    setProfileForm(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        default_delivery_address: addressId
      }
    }));
    
    // Save to localStorage
    const updatedProfile = {
      ...profileForm,
      preferences: {
        ...profileForm.preferences,
        default_delivery_address: addressId
      }
    };
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    
    // Show success message
    setSuccessMessage('默认收货地址设置成功！');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Navigate to address management
  const navigateToAddressManagement = () => {
    navigate('/user/addresses');
  };

  // Format gender display
  const formatGender = (gender) => {
    switch (gender) {
      case 'male':
        return '男';
      case 'female':
        return '女';
      default:
        return '未设置';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">个人中心</h1>
        {isLoggedIn && (
          <button 
            className="btn btn-primary"
            onClick={navigateToAddressManagement}
          >
            <i className="fa fa-map-marker-alt mr-2"></i>
            管理收货地址
          </button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="fa fa-check-circle text-lg"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center">
          {/* Avatar Section */}
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="用户头像" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <i className="fa fa-user text-4xl text-gray-400"></i>
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <label htmlFor="avatar-upload" className="text-white cursor-pointer">
                    <i className="fa fa-camera"></i>
                  </label>
                </div>
              )}
            </div>
            {errors.avatar && (
              <p className="mt-2 text-sm text-danger text-center">{errors.avatar}</p>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                {isEditing ? (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      姓名
                      <span className="text-danger ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.name ? 'border-danger' : 'border-gray-300'}`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-danger">{errors.name}</p>}
                  </div>
                ) : (
                  <h2 className="text-xl font-bold text-gray-900">{profileForm.name}</h2>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-4">
                  <div>
                    {isEditing ? (
                      <>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          手机号码
                          <span className="text-danger ml-1">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={profileForm.phone}
                          onChange={handleProfileInputChange}
                          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.phone ? 'border-danger' : 'border-gray-300'}`}
                        />
                        {errors.phone && <p className="mt-1 text-sm text-danger">{errors.phone}</p>}
                      </>
                    ) : (
                      <div className="flex items-center">
                        <i className="fa fa-phone-alt text-gray-400 mr-2"></i>
                        <span className="text-gray-700">{profileForm.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    {isEditing ? (
                      <>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          邮箱（选填）
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileForm.email}
                          onChange={handleProfileInputChange}
                          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.email ? 'border-danger' : 'border-gray-300'}`}
                        />
                        {errors.email && <p className="mt-1 text-sm text-danger">{errors.email}</p>}
                      </>
                    ) : (
                      <div className="flex items-center">
                        <i className="fa fa-envelope text-gray-400 mr-2"></i>
                        <span className="text-gray-700">{profileForm.email || '未设置'}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    {isEditing ? (
                      <>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          性别（选填）
                        </label>
                        <select
                          name="gender"
                          value={profileForm.gender}
                          onChange={handleProfileInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option value="">请选择</option>
                          <option value="male">男</option>
                          <option value="female">女</option>
                        </select>
                      </>
                    ) : (
                      <div className="flex items-center">
                        <i className="fa fa-venus-mars text-gray-400 mr-2"></i>
                        <span className="text-gray-700">{formatGender(profileForm.gender)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    {isEditing ? (
                      <>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          出生日期（选填）
                        </label>
                        <input
                          type="date"
                          name="birthday"
                          value={profileForm.birthday}
                          onChange={handleProfileInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </>
                    ) : (
                      <div className="flex items-center">
                        <i className="fa fa-calendar-alt text-gray-400 mr-2"></i>
                        <span className="text-gray-700">{profileForm.birthday || '未设置'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {isLoggedIn && isEditing ? (
                  <>
                    <button 
                      className="btn btn-white border border-gray-300"
                      onClick={cancelProfileEditing}
                    >
                      取消
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={saveProfileChanges}
                    >
                      保存
                    </button>
                  </>
                ) : (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="fa fa-edit mr-1"></i>
                    编辑资料
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Default Delivery Address */}
      {isLoggedIn && addresses.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">默认收货地址</h3>
          <div className="border border-gray-200 rounded-lg p-4">
            {addresses.map(address => (
              <div key={address.id} className={`flex items-center mb-2 last:mb-0 ${profileForm.preferences.default_delivery_address === address.id ? 'bg-primary/5 border border-primary' : 'bg-white'} p-3 rounded-lg cursor-pointer`} onClick={() => setDefaultDeliveryAddress(address.id)}>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">{address.name}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-gray-700">{address.phone}</span>
                    {profileForm.preferences.default_delivery_address === address.id && (
                      <span className="ml-2 text-xs px-2 py-0.5 bg-primary text-white rounded-full">默认</span>
                    )}
                    {address.label && (
                      <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full">{address.label}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {address.province} {address.city} {address.district} {address.address} {address.zipCode}
                  </p>
                </div>
                {profileForm.preferences.default_delivery_address === address.id && (
                  <div className="text-primary">
                    <i className="fa fa-check-circle"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preferences */}
      {isLoggedIn && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">通知偏好</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <i className="fa fa-box-open text-gray-400 mr-3"></i>
                <span className="text-gray-700">订单状态通知</span>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileForm.preferences.notification.order_status}
                  onChange={(e) => handlePreferencesChange('notification', 'order_status', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <i className="fa fa-tags text-gray-400 mr-3"></i>
                <span className="text-gray-700">促销活动通知</span>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileForm.preferences.notification.promotions}
                  onChange={(e) => handlePreferencesChange('notification', 'promotions', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <i className="fa fa-shopping-bag text-gray-400 mr-3"></i>
                <span className="text-gray-700">新品上架通知</span>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileForm.preferences.notification.new_products}
                  onChange={(e) => handlePreferencesChange('notification', 'new_products', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {isLoggedIn && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">安全设置</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <i className="fa fa-lock text-gray-400 mr-3"></i>
                <span className="text-gray-700">修改密码</span>
              </div>
              <button 
                className="text-primary hover:text-primary/80"
                onClick={() => setShowChangePasswordModal(true)}
              >
                修改
                <i className="fa fa-chevron-right ml-1 text-xs"></i>
              </button>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <i className="fa fa-shield-alt text-gray-400 mr-3"></i>
                <span className="text-gray-700">账号安全等级</span>
              </div>
              <div className="flex items-center">
                <div className="text-sm text-success font-medium">中等</div>
                <div className="ml-2 h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-success rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">修改密码</h3>
                <button 
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setShowChangePasswordModal(false)}
                >
                  <i className="fa fa-times text-lg"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form>
                {/* Current Password */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    当前密码
                    <span className="text-danger ml-1">*</span>
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="请输入当前密码"
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${passwordErrors.currentPassword ? 'border-danger' : 'border-gray-300'}`}
                  />
                  {passwordErrors.currentPassword && <p className="mt-1 text-sm text-danger">{passwordErrors.currentPassword}</p>}
                </div>
                
                {/* New Password */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    新密码
                    <span className="text-danger ml-1">*</span>
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="请输入新密码（至少6位）"
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${passwordErrors.newPassword ? 'border-danger' : 'border-gray-300'}`}
                  />
                  {passwordErrors.newPassword && <p className="mt-1 text-sm text-danger">{passwordErrors.newPassword}</p>}
                </div>
                
                {/* Confirm New Password */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    确认新密码
                    <span className="text-danger ml-1">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={passwordForm.confirmNewPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="请再次输入新密码"
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${passwordErrors.confirmNewPassword ? 'border-danger' : 'border-gray-300'}`}
                  />
                  {passwordErrors.confirmNewPassword && <p className="mt-1 text-sm text-danger">{passwordErrors.confirmNewPassword}</p>}
                </div>
                
                {/* Actions */}
                <div className="flex space-x-4">
                  <button 
                    type="button"
                    className="btn btn-white border border-gray-300 flex-1 py-2.5"
                    onClick={() => setShowChangePasswordModal(false)}
                  >
                    取消
                  </button>
                  <button 
                    type="button"
                    className="btn btn-primary flex-1 py-2.5"
                    onClick={changePassword}
                  >
                    确认修改
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

export default UserProfilePage;