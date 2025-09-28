/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, rolesApi, rolePermissionsApi } from '../apis';

// Create auth context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null); // Added for backward compatibility with App.jsx

  // 处理token错误的通用方法
  const handleTokenError = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  };

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // 设置认证状态
          setIsAuthenticated(true);
           
          try {
            // 尝试从localStorage获取保存的用户信息
            const savedUserInfo = localStorage.getItem('userInfo');
            if (savedUserInfo) {
              const parsedUserInfo = JSON.parse(savedUserInfo);
              setCurrentUser(parsedUserInfo);
              setUserInfo(parsedUserInfo);
            } else {
              // 从后端获取用户信息
              try {
                const userInfo = await authApi.getCurrentUser();
                setCurrentUser(userInfo);
                setUserInfo(userInfo);
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
              } catch (error) {
                console.error('获取用户信息失败:', error);
                handleTokenError();
              }
            }
          } catch (userInfoError) {
            console.error('Error parsing saved user info:', userInfoError);
            handleTokenError();
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function that supports both admin and user accounts
  const login = async (credentials) => {
    try {
      // 解构凭证参数
      const { username, password } = credentials;
      
      // 调用实际的登录API，传递凭证对象
      const response = await authApi.login({ username, password });
      
      if (response.token) {
        // 存储token
        localStorage.setItem('authToken', response.token);
        
        // 设置认证状态
        setIsAuthenticated(true);
        // 保存用户角色和权限信息
        // 严格按照数据库表结构设计，保存用户的完整信息，包括角色和权限
        const userData = {
          id: response.userId,
          username,
          role: response.role,
          permissions: response.permissions || [],
          // 保留原始响应中的其他信息
          ...response
        };
        setCurrentUser(userData);
        setUserInfo(userData);
        
        // 保存用户信息到localStorage
        localStorage.setItem('userInfo', JSON.stringify(userData));
        
        // 获取并更新系统角色权限映射
        await fetchAndUpdateSystemRolePermissions();
        
        // 返回完整的用户认证信息，包括token、角色和权限
        return {
          username,
          token: response.token,
          role: response.role,
          permissions: response.permissions || [],
          userId: response.userId
        };
      } else {
        throw new Error('登录失败，未返回token');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // WeChat login for user terminal
  const wechatLogin = async (openid) => {
    try {
      // 调用实际的微信登录API
      const response = await authApi.wechatLogin(openid);
      
      if (response.token) {
        // 存储token
        localStorage.setItem('authToken', response.token);
        
        // 设置认证状态
        setIsAuthenticated(true);
        // 保存用户信息，包括角色和权限
        const userInfo = response.user || { username: '微信用户', role: 'user', permissions: [] };
        setCurrentUser(userInfo);
        setUserInfo(userInfo);
        
        // 保存用户信息到localStorage
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        // 获取并更新系统角色权限映射
        await fetchAndUpdateSystemRolePermissions();
        
        return userInfo;
      } else {
        throw new Error('微信登录失败，未返回token');
      }
    } catch (error) {
      console.error('Error during WeChat login:', error);
      throw new Error('微信登录失败，请重试');
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!isAuthenticated || !currentUser) return false;
    // 忽略大小写检查管理员角色
    if (currentUser.role && currentUser.role.toLowerCase() === 'admin') return true; // Admin has all permissions
    // 确保permissions是数组类型
    const userPermissions = Array.isArray(currentUser.permissions) ? currentUser.permissions : [];
    // 检查用户是否直接拥有该权限
    return userPermissions.includes(permission);
  };

  // 获取系统角色权限映射
  // 根据数据库表结构设计，admin角色可以管理所有角色的权限
  const getSystemRolePermissions = () => {
    // 从localStorage获取用户信息
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      try {
        const userInfo = JSON.parse(savedUserInfo);
        // admin角色拥有最高权限，可以管理所有角色的权限
        if (userInfo.role && userInfo.role.toLowerCase() === 'admin') {
          return {
            admin: ['manage_users', 'manage_products', 'manage_orders', 'manage_categories', 'view_dashboard', 'manage_inventory', 'process_payments'],
            store_manager: ['manage_products', 'manage_orders', 'manage_categories', 'view_dashboard'],
            inventory_manager: ['manage_products', 'manage_inventory'],
            cashier: ['manage_orders', 'process_payments'],
            customer: []
          };
        }
        // 非admin角色只能查看自己的权限
        return { [userInfo.role]: userInfo.permissions || [] };
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
    return {};
  };

  // 更新系统角色权限映射
  const fetchAndUpdateSystemRolePermissions = async () => {
    try {
      // 从localStorage获取用户信息
      const savedUserInfo = localStorage.getItem('userInfo');
      if (savedUserInfo) {
        const userInfo = JSON.parse(savedUserInfo);
        // 确保权限是数组类型
        if (!Array.isArray(userInfo.permissions)) {
          userInfo.permissions = [];
        }
        
        // 按照数据库表结构设计，返回角色权限映射
        // admin角色可以管理所有角色的权限
        const rolePermissionsMap = {};
        if (userInfo.role && userInfo.role.toLowerCase() === 'admin') {
          rolePermissionsMap.admin = ['manage_users', 'manage_products', 'manage_orders', 'manage_categories', 'view_dashboard', 'manage_inventory', 'process_payments'];
          rolePermissionsMap.store_manager = ['manage_products', 'manage_orders', 'manage_categories', 'view_dashboard'];
          rolePermissionsMap.inventory_manager = ['manage_products', 'manage_inventory'];
          rolePermissionsMap.cashier = ['manage_orders', 'process_payments'];
          rolePermissionsMap.customer = [];
        } else {
          // 非admin角色只能查看自己的权限
          rolePermissionsMap[userInfo.role] = userInfo.permissions || [];
        }
        
        return rolePermissionsMap;
      }
    } catch (error) {
      console.error('Error updating system role permissions:', error);
    }
    return {};
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!isAuthenticated || !currentUser) return false;
    return currentUser.role === role;
  };

  // Added for backward compatibility with App.jsx
  const isLoggedIn = isAuthenticated;
  
  // 刷新token
  const refreshToken = async () => {
    try {
      const response = await authApi.refreshToken();
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        return response;
      }
    } catch (error) {
      console.error('刷新token失败:', error);
      handleTokenError();
      navigate('/login');
      throw error;
    }
  };

  const value = {
    currentUser,
    userInfo, // For backward compatibility
    isAuthenticated,
    isLoggedIn, // For backward compatibility
    loading,
    login,
    wechatLogin,
    logout,
    hasPermission,
    hasRole,
    fetchAndUpdateSystemRolePermissions,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};