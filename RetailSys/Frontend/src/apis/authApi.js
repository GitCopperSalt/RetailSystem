import axios from 'axios';

// 创建axios实例，设置基础URL
const api = axios.create({
  baseURL: '', // 基础API路径
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

// 认证相关API方法
export const authApi = {
  // 用户登录
  login: async (loginData) => {
    try {
      const response = await api.post('/auth/login', loginData);
      return response.data;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  // 用户注册
  register: async (registerData) => {
    try {
      const response = await api.post('/auth/register', registerData);
      // 后端现在会默认分配customer角色，直接返回响应
      return response.data;
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  },

  // 获取当前用户信息（包含角色）
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  },

  // 登出
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      // 清除localStorage中的token
      localStorage.removeItem('authToken');
      return response.data;
    } catch (error) {
      console.error('登出失败:', error);
      // 即使API调用失败，也要清除token
      localStorage.removeItem('authToken');
      throw error;
    }
  },

  // 微信登录
  wechatLogin: async (openid) => {
    try {
      const response = await api.post('/auth/wechat-login', { openid });
      // 后端会返回包含用户信息和角色的响应
      return response.data;
    } catch (error) {
      console.error('微信登录失败:', error);
      throw error;
    }
  }
};