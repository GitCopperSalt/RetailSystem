import axios from 'axios';

// 创建axios实例，设置基础URL
const api = axios.create({
  baseURL: '/api', // 基础API路径，通过Vite代理转发到后端
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 请求拦截器
 * 添加认证token，处理请求前的通用逻辑
 */
api.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 对请求错误做统一处理
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 * 处理响应数据，统一处理错误和未授权情况
 */
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 对响应错误做统一处理
    console.error('响应错误:', error);
    
    // 处理不同类型的错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          console.warn('未授权，需要重新登录');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userInfo');
          // 使用setTimeout确保其他操作完成后再跳转
          setTimeout(() => {
            window.location.href = '/login';
          }, 500);
          break;
        case 403:
          console.warn('没有权限访问该资源');
          // 可以显示一个权限不足的提示
          break;
        case 404:
          console.warn('请求的资源不存在');
          break;
        case 500:
          console.error('服务器错误');
          break;
        default:
          console.warn(`请求失败，状态码: ${error.response.status}`);
      }
    } else if (error.request) {
      console.error('网络错误，无法连接到服务器');
    } else {
      console.error('请求配置错误:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// 认证相关API方法
export const authApi = {
  // 用户登录
  login: async (credentials) => {
    try {
      console.log('尝试登录，用户凭据:', credentials);
      console.log('发送登录请求到: /api/auth/login');
      
      // 使用/api前缀确保请求能被正确代理
      const response = await axios.post('/api/auth/login', credentials, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
        // 添加withCredentials配置，处理跨域凭证
        withCredentials: true
      });
      
      console.log('登录请求成功，响应数据:', response.data);
      return response.data;
    } catch (error) {
      console.error('登录失败:', error);
      console.error('错误详情:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config,
        headers: error.response?.headers,
        request: error.request,
        responseHeaders: JSON.stringify(error.response?.headers)
      });
      throw error;
    }
  },

  // 用户注册
  register: async (userData) => {
    try {
      return await api.post('/auth/register', userData);
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  },

  // 获取当前用户信息（包含角色）
  getCurrentUser: async () => {
    try {
      return await api.get('/auth/me');
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  },

  // 登出
  logout: async () => {
    try {
      // 先清除本地存储
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      // 再调用后端登出接口（即使失败也继续）
      return await api.post('/auth/logout').catch(() => ({}));
    } catch (error) {
      console.error('登出失败:', error);
      return {};
    }
  },

  // 微信登录
  wechatLogin: async (code) => {
    try {
      return await api.get(`/auth/wechat?code=${code}`);
    } catch (error) {
      console.error('微信登录失败:', error);
      throw error;
    }
  },

  // 刷新token接口（如果后端支持）
  refreshToken: async () => {
    try {
      return await api.post('/auth/refresh');
    } catch (error) {
      console.error('刷新token失败:', error);
      throw error;
    }
  }
};
export default authApi;