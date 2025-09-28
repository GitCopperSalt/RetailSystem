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

// 购物车相关API方法
export const shoppingCartApi = {
  // 获取购物车列表
  getShoppingCarts: async (params = {}) => {
    try {
      const response = await api.get('/shoppingCart', { params });
      return response.data;
    } catch (error) {
      console.error('获取购物车列表失败:', error);
      throw error;
    }
  },

  // 获取单个购物车项
  getShoppingCartById: async (id) => {
    try {
      const response = await api.get(`/shoppingCart/${id}`);
      return response.data;
    } catch (error) {
      console.error('获取购物车项失败:', error);
      throw error;
    }
  },

  // 添加商品到购物车
  addToShoppingCart: async (cartData) => {
    try {
      const response = await api.post('/shoppingCart', cartData);
      return response.data;
    } catch (error) {
      console.error('添加商品到购物车失败:', error);
      throw error;
    }
  },

  // 更新购物车商品
  updateShoppingCart: async (cartData) => {
    try {
      const response = await api.put('/shoppingCart', cartData);
      return response.data;
    } catch (error) {
      console.error('更新购物车商品失败:', error);
      throw error;
    }
  },

  // 从购物车删除商品
  deleteFromShoppingCart: async (id) => {
    try {
      const response = await api.delete(`/shoppingCart/${id}`);
      return response.data;
    } catch (error) {
      console.error('从购物车删除商品失败:', error);
      throw error;
    }
  },
};

export default shoppingCartApi;