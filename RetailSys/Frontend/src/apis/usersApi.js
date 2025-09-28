import axios from 'axios';

// 创建axios实例，设置基础URL
const api = axios.create({
  baseURL: '/api', // 基础API路径
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
    return Promise.reject(error);
  }
);

// 响应拦截器，处理错误
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 统一错误处理
    if (error.response && error.response.status === 401) {
      // 未授权，清除token并跳转到登录页
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 用户相关API方法
export const usersApi = {
  // 获取用户列表
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/users', { params });
      return response.data;
    } catch (error) {
      console.error('获取用户列表失败:', error);
      throw error;
    }
  },

  // 获取单个用户详情
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('获取用户详情失败:', error);
      throw error;
    }
  },

  // 获取当前登录用户信息
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('获取当前用户信息失败:', error);
      throw error;
    }
  },

  // 创建新用户
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('创建用户失败:', error);
      throw error;
    }
  },

  // 更新用户
  updateUser: async (userData) => {
    try {
      const response = await api.put('/users', userData);
      return response.data;
    } catch (error) {
      console.error('更新用户失败:', error);
      throw error;
    }
  },

  // 更新用户角色
  updateUserRole: async (userId, roleId) => {
    try {
      const response = await api.put(`/users/${userId}/role`, { roleId });
      return response.data;
    } catch (error) {
      console.error('更新用户角色失败:', error);
      throw error;
    }
  },

  // 删除用户
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('删除用户失败:', error);
      throw error;
    }
  },
};