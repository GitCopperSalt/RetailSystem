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

// 商品相关API方法
export const productsApi = {
  // 获取商品列表
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('获取商品列表失败:', error);
      throw error;
    }
  },

  // 获取单个商品详情
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('获取商品详情失败:', error);
      throw error;
    }
  },

  // 创建新商品
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('创建商品失败:', error);
      throw error;
    }
  },

  // 更新商品
  updateProduct: async (productData) => {
    try {
      const response = await api.put('/products', productData);
      return response.data;
    } catch (error) {
      console.error('更新商品失败:', error);
      throw error;
    }
  },

  // 删除商品
  deleteProduct: async (id) => {
    try {
      const response = await api.delete('/products', { params: { id } });
      return response.data;
    } catch (error) {
      console.error('删除商品失败:', error);
      throw error;
    }
  },
};