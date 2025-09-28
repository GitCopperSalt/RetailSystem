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

// 分类相关API方法
export const categoriesApi = {
  // 获取分类列表
  getCategories: async (params = {}) => {
    try {
      const response = await api.get('/categories', { params });
      return response.data;
    } catch (error) {
      console.error('获取分类列表失败:', error);
      throw error;
    }
  },

  // 获取单个分类详情
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('获取分类详情失败:', error);
      throw error;
    }
  },

  // 创建新分类
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('创建分类失败:', error);
      throw error;
    }
  },

  // 更新分类
  updateCategory: async (categoryData) => {
    try {
      const response = await api.put('/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('更新分类失败:', error);
      throw error;
    }
  },

  // 删除分类
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('删除分类失败:', error);
      throw error;
    }
  },
};

export default categoriesApi;