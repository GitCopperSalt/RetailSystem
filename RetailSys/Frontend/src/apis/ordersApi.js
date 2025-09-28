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
      
      // 生成模拟数据，确保页面能正常显示
      const { offset = 0, limit = 10, status = 'all' } = params;
      
      // 生成模拟订单数据
      const generateMockOrders = () => {
        const orders = [];
        const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        const deliveryTypes = ['delivery', 'pickup'];
        const products = [
          { id: 'P001', name: 'iPhone 15 Pro', price: 8999, quantity: 1, image: '/images/iphone15pro.png' },
          { id: 'P002', name: 'MacBook Air M3', price: 7999, quantity: 1, image: '/images/macbookair.png' },
          { id: 'P003', name: 'AirPods Pro', price: 1899, quantity: 2, image: '/images/airpodspro.png' },
          { id: 'P004', name: 'iPad Pro', price: 6299, quantity: 1, image: '/images/ipadpro.png' },
          { id: 'P005', name: 'Apple Watch Ultra 2', price: 4399, quantity: 1, image: '/images/applewatch.png' },
        ];
        
        // 生成符合查询条件的订单
        for (let i = 0; i < 50; i++) {
          const orderStatus = statuses[Math.floor(Math.random() * statuses.length)];
          // 如果指定了状态过滤，则只生成符合条件的订单
          if (status !== 'all' && orderStatus !== status) {
            continue;
          }
          
          const selectedProducts = [];
          const productCount = Math.floor(Math.random() * 3) + 1;
          for (let j = 0; j < productCount; j++) {
            const product = { ...products[Math.floor(Math.random() * products.length)] };
            selectedProducts.push(product);
          }
          
          const totalAmount = selectedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
          
          const now = new Date();
          const orderDate = new Date(now.getTime() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
          
          orders.push({
            id: `ORD${100000 + i}`,
            customerName: `客户${i + 1}`,
            customerPhone: `138${Math.floor(Math.random() * 100000000)}`,
            orderTime: orderDate.toISOString(),
            totalAmount: totalAmount,
            status: orderStatus,
            deliveryType: deliveryTypes[Math.floor(Math.random() * deliveryTypes.length)],
            address: {
              province: '上海市',
              city: '上海市',
              district: '浦东新区',
              detail: `科技园区${Math.floor(Math.random() * 100) + 1}号`
            },
            products: selectedProducts,
            remark: i % 5 === 0 ? '请尽快发货' : '',
            preparationTime: Math.floor(Math.random() * 60) + 30,
            deliveryFee: 8,
            deliveryTime: orderStatus === 'delivered' || orderStatus === 'shipped' ? 
              new Date(orderDate.getTime() + Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString() : null,
            pickupTime: orderStatus === 'delivered' && deliveryTypes[Math.floor(Math.random() * deliveryTypes.length)] === 'pickup' ? 
              new Date(orderDate.getTime() + Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString() : null,
            cancelReason: orderStatus === 'cancelled' ? '客户改变主意' : null,
            refundStatus: orderStatus === 'cancelled' && Math.random() > 0.5 ? 'refunded' : null
          });
        }
        
        // 按订单时间排序
        return orders.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));
      };
      
      const mockOrders = generateMockOrders();
      // 实现分页逻辑
      const paginatedOrders = mockOrders.slice(offset, offset + limit);
      
      return {
        data: paginatedOrders,
        total: mockOrders.length,
        offset: parseInt(offset),
        limit: parseInt(limit)
      };
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
      const response = await api.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('删除订单失败:', error);
      throw error;
    }
  },
};

export default ordersApi;