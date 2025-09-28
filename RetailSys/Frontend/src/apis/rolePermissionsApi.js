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

// 角色权限相关API方法
export const rolePermissionsApi = {
  // 获取角色权限列表
  getRolePermissions: async (params = {}) => {
    try {
      const response = await api.get('/rolePermissions', { params });
      return response.data;
    } catch (error) {
      console.error('获取角色权限列表失败:', error);
      throw error;
    }
  },

  // 获取单个角色权限详情
  getRolePermissionById: async (id) => {
    try {
      const response = await api.get(`/rolePermissions/${id}`);
      return response.data;
    } catch (error) {
      console.error('获取角色权限详情失败:', error);
      throw error;
    }
  },

  // 创建新角色权限
  createRolePermission: async (rolePermissionData) => {
    try {
      const response = await api.post('/rolePermissions', rolePermissionData);
      return response.data;
    } catch (error) {
      console.error('创建角色权限失败:', error);
      throw error;
    }
  },

  // 更新角色权限
  updateRolePermission: async (rolePermissionData) => {
    try {
      const response = await api.put('/rolePermissions', rolePermissionData);
      return response.data;
    } catch (error) {
      console.error('更新角色权限失败:', error);
      throw error;
    }
  },

  // 删除角色权限
  deleteRolePermission: async (id) => {
    try {
      const response = await api.delete(`/rolePermissions/${id}`);
      return response.data;
    } catch (error) {
      console.error('删除角色权限失败:', error);
      throw error;
    }
  }
};