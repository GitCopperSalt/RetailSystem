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

// 商品地址相关API方法
export const productAddressesApi = {
  // 获取商品地址列表
  getProductAddresses: async (params = {}) => {
    try {
      const response = await api.get('/productAddresses', { params });
      return response.data;
    } catch (error) {
      console.error('获取商品地址列表失败:', error);
      throw error;
    }
  },

  // 获取单个商品地址详情
  getProductAddressById: async (id) => {
    try {
      const response = await api.get(`/productAddresses/${id}`);
      return response.data;
    } catch (error) {
      console.error('获取商品地址详情失败:', error);
      throw error;
    }
  },

  // 创建新商品地址
  createProductAddress: async (productAddressData) => {
    try {
      const response = await api.post('/productAddresses', productAddressData);
      return response.data;
    } catch (error) {
      console.error('创建商品地址失败:', error);
      throw error;
    }
  },

  // 更新商品地址
  updateProductAddress: async (productAddressData) => {
    try {
      const response = await api.put('/productAddresses', productAddressData);
      return response.data;
    } catch (error) {
      console.error('更新商品地址失败:', error);
      throw error;
    }
  },

  // 删除商品地址
  deleteProductAddress: async (id) => {
    try {
      const response = await api.delete(`/productAddresses/${id}`);
      return response.data;
    } catch (error) {
      console.error('删除商品地址失败:', error);
      throw error;
    }
  },
};