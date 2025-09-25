import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PermissionManagementPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, hasPermission } = useAuth();
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [activeTab, setActiveTab] = useState('roles'); // 'roles' or 'users'

  // Form states
  const [roleFormData, setRoleFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });
  const [userFormData, setUserFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});

  // Available permissions
  const availablePermissions = [
    { id: 'dashboard_view', name: '查看仪表盘', category: '基础权限' },
    { id: 'product_view', name: '查看商品', category: '商品管理' },
    { id: 'product_create', name: '创建商品', category: '商品管理' },
    { id: 'product_edit', name: '编辑商品', category: '商品管理' },
    { id: 'product_delete', name: '删除商品', category: '商品管理' },
    { id: 'order_view', name: '查看订单', category: '订单管理' },
    { id: 'order_process', name: '处理订单', category: '订单管理' },
    { id: 'order_refund', name: '处理退款', category: '订单管理' },
    { id: 'inventory_view', name: '查看库存', category: '库存管理' },
    { id: 'inventory_adjust', name: '调整库存', category: '库存管理' },
    { id: 'analytics_view', name: '查看数据分析', category: '数据分析' },
    { id: 'message_center_view', name: '查看消息中心', category: '消息中心' },
    { id: 'user_management_view', name: '查看用户管理', category: '系统管理' },
    { id: 'role_management_view', name: '查看角色管理', category: '系统管理' },
    { id: 'system_config', name: '系统配置', category: '系统管理' },
    { id: 'admin_access', name: '管理员访问权限', category: '系统管理' }
  ];

  // Load roles and users
  useEffect(() => {
    if (!isAuthenticated || !hasPermission('role_management_view') || !hasPermission('admin_access')) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        // 从API获取用户数据（这里使用模拟数据，因为apiService.js中没有明确的用户管理API）
        // 在实际项目中，应该调用真实的API
        
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 准备模拟的角色数据
        const systemRoles = [
          {
            id: 'admin',
            name: '超级管理员',
            description: '系统最高权限管理员',
            permissions: availablePermissions.map(p => p.id),
            isDefault: true
          },
          {
            id: 'store_manager',
            name: '门店经理',
            description: '负责门店日常运营管理',
            permissions: [
              'dashboard_view', 'product_view', 'product_edit', 
              'order_view', 'order_process', 'inventory_view', 
              'analytics_view', 'message_center_view'
            ],
            isDefault: true
          },
          {
            id: 'inventory_clerk',
            name: '库存管理员',
            description: '负责库存管理和盘点',
            permissions: [
              'product_view', 'inventory_view', 'inventory_adjust',
              'message_center_view'
            ],
            isDefault: true
          },
          {
            id: 'cashier',
            name: '收银员',
            description: '负责收银和订单处理',
            permissions: [
              'order_view', 'order_process', 'message_center_view'
            ],
            isDefault: true
          }
        ];
        
        // 准备模拟的用户数据
        const systemUsers = [
          {
            id: 'admin',
            username: 'admin',
            email: 'admin@example.com',
            role: 'admin',
            isActive: true,
            lastLogin: new Date().toISOString(),
            createdAt: new Date().toISOString()
          },
          {
            id: 'manager1',
            username: 'manager1',
            email: 'manager1@example.com',
            role: 'store_manager',
            isActive: true,
            lastLogin: new Date(Date.now() - 86400000).toISOString(),
            createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
          },
          {
            id: 'inventory1',
            username: 'inventory1',
            email: 'inventory1@example.com',
            role: 'inventory_clerk',
            isActive: true,
            lastLogin: new Date(Date.now() - 2 * 86400000).toISOString(),
            createdAt: new Date(Date.now() - 14 * 86400000).toISOString()
          },
          {
            id: 'cashier1',
            username: 'cashier1',
            email: 'cashier1@example.com',
            role: 'cashier',
            isActive: true,
            lastLogin: new Date(Date.now() - 4 * 86400000).toISOString(),
            createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
          }
        ];
        
        setRoles(systemRoles);
        setUsers(systemUsers);
      } catch (error) {
        console.error('加载数据失败:', error);
        // 在实际项目中，应该显示错误消息给用户
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, hasPermission, navigate]);

  // Handle role form input change
  const handleRoleInputChange = (e) => {
    const { name, value } = e.target;
    setRoleFormData(prev => ({
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

  // Handle permission toggle
  const handlePermissionToggle = (permissionId) => {
    setRoleFormData(prev => {
      if (prev.permissions.includes(permissionId)) {
        return {
          ...prev,
          permissions: prev.permissions.filter(p => p !== permissionId)
        };
      } else {
        return {
          ...prev,
          permissions: [...prev.permissions, permissionId]
        };
      }
    });
  };

  // Handle user form input change
  const handleUserInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserFormData(prev => ({
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

  // Validate role form
  const validateRoleForm = () => {
    const newErrors = {};
    
    if (!roleFormData.name.trim()) {
      newErrors.name = '请输入角色名称';
    } else {
      // Check if role name already exists (except when editing)
      const nameExists = roles.some(role => 
        role.name === roleFormData.name && role.id !== editingRole?.id
      );
      if (nameExists) {
        newErrors.name = '角色名称已存在';
      }
    }
    
    if (!roleFormData.description.trim()) {
      newErrors.description = '请输入角色描述';
    }
    
    if (roleFormData.permissions.length === 0) {
      newErrors.permissions = '请至少选择一项权限';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate user form
  const validateUserForm = () => {
    const newErrors = {};
    
    if (!userFormData.username.trim()) {
      newErrors.username = '请输入用户名';
    } else {
      // Check if username already exists (except when editing)
      const usernameExists = users.some(user => 
        user.username === userFormData.username && user.id !== editingUser?.id
      );
      if (usernameExists) {
        newErrors.username = '用户名已存在';
      }
    }
    
    // Email validation
    if (!userFormData.email.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else {
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailRegex.test(userFormData.email)) {
        newErrors.email = '请输入正确的邮箱地址';
      } else {
        // Check if email already exists (except when editing)
        const emailExists = users.some(user => 
          user.email === userFormData.email && user.id !== editingUser?.id
        );
        if (emailExists) {
          newErrors.email = '邮箱地址已被使用';
        }
      }
    }
    
    // Password is required only when adding a new user
    if (!editingUser && !userFormData.password) {
      newErrors.password = '请输入密码';
    } else if (userFormData.password && userFormData.password.length < 6) {
      newErrors.password = '密码长度至少为6位';
    }
    
    if (!userFormData.role) {
      newErrors.role = '请选择用户角色';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle add role
  const handleAddRole = () => {
    if (validateRoleForm()) {
      const newRole = {
        id: `role_${Date.now()}`,
        ...roleFormData,
        isDefault: false
      };
      
      const updatedRoles = [...roles, newRole];
      setRoles(updatedRoles);
      localStorage.setItem('systemRoles', JSON.stringify(updatedRoles));
      
      // Reset form and close modal
      resetRoleForm();
    }
  };

  // Handle edit role
  const handleEditRole = () => {
    if (validateRoleForm() && editingRole) {
      // Check if this is a default role and prevent certain changes
      if (editingRole.isDefault && roleFormData.name !== editingRole.name) {
        setErrors({ name: '默认角色名称不能修改' });
        return;
      }
      
      const updatedRoles = roles.map(role => 
        role.id === editingRole.id ? { ...role, ...roleFormData } : role
      );
      
      setRoles(updatedRoles);
      localStorage.setItem('systemRoles', JSON.stringify(updatedRoles));
      
      // Reset form and close modal
      resetRoleForm();
    }
  };

  // Handle delete role
  const handleDeleteRole = (roleId) => {
    // Check if this role is assigned to any users
    const roleInUse = users.some(user => user.role === roleId);
    if (roleInUse) {
      alert('该角色已分配给用户，无法删除。请先将用户角色更改为其他角色。');
      setShowDeleteConfirm(null);
      return;
    }
    
    const updatedRoles = roles.filter(role => role.id !== roleId);
    setRoles(updatedRoles);
    localStorage.setItem('systemRoles', JSON.stringify(updatedRoles));
    setShowDeleteConfirm(null);
  };

  // Handle add user
  const handleAddUser = () => {
    if (validateUserForm()) {
      const newUser = {
        id: `user_${Date.now()}`,
        ...userFormData,
        password: userFormData.password, // In a real app, this would be hashed
        createdAt: new Date().toISOString(),
        lastLogin: null
      };
      
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
      
      // Reset form and close modal
      resetUserForm();
    }
  };

  // Handle edit user
  const handleEditUser = () => {
    if (validateUserForm() && editingUser) {
      // Don't update password if not provided
      const userDataToUpdate = {
        ...userFormData
      };
      if (!userDataToUpdate.password) {
        delete userDataToUpdate.password;
      }
      
      const updatedUsers = users.map(user => 
        user.id === editingUser.id ? { ...user, ...userDataToUpdate } : user
      );
      
      setUsers(updatedUsers);
      localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
      
      // Reset form and close modal
      resetUserForm();
    }
  };

  // Handle delete user
  const handleDeleteUser = (userId) => {
    // Prevent deleting the currently logged-in user
    if (currentUser?.id === userId) {
      alert('您不能删除当前登录的用户。');
      setShowDeleteConfirm(null);
      return;
    }
    
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
    setShowDeleteConfirm(null);
  };

  // Handle toggle user active status
  const handleToggleUserStatus = (userId) => {
    // Prevent deactivating the currently logged-in user
    if (currentUser?.id === userId) {
      alert('您不能停用当前登录的用户。');
      return;
    }
    
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
  };

  // Reset role form and modal states
  const resetRoleForm = () => {
    setRoleFormData({
      name: '',
      description: '',
      permissions: []
    });
    setErrors({});
    setEditingRole(null);
    setShowAddRoleModal(false);
  };

  // Reset user form and modal states
  const resetUserForm = () => {
    setUserFormData({
      username: '',
      password: '',
      email: '',
      role: '',
      isActive: true
    });
    setErrors({});
    setEditingUser(null);
  };

  // Open add role modal
  const openAddRoleModal = () => {
    resetRoleForm();
    setShowAddRoleModal(true);
  };

  // Open edit role modal
  const openEditRoleModal = (role) => {
    setRoleFormData({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions]
    });
    setEditingRole(role);
    setShowAddRoleModal(true);
  };

  // Open edit user modal
  const openEditUserModal = (user) => {
    setUserFormData({
      username: user.username,
      password: '', // Don't populate password
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    setEditingUser(user);
  };

  // Get role name by ID
  const getRoleNameById = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : '未知角色';
  };

  // Group permissions by category
  const groupedPermissions = availablePermissions.reduce((groups, permission) => {
    const category = permission.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(permission);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">加载权限数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">权限管理</h1>
          <p className="text-gray-500 mt-1">管理系统角色和用户权限</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'roles' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('roles')}
          >
            角色管理
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('users')}
          >
            用户管理
          </button>
        </div>
      </div>

      {/* Role Management */}
      {activeTab === 'roles' && (
        <div>
          {/* Add Role Button */}
          <div className="flex justify-end mb-6">
            <button 
              className="btn btn-primary"
              onClick={openAddRoleModal}
            >
              <i className="fa fa-plus mr-2"></i>
              添加角色
            </button>
          </div>

          {/* Role List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      角色名称
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      描述
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      权限数量
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      类型
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {roles.map((role) => (
                    <tr key={role.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{role.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs">{role.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{role.permissions.length}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${role.isDefault ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {role.isDefault ? '默认角色' : '自定义角色'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-primary hover:text-primary/80 mr-4"
                          onClick={() => openEditRoleModal(role)}
                        >
                          编辑
                        </button>
                        {!role.isDefault && (
                          <button 
                            className="text-danger hover:text-danger/80"
                            onClick={() => setShowDeleteConfirm({ type: 'role', id: role.id })}
                          >
                            删除
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* User Management */}
      {activeTab === 'users' && (
        <div>
          {/* Add User Button */}
          <div className="flex justify-end mb-6">
            <button 
              className="btn btn-primary"
              onClick={openEditUserModal.bind(null, null)}
            >
              <i className="fa fa-plus mr-2"></i>
              添加用户
            </button>
          </div>

          {/* User List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      用户名
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      邮箱
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      角色
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      上次登录
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((usr) => (
                    <tr key={usr.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{usr.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{usr.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getRoleNameById(usr.role)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${usr.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {usr.isActive ? '活跃' : '禁用'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {usr.lastLogin ? new Date(usr.lastLogin).toLocaleString('zh-CN') : '从未登录'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-primary hover:text-primary/80 mr-4"
                          onClick={() => openEditUserModal(usr)}
                        >
                          编辑
                        </button>
                        <button 
                          className={`${usr.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'} mr-4`}
                          onClick={() => handleToggleUserStatus(usr.id)}
                        >
                          {usr.isActive ? '禁用' : '启用'}
                        </button>
                        <button 
                          className="text-danger hover:text-danger/80"
                          onClick={() => setShowDeleteConfirm({ type: 'user', id: usr.id })}
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
        </div>
      )}

      {/* Add/Edit Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingRole ? '编辑角色' : '添加新角色'}
                </h3>
                <button 
                  className="text-gray-400 hover:text-gray-500"
                  onClick={resetRoleForm}
                >
                  <i className="fa fa-times text-lg"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form>
                {/* Role Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    角色名称
                    <span className="text-danger ml-1">*</span>
                    {editingRole?.isDefault && (
                      <span className="ml-2 text-xs text-gray-500">(默认角色名称不可修改)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={roleFormData.name}
                    onChange={handleRoleInputChange}
                    disabled={editingRole?.isDefault}
                    placeholder="请输入角色名称"
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.name ? 'border-danger' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-danger">{errors.name}</p>}
                </div>
                
                {/* Role Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    角色描述
                    <span className="text-danger ml-1">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={roleFormData.description}
                    onChange={handleRoleInputChange}
                    placeholder="请输入角色描述信息"
                    rows={3}
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none ${errors.description ? 'border-danger' : 'border-gray-300'}`}
                  />
                  {errors.description && <p className="mt-1 text-sm text-danger">{errors.description}</p>}
                </div>
                
                {/* Permissions */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    角色权限
                    <span className="text-danger ml-1">*</span>
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                      <div key={category} className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">{category}</h4>
                        <div className="space-y-2">
                          {categoryPermissions.map((permission) => (
                            <div key={permission.id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`permission-${permission.id}`}
                                checked={roleFormData.permissions.includes(permission.id)}
                                onChange={() => handlePermissionToggle(permission.id)}
                                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                              />
                              <label 
                                htmlFor={`permission-${permission.id}`} 
                                className="ml-2 block text-sm text-gray-700 cursor-pointer"
                              >
                                {permission.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.permissions && <p className="mt-3 text-sm text-danger">{errors.permissions}</p>}
                </div>
                
                {/* Actions */}
                <div className="flex space-x-4">
                  <button 
                    type="button"
                    className="btn btn-white border border-gray-300 flex-1 py-2.5"
                    onClick={resetRoleForm}
                  >
                    取消
                  </button>
                  <button 
                    type="button"
                    className="btn btn-primary flex-1 py-2.5"
                    onClick={editingRole ? handleEditRole : handleAddRole}
                  >
                    {editingRole ? '更新' : '保存'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit User Modal */}
      {editingUser !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingUser === null ? '添加新用户' : '编辑用户'}
                </h3>
                <button 
                  className="text-gray-400 hover:text-gray-500"
                  onClick={resetUserForm}
                >
                  <i className="fa fa-times text-lg"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form>
                {/* Username */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    用户名
                    <span className="text-danger ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={userFormData.username}
                    onChange={handleUserInputChange}
                    placeholder="请输入用户名"
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.username ? 'border-danger' : 'border-gray-300'}`}
                  />
                  {errors.username && <p className="mt-1 text-sm text-danger">{errors.username}</p>}
                </div>
                
                {/* Email */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    邮箱地址
                    <span className="text-danger ml-1">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userFormData.email}
                    onChange={handleUserInputChange}
                    placeholder="请输入邮箱地址"
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.email ? 'border-danger' : 'border-gray-300'}`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-danger">{errors.email}</p>}
                </div>
                
                {/* Password */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    密码
                    {editingUser === null && (
                      <span className="text-danger ml-1">*</span>
                    )}
                    {editingUser !== null && (
                      <span className="ml-2 text-xs text-gray-500">(留空表示不修改密码)</span>
                    )}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={userFormData.password}
                    onChange={handleUserInputChange}
                    placeholder={editingUser === null ? "请输入至少6位密码" : "留空表示不修改密码"}
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.password ? 'border-danger' : 'border-gray-300'}`}
                  />
                  {errors.password && <p className="mt-1 text-sm text-danger">{errors.password}</p>}
                </div>
                
                {/* Role */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    用户角色
                    <span className="text-danger ml-1">*</span>
                  </label>
                  <select
                    name="role"
                    value={userFormData.role}
                    onChange={handleUserInputChange}
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${errors.role ? 'border-danger' : 'border-gray-300'}`}
                  >
                    <option value="">请选择角色</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                  {errors.role && <p className="mt-1 text-sm text-danger">{errors.role}</p>}
                </div>
                
                {/* Active Status */}
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="userIsActive"
                    name="isActive"
                    checked={userFormData.isActive}
                    onChange={handleUserInputChange}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="userIsActive" className="ml-2 block text-sm text-gray-700">
                    账号启用
                  </label>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-4">
                  <button 
                    type="button"
                    className="btn btn-white border border-gray-300 flex-1 py-2.5"
                    onClick={resetUserForm}
                  >
                    取消
                  </button>
                  <button 
                    type="button"
                    className="btn btn-primary flex-1 py-2.5"
                    onClick={editingUser === null ? handleAddUser : handleEditUser}
                  >
                    {editingUser === null ? '保存' : '更新'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
                  {showDeleteConfirm.type === 'role' 
                    ? '您确定要删除此角色吗？删除后将无法恢复。' 
                    : '您确定要删除此用户吗？删除后将无法恢复。'}
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
                  onClick={() => 
                    showDeleteConfirm.type === 'role' 
                      ? handleDeleteRole(showDeleteConfirm.id) 
                      : handleDeleteUser(showDeleteConfirm.id)
                  }
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

export default PermissionManagementPage;