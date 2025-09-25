import axios from 'axios';

// 创建axios实例，设置基础URL
const api = axios.create({
  baseURL: '/api', // 基础API路径，实际项目中需要替换为真实后端API地址
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

// 订单相关API方法
export const ordersApi = {
  // 创建新订单
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      // 处理错误
      console.error('创建订单失败:', error);
      throw error;
    }
  },

  // 获取订单列表
  getOrderList: async (params = {}) => {
    try {
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error) {
      console.error('获取订单列表失败:', error);
      throw error;
    }
  },

  // 获取订单详情
  getOrderDetail: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('获取订单详情失败:', error);
      throw error;
    }
  },

  // 更新订单
  updateOrder: async (orderData) => {
    try {
      const response = await api.put('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('更新订单失败:', error);
      throw error;
    }
  },

  // 删除订单
  deleteOrder: async (id) => {
    try {
      const response = await api.delete('/orders', { params: { id } });
      return response.data;
    } catch (error) {
      console.error('删除订单失败:', error);
      throw error;
    }
  },
};

export default ordersApi;