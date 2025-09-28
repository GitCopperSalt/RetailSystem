// API服务，使用axios实现，统一管理所有API调用
/*
// 此文件已被注释，系统现在使用apis目录下的单独API文件

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
      // 后端现在会返回包含角色、用户ID和用户名的完整信息
      return response;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  // 注册
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      // 后端现在会默认分配customer角色给新用户
      return response;
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
      const response = await api.post('/auth/logout');
      // 清除localStorage中的token
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      return response;
    } catch (error) {
      console.error('登出失败:', error);
      // 即使API调用失败，也要清除token
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
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

  // 根据角色名称获取角色
  getRoleByName: async (roleName) => {
    try {
      return await api.get('/roles/name', { params: { roleName } });
    } catch (error) {
      console.error(`获取角色名称为${roleName}的角色失败:`, error);
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
      return await api.delete(`/roles/${id}`);
    } catch (error) {
      console.error('删除角色失败:', error);
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
      return await api.delete(`/rolePermissions/${id}`);
    } catch (error) {
      console.error('删除角色权限失败:', error);
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

  // 获取当前登录用户信息
  getCurrentUser: async () => {
    try {
      return await api.get('/auth/me');
    } catch (error) {
      console.error('获取当前用户信息失败:', error);
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

  // 更新用户角色
  updateUserRole: async (userId, roleId) => {
    try {
      return await api.put(`/users/${userId}/role`, { roleId });
    } catch (error) {
      console.error('更新用户角色失败:', error);
      throw error;
    }
  },

  // 删除用户
  deleteUser: async (id) => {
    try {
      return await api.delete(`/users/${id}`);
    } catch (error) {
      console.error('删除用户失败:', error);
      throw error;
    }
  },
};

// 导出所有API
export {
  authApi,
  rolesApi,
  rolePermissionsApi,
  usersApi
};
*/