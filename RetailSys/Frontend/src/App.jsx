import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OrderStatusProvider } from './context/OrderStatusContext';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import InventoryManagementPage from './pages/admin/InventoryManagementPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import MessageCenterPage from './pages/admin/MessageCenterPage';
import PermissionManagementPage from './pages/admin/PermissionManagementPage';
import CategoryManagementPage from './pages/admin/CategoryManagementPage';
import TestPage from './TestPage';
import ProductCatalogPage from './pages/user/ProductCatalogPage';
import ProductDetailPage from './pages/user/ProductDetailPage';
import ShoppingCartPage from './pages/user/ShoppingCartPage';
import CheckoutPage from './pages/user/CheckoutPage';
import OrderSuccessPage from './pages/user/OrderSuccessPage';
import OrderHistoryPage from './pages/user/OrderHistoryPage';
import AddressManagementPage from './pages/user/AddressManagementPage';
import UserProfilePage from './pages/user/UserProfilePage';
import './App.css';

// 系统数据初始化函数
const initializeMockData = () => {
  // Initialize users in localStorage if not present
  if (!localStorage.getItem('systemUsers')) {
    const defaultUsers = [
      {
        id: 'admin',
        username: 'admin',
        password: 'admin123', // In a real app, this would be hashed
        role: 'admin',
        email: 'admin@example.com',
        phone: '13800138000',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'store_manager',
        username: 'manager',
        password: 'manager123',
        role: 'store_manager',
        email: 'manager@example.com',
        phone: '13800138001',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'inventory_clerk',
        username: 'inventory',
        password: 'inventory123',
        role: 'inventory_clerk',
        email: 'inventory@example.com',
        phone: '13800138002',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'cashier',
        username: 'cashier',
        password: 'cashier123',
        role: 'cashier',
        email: 'cashier@example.com',
        phone: '13800138003',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('systemUsers', JSON.stringify(defaultUsers));
  }

  // Initialize roles and permissions if not present
  if (!localStorage.getItem('systemRoles')) {
    const defaultRoles = [
      {
        id: 'admin',
        name: '超级管理员',
        description: '拥有系统所有权限',
        permissions: [
          'dashboard_view',
          'product_view', 'product_edit', 'product_delete',
          'order_view', 'order_edit', 'order_delete',
          'inventory_view', 'inventory_edit',
          'analytics_view',
          'message_view', 'message_edit',
          'user_view', 'user_edit', 'user_delete',
          'role_view', 'role_edit', 'role_delete',
          'category_view', 'category_edit', 'category_delete',
          'discount_view', 'discount_edit', 'discount_delete'
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'store_manager',
        name: '店长',
        description: '管理店铺运营',
        permissions: [
          'dashboard_view',
          'product_view', 'product_edit',
          'order_view', 'order_edit',
          'inventory_view', 'inventory_edit',
          'analytics_view',
          'message_view', 'message_edit',
          'user_view',
          'category_view', 'category_edit',
          'discount_view', 'discount_edit'
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'inventory_clerk',
        name: '库存管理员',
        description: '管理库存',
        permissions: [
          'inventory_view', 'inventory_edit',
          'message_view'
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'cashier',
        name: '收银员',
        description: '处理订单和支付',
        permissions: [
          'order_view',
          'message_view'
        ],
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('systemRoles', JSON.stringify(defaultRoles));
  }

  // Initialize sample user data if not present
  if (!localStorage.getItem('userData')) {
    const sampleUserData = {
      id: 'user1',
      username: '张三',
      phone: '13812341234',
      avatar: '',
      isWechatUser: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
    };
    localStorage.setItem('userData', JSON.stringify(sampleUserData));
  }

  // Initialize empty shopping cart if not present
  if (!localStorage.getItem('shoppingCart')) {
    localStorage.setItem('shoppingCart', JSON.stringify([]));
  }

  // Initialize empty orders if not present
  if (!localStorage.getItem('userOrders')) {
    localStorage.setItem('userOrders', JSON.stringify([]));
  }
};

// 权限检查辅助函数
const hasPermission = (user, permission) => {
  // 简化版权限检查，实际项目中应该从用户角色中获取权限列表
  // 超级管理员拥有所有权限
  if (user?.role === 'admin') {
    return true;
  }
  
  // 从localStorage获取角色权限配置
  const systemRoles = JSON.parse(localStorage.getItem('systemRoles') || '[]');
  const userRole = systemRoles.find(role => role.id === user?.role);
  
  return userRole?.permissions?.includes(permission) || false;
};

// 管理端路由保护组件
const ProtectedRoute = ({ children, requiredRole, requiredPermission }) => {
  const { isAuthenticated, currentUser } = useAuth();
  
  // 未登录用户重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  // 角色权限检查
  if (requiredRole && currentUser?.role !== requiredRole) {
    return <Navigate to="/admin/dashboard" replace />
  }
  
  // 功能权限检查
  if (requiredPermission && !hasPermission(currentUser, requiredPermission)) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm max-w-md">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center">
              <i className="fa fa-lock text-warning text-2xl"></i>
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">权限不足</h3>
          <p className="text-gray-500 mb-6">您没有权限访问此页面，请联系管理员获取权限。</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.history.back()}
          >
            返回上一页
          </button>
        </div>
      </div>
    );
  }
  
  return children;
};

// 用户端路由保护组件
const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children;
};

function App() {
  // Initialize mock data on app load
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <OrderStatusProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />

            {/* Management Terminal Routes with AdminLayout */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={
                <ProtectedRoute requiredPermission="dashboard_view">
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="products" element={
                <ProtectedRoute requiredPermission="product_view">
                  <ProductManagementPage />
                </ProtectedRoute>
              } />
              <Route path="orders" element={
                <ProtectedRoute requiredPermission="order_view">
                  <OrderManagementPage />
                </ProtectedRoute>
              } />
              <Route path="inventory" element={
                <ProtectedRoute requiredPermission="inventory_view">
                  <InventoryManagementPage />
                </ProtectedRoute>
              } />
              <Route path="analytics" element={
                <ProtectedRoute requiredPermission="analytics_view">
                  <AnalyticsPage />
                </ProtectedRoute>
              } />
              <Route path="messages" element={
                <ProtectedRoute requiredPermission="message_view">
                  <MessageCenterPage />
                </ProtectedRoute>
              } />
              <Route path="permissions" element={
                <ProtectedRoute requiredPermission="user_view">
                  <PermissionManagementPage />
                </ProtectedRoute>
              } />
              <Route path="categories" element={
                <ProtectedRoute requiredPermission="category_view">
                  <CategoryManagementPage />
                </ProtectedRoute>
              } />
              <Route path="discounts" element={
                <ProtectedRoute requiredPermission="discount_view">
                  <TestPage />
                </ProtectedRoute>
              } />
            </Route>

            {/* User Terminal Routes with UserLayout */}
            <Route path="/user" element={
              <UserProtectedRoute>
                <UserLayout />
              </UserProtectedRoute>
            }>
              <Route index element={<Navigate to="/user/products" replace />} />
              <Route path="products" element={<ProductCatalogPage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<ShoppingCartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order-success/:id" element={<OrderSuccessPage />} />
              <Route path="orders" element={<OrderHistoryPage />} />
              <Route path="addresses" element={<AddressManagementPage />} />
              <Route path="profile" element={<UserProfilePage />} />
            </Route>

            {/* Redirect to home for any unmatched routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </OrderStatusProvider>
      </AuthProvider>
    </Router>
  );
}

export default App
