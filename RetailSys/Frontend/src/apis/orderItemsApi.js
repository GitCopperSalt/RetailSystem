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

// 订单项相关API方法
export const orderItemsApi = {
  // 获取订单项列表
  getOrderItems: async (params = {}) => {
    try {
      const response = await api.get('/orderItems', { params });
      return response.data;
    } catch (error) {
      console.error('获取订单项列表失败:', error);
      throw error;
    }
  },

  // 获取单个订单项详情
  getOrderItemById: async (id) => {
    try {
      const response = await api.get(`/orderItems/${id}`);
      return response.data;
    } catch (error) {
      console.error('获取订单项详情失败:', error);
      throw error;
    }
  },

  // 创建新订单项
  createOrderItem: async (orderItemData) => {
    try {
      const response = await api.post('/orderItems', orderItemData);
      return response.data;
    } catch (error) {
      console.error('创建订单项失败:', error);
      throw error;
    }
  },

  // 更新订单项
  updateOrderItem: async (orderItemData) => {
    try {
      const response = await api.put('/orderItems', orderItemData);
      return response.data;
    } catch (error) {
      console.error('更新订单项失败:', error);
      throw error;
    }
  },

  // 删除订单项
  deleteOrderItem: async (id) => {
    try {
      const response = await api.delete(`/orderItems/${id}`);
      return response.data;
    } catch (error) {
      console.error('删除订单项失败:', error);
      throw error;
    }
  },
};