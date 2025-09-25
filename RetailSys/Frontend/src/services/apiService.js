// API服务，使用axios实现，保持原有接口不变

import axios from 'axios';

// 创建axios实例，设置基础URL
const api = axios.create({
  baseURL: '/api', // 基础API路径，将通过Vite代理转发到后端
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器，添加认证token
api.interceptors.request.use(
  (config) => {
    // 从localStorage或其他地方获取token
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器，处理错误
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 统一错误处理
    if (error.response && error.response.status === 401) {
      // 未授权，清除token并跳转到登录页
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    console.error('API响应错误:', error);
    throw error;
  }
);

// 商品管理API
export const productApi = {
  // 获取商品列表
  getProducts: async (offset = 0, limit = 10, name = '', categoryId = null) => {
    try {
      const params = {};
      if (offset > 0) params.offset = offset;
      if (limit > 0) params.limit = limit;
      if (name) params.name = name;
      if (categoryId !== null) params.categoryId = categoryId;
      
      return await api.get('/products', { params });
    } catch (error) {
      console.error('获取商品列表失败:', error);
      throw error;
    }
  },

  // 获取单个商品详情
  getProductById: async (productId) => {
    try {
      return await api.get(`/products/${productId}`);
    } catch (error) {
      console.error(`获取商品ID: ${productId} 详情失败:`, error);
      throw error;
    }
  },

  // 创建商品
  createProduct: async (productData) => {
    try {
      return await api.post('/products', productData);
    } catch (error) {
      console.error('创建商品失败:', error);
      throw error;
    }
  },

  // 更新商品
  updateProduct: async (productId, productData) => {
    try {
      return await api.put(`/products/${productId}`, productData);
    } catch (error) {
      console.error(`更新商品ID: ${productId} 失败:`, error);
      throw error;
    }
  },

  // 删除商品
  deleteProduct: async (productId) => {
    try {
      return await api.delete(`/products/${productId}`);
    } catch (error) {
      console.error(`删除商品ID: ${productId} 失败:`, error);
      throw error;
    }
  }
};

// 类别管理API
export const categoryApi = {
  // 获取类别列表
  getCategories: async () => {
    try {
      return await api.get('/categories');
    } catch (error) {
      console.error('获取类别列表失败:', error);
      throw error;
    }
  },

  // 获取单个类别详情
  getCategoryById: async (categoryId) => {
    try {
      return await api.get(`/categories/${categoryId}`);
    } catch (error) {
      console.error(`获取类别ID: ${categoryId} 详情失败:`, error);
      throw error;
    }
  },

  // 创建类别
  createCategory: async (categoryData) => {
    try {
      return await api.post('/categories', categoryData);
    } catch (error) {
      console.error('创建类别失败:', error);
      throw error;
    }
  },

  // 更新类别
  updateCategory: async (categoryId, categoryData) => {
    try {
      return await api.put(`/categories/${categoryId}`, categoryData);
    } catch (error) {
      console.error(`更新类别ID: ${categoryId} 失败:`, error);
      throw error;
    }
  },

  // 删除类别
  deleteCategory: async (categoryId) => {
    try {
      return await api.delete(`/categories/${categoryId}`);
    } catch (error) {
      console.error(`删除类别ID: ${categoryId} 失败:`, error);
      throw error;
    }
  }
};

// 认证相关API
export const authApi = {
  // 登录，支持管理用户和普通用户
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // 保存token到localStorage
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      return response;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  // 注册
  register: async (userData) => {
    try {
      return await api.post('/auth/register', userData);
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  },

  // 微信登录
  wechatLogin: async (code) => {
    try {
      const response = await api.post('/auth/wechat', { code });
      // 保存token到localStorage
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      return response;
    } catch (error) {
      console.error('微信登录失败:', error);
      throw error;
    }
  },

  // 登出
  logout: async () => {
    try {
      // 清除localStorage中的token
      localStorage.removeItem('authToken');
      return await api.post('/auth/logout');
    } catch (error) {
      console.error('登出失败:', error);
      // 即使API调用失败，也要清除token
      localStorage.removeItem('authToken');
      throw error;
    }
  },

  // 获取当前用户信息
  getCurrentUser: async () => {
    try {
      return await api.get('/auth/me');
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  }
};

// 订单管理API
export const orderApi = {
  // 获取订单列表（管理端）
  getOrders: async (offset = 0, limit = 10, status = '', userId = '') => {
    try {
      const params = {};
      if (offset > 0) params.offset = offset;
      if (limit > 0) params.limit = limit;
      if (status) params.status = status;
      if (userId) params.user_id = userId;
      
      return await api.get('/orders', { params });
    } catch (error) {
      console.error('获取订单列表失败:', error);
      throw error;
    }
  },
  
  // 获取单个订单详情
  getOrderById: async (orderId) => {
    try {
      return await api.get(`/orders/${orderId}`);
    } catch (error) {
      console.error(`获取订单ID: ${orderId} 详情失败:`, error);
      throw error;
    }
  },
  
  // 更新订单状态
  updateOrderStatus: async (orderId, status) => {
    try {
      const params = { status };
      return await api.put(`/orders/${orderId}/status`, params);
    } catch (error) {
      console.error(`更新订单ID: ${orderId} 状态失败:`, error);
      throw error;
    }
  },
  
  // 取消订单
  cancelOrder: async (orderId) => {
    try {
      return await api.delete(`/orders/${orderId}`);
    } catch (error) {
      console.error(`取消订单ID: ${orderId} 失败:`, error);
      throw error;
    }
  }
};

// 地址管理API
export const addressApi = {
  // 获取用户地址列表
  getAddresses: async () => {
    try {
      return await api.get('/addresses');
    } catch (error) {
      console.error('获取地址列表失败:', error);
      throw error;
    }
  },

  // 获取单个地址详情
  getAddressById: async (addressId) => {
    try {
      return await api.get(`/addresses/${addressId}`);
    } catch (error) {
      console.error(`获取地址ID: ${addressId} 详情失败:`, error);
      throw error;
    }
  },

  // 创建新地址
  createAddress: async (addressData) => {
    try {
      return await api.post('/addresses', addressData);
    } catch (error) {
      console.error('创建地址失败:', error);
      throw error;
    }
  },

  // 更新地址
  updateAddress: async (addressId, addressData) => {
    try {
      return await api.put(`/addresses/${addressId}`, addressData);
    } catch (error) {
      console.error(`更新地址ID: ${addressId} 失败:`, error);
      throw error;
    }
  },

  // 删除地址
  deleteAddress: async (addressId) => {
    try {
      return await api.delete(`/addresses/${addressId}`);
    } catch (error) {
      console.error(`删除地址ID: ${addressId} 失败:`, error);
      throw error;
    }
  },

  // 设置默认地址
  setDefaultAddress: async (addressId) => {
    try {
      return await api.put(`/addresses/${addressId}/default`);
    } catch (error) {
      console.error(`设置默认地址ID: ${addressId} 失败:`, error);
      throw error;
    }
  }
};

// 购物车管理API
export const shoppingCartApi = {
  // 获取购物车列表
  getShoppingCarts: async (params = {}) => {
    try {
      return await api.get('/shoppingCart', { params });
    } catch (error) {
      console.error('获取购物车列表失败:', error);
      throw error;
    }
  },

  // 获取单个购物车项
  getShoppingCartById: async (id) => {
    try {
      return await api.get(`/shoppingCart/${id}`);
    } catch (error) {
      console.error('获取购物车项失败:', error);
      throw error;
    }
  },

  // 添加商品到购物车
  addToShoppingCart: async (cartData) => {
    try {
      return await api.post('/shoppingCart', cartData);
    } catch (error) {
      console.error('添加商品到购物车失败:', error);
      throw error;
    }
  },

  // 更新购物车商品
  updateShoppingCart: async (cartData) => {
    try {
      return await api.put('/shoppingCart', cartData);
    } catch (error) {
      console.error('更新购物车商品失败:', error);
      throw error;
    }
  },

  // 从购物车删除商品
  deleteFromShoppingCart: async (id) => {
    try {
      return await api.delete('/shoppingCart', { params: { id } });
    } catch (error) {
      console.error('从购物车删除商品失败:', error);
      throw error;
    }
  },
};

// 用户管理API
export const usersApi = {
  // 获取用户列表
  getUsers: async (params = {}) => {
    try {
      return await api.get('/users', { params });
    } catch (error) {
      console.error('获取用户列表失败:', error);
      throw error;
    }
  },

  // 获取单个用户详情
  getUserById: async (id) => {
    try {
      return await api.get(`/users/${id}`);
    } catch (error) {
      console.error('获取用户详情失败:', error);
      throw error;
    }
  },

  // 创建新用户
  createUser: async (userData) => {
    try {
      return await api.post('/users', userData);
    } catch (error) {
      console.error('创建用户失败:', error);
      throw error;
    }
  },

  // 更新用户
  updateUser: async (userData) => {
    try {
      return await api.put('/users', userData);
    } catch (error) {
      console.error('更新用户失败:', error);
      throw error;
    }
  },

  // 删除用户
  deleteUser: async (id) => {
    try {
      return await api.delete('/users', { params: { id } });
    } catch (error) {
      console.error('删除用户失败:', error);
      throw error;
    }
  },
};

// 优惠管理API
export const discountsApi = {
  // 获取优惠列表
  getDiscounts: async (params = {}) => {
    try {
      return await api.get('/discounts', { params });
    } catch (error) {
      console.error('获取优惠列表失败:', error);
      throw error;
    }
  },

  // 获取单个优惠详情
  getDiscountById: async (id) => {
    try {
      return await api.get(`/discounts/${id}`);
    } catch (error) {
      console.error('获取优惠详情失败:', error);
      throw error;
    }
  },

  // 创建新的优惠
  createDiscount: async (discountData) => {
    try {
      return await api.post('/discounts', discountData);
    } catch (error) {
      console.error('创建优惠失败:', error);
      throw error;
    }
  },

  // 更新优惠
  updateDiscount: async (discountData) => {
    try {
      return await api.put('/discounts', discountData);
    } catch (error) {
      console.error('更新优惠失败:', error);
      throw error;
    }
  },

  // 删除优惠
  deleteDiscount: async (id) => {
    try {
      return await api.delete('/discounts', { params: { id } });
    } catch (error) {
      console.error('删除优惠失败:', error);
      throw error;
    }
  },
};

// 消息管理API
export const messagesApi = {
  // 获取消息列表
  getMessages: async (params = {}) => {
    try {
      return await api.get('/messages', { params });
    } catch (error) {
      console.error('获取消息列表失败:', error);
      throw error;
    }
  },

  // 获取单个消息详情
  getMessageById: async (id) => {
    try {
      return await api.get(`/messages/${id}`);
    } catch (error) {
      console.error('获取消息详情失败:', error);
      throw error;
    }
  },

  // 创建新消息
  createMessage: async (messageData) => {
    try {
      return await api.post('/messages', messageData);
    } catch (error) {
      console.error('创建消息失败:', error);
      throw error;
    }
  },

  // 更新消息 - 支持两种调用方式：(id, data) 或 (messageData)
  updateMessage: async (id, data) => {
    try {
      // 如果只有一个参数，假设是完整的消息对象
      if (arguments.length === 1) {
        return await api.put('/messages', id);
      }
      // 如果有两个参数，第一个是ID，第二个是要更新的数据
      return await api.put(`/messages/${id}`, data);
    } catch (error) {
      console.error('更新消息失败:', error);
      throw error;
    }
  },

  // 删除消息
  deleteMessage: async (id) => {
    try {
      return await api.delete(`/messages/${id}`);
    } catch (error) {
      console.error('删除消息失败:', error);
      throw error;
    }
  },

  // 标记所有消息为已读
  markAllAsRead: async () => {
    try {
      return await api.put('/messages/mark-all-read');
    } catch (error) {
      console.error('标记所有消息为已读失败:', error);
      throw error;
    }
  },

  // 删除所有消息
  deleteAllMessages: async () => {
    try {
      return await api.delete('/messages/all');
    } catch (error) {
      console.error('删除所有消息失败:', error);
      throw error;
    }
  }
};

// 订单项管理API
export const orderItemsApi = {
  // 获取订单项列表
  getOrderItems: async (params = {}) => {
    try {
      return await api.get('/orderItems', { params });
    } catch (error) {
      console.error('获取订单项列表失败:', error);
      throw error;
    }
  },

  // 获取单个订单项详情
  getOrderItemById: async (id) => {
    try {
      return await api.get(`/orderItems/${id}`);
    } catch (error) {
      console.error('获取订单项详情失败:', error);
      throw error;
    }
  },

  // 创建新订单项
  createOrderItem: async (orderItemData) => {
    try {
      return await api.post('/orderItems', orderItemData);
    } catch (error) {
      console.error('创建订单项失败:', error);
      throw error;
    }
  },

  // 更新订单项
  updateOrderItem: async (orderItemData) => {
    try {
      return await api.put('/orderItems', orderItemData);
    } catch (error) {
      console.error('更新订单项失败:', error);
      throw error;
    }
  },

  // 删除订单项
  deleteOrderItem: async (id) => {
    try {
      return await api.delete('/orderItems', { params: { id } });
    } catch (error) {
      console.error('删除订单项失败:', error);
      throw error;
    }
  },
};

// 权限管理API
export const permissionsApi = {
  // 获取权限列表
  getPermissions: async (params = {}) => {
    try {
      return await api.get('/permissions', { params });
    } catch (error) {
      console.error('获取权限列表失败:', error);
      throw error;
    }
  },

  // 获取单个权限详情
  getPermissionById: async (id) => {
    try {
      return await api.get(`/permissions/${id}`);
    } catch (error) {
      console.error('获取权限详情失败:', error);
      throw error;
    }
  },

  // 创建新权限
  createPermission: async (permissionData) => {
    try {
      return await api.post('/permissions', permissionData);
    } catch (error) {
      console.error('创建权限失败:', error);
      throw error;
    }
  },

  // 更新权限
  updatePermission: async (permissionData) => {
    try {
      return await api.put('/permissions', permissionData);
    } catch (error) {
      console.error('更新权限失败:', error);
      throw error;
    }
  },

  // 删除权限
  deletePermission: async (id) => {
    try {
      return await api.delete('/permissions', { params: { id } });
    } catch (error) {
      console.error('删除权限失败:', error);
      throw error;
    }
  },
};

// 商品地址管理API
export const productAddressesApi = {
  // 获取商品地址列表
  getProductAddresses: async (params = {}) => {
    try {
      return await api.get('/productAddresses', { params });
    } catch (error) {
      console.error('获取商品地址列表失败:', error);
      throw error;
    }
  },

  // 获取单个商品地址详情
  getProductAddressById: async (id) => {
    try {
      return await api.get(`/productAddresses/${id}`);
    } catch (error) {
      console.error('获取商品地址详情失败:', error);
      throw error;
    }
  },

  // 创建新商品地址
  createProductAddress: async (productAddressData) => {
    try {
      return await api.post('/productAddresses', productAddressData);
    } catch (error) {
      console.error('创建商品地址失败:', error);
      throw error;
    }
  },

  // 更新商品地址
  updateProductAddress: async (productAddressData) => {
    try {
      return await api.put('/productAddresses', productAddressData);
    } catch (error) {
      console.error('更新商品地址失败:', error);
      throw error;
    }
  },

  // 删除商品地址
  deleteProductAddress: async (id) => {
    try {
      return await api.delete('/productAddresses', { params: { id } });
    } catch (error) {
      console.error('删除商品地址失败:', error);
      throw error;
    }
  },
};

// 角色权限管理API
export const rolePermissionsApi = {
  // 获取角色权限列表
  getRolePermissions: async (params = {}) => {
    try {
      return await api.get('/rolePermissions', { params });
    } catch (error) {
      console.error('获取角色权限列表失败:', error);
      throw error;
    }
  },

  // 获取单个角色权限详情
  getRolePermissionById: async (id) => {
    try {
      return await api.get(`/rolePermissions/${id}`);
    } catch (error) {
      console.error('获取角色权限详情失败:', error);
      throw error;
    }
  },

  // 创建新角色权限
  createRolePermission: async (rolePermissionData) => {
    try {
      return await api.post('/rolePermissions', rolePermissionData);
    } catch (error) {
      console.error('创建角色权限失败:', error);
      throw error;
    }
  },

  // 更新角色权限
  updateRolePermission: async (rolePermissionData) => {
    try {
      return await api.put('/rolePermissions', rolePermissionData);
    } catch (error) {
      console.error('更新角色权限失败:', error);
      throw error;
    }
  },

  // 删除角色权限
  deleteRolePermission: async (id) => {
    try {
      return await api.delete('/rolePermissions', { params: { id } });
    } catch (error) {
      console.error('删除角色权限失败:', error);
      throw error;
    }
  },
};

// 角色管理API
export const rolesApi = {
  // 获取角色列表
  getRoles: async (params = {}) => {
    try {
      return await api.get('/roles', { params });
    } catch (error) {
      console.error('获取角色列表失败:', error);
      throw error;
    }
  },

  // 获取单个角色详情
  getRoleById: async (id) => {
    try {
      return await api.get(`/roles/${id}`);
    } catch (error) {
      console.error('获取角色详情失败:', error);
      throw error;
    }
  },

  // 创建新角色
  createRole: async (roleData) => {
    try {
      return await api.post('/roles', roleData);
    } catch (error) {
      console.error('创建角色失败:', error);
      throw error;
    }
  },

  // 更新角色
  updateRole: async (roleData) => {
    try {
      return await api.put('/roles', roleData);
    } catch (error) {
      console.error('更新角色失败:', error);
      throw error;
    }
  },

  // 删除角色
  deleteRole: async (id) => {
    try {
      return await api.delete('/roles', { params: { id } });
    } catch (error) {
      console.error('删除角色失败:', error);
      throw error;
    }
  },
};