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

// 地址相关API方法
export const addressesApi = {
  // 获取地址列表
  getAddresses: async (params = {}) => {
    try {
      const response = await api.get('/addresses', { params });
      return response.data;
    } catch (error) {
      console.error('获取地址列表失败:', error);
      throw error;
    }
  },

  // 获取单个地址详情
  getAddressById: async (id) => {
    try {
      const response = await api.get(`/addresses/${id}`);
      return response.data;
    } catch (error) {
      console.error('获取地址详情失败:', error);
      throw error;
    }
  },

  // 创建新地址
  createAddress: async (addressData) => {
    try {
      const response = await api.post('/addresses', addressData);
      return response.data;
    } catch (error) {
      console.error('创建地址失败:', error);
      throw error;
    }
  },

  // 更新地址
  updateAddress: async (addressData) => {
    try {
      const response = await api.put('/addresses', addressData);
      return response.data;
    } catch (error) {
      console.error('更新地址失败:', error);
      throw error;
    }
  },

  // 删除地址
  deleteAddress: async (id) => {
    try {
      const response = await api.delete(`/addresses/${id}`);
      return response.data;
    } catch (error) {
      console.error('删除地址失败:', error);
      throw error;
    }
  },
};

export default addressesApi;