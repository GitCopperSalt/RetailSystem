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

// 角色相关API方法
export const rolesApi = {
  // 获取角色列表
  getRoles: async (params = {}) => {
    try {
      const response = await api.get('/roles', { params });
      return response.data;
    } catch (error) {
      console.error('获取角色列表失败:', error);
      throw error;
    }
  },

  // 获取单个角色详情
  getRoleById: async (id) => {
    try {
      const response = await api.get(`/roles/${id}`);
      return response.data;
    } catch (error) {
      console.error('获取角色详情失败:', error);
      throw error;
    }
  },

  // 创建新角色
  createRole: async (roleData) => {
    try {
      const response = await api.post('/roles', roleData);
      return response.data;
    } catch (error) {
      console.error('创建角色失败:', error);
      throw error;
    }
  },

  // 更新角色
  updateRole: async (roleData) => {
    try {
      const response = await api.put('/roles', roleData);
      return response.data;
    } catch (error) {
      console.error('更新角色失败:', error);
      throw error;
    }
  },

  // 删除角色
  deleteRole: async (id) => {
    try {
      const response = await api.delete('/roles', { params: { id } });
      return response.data;
    } catch (error) {
      console.error('删除角色失败:', error);
      throw error;
    }
  },
};