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
              // 模拟用户信息作为后备
              setCurrentUser({ username: 'authenticated', role: 'user', permissions: [] });
              setUserInfo({ username: 'authenticated', role: 'user', permissions: [] });
            }
          } catch (userInfoError) {
            console.error('Error parsing saved user info:', userInfoError);
            // 模拟用户信息作为后备
            setCurrentUser({ username: 'authenticated', role: 'user', permissions: [] });
            setUserInfo({ username: 'authenticated', role: 'user', permissions: [] });
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
      const { username, password, type = 'admin' } = credentials;
      
      // 调用实际的登录API，传递凭证对象
      const response = await authApi.login({ username, password, type });
      
      if (response.token) {
        // 存储token
        localStorage.setItem('authToken', response.token);
        
        // 设置认证状态
        setIsAuthenticated(true);
        // 保存用户类型、角色和权限信息
        // 后端应返回用户的角色和权限列表，这里假设response包含role和permissions字段
        const userData = {
          username,
          role: response.role || type,
          permissions: response.permissions || [],
          type
        };
        setCurrentUser(userData);
        setUserInfo(userData);
        
        // 保存用户信息到localStorage
        localStorage.setItem('userInfo', JSON.stringify(userData));
        
        // 获取并更新系统角色权限映射
        await fetchAndUpdateSystemRolePermissions();
        
        return {
          username,
          token: response.token,
          role: response.role || type,
          permissions: response.permissions || []
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
    if (currentUser.role === 'admin') return true; // Admin has all permissions
    // 检查用户是否直接拥有该权限
    if (currentUser.permissions && currentUser.permissions.includes(permission)) return true;
    // 以下是适配数据库模型的额外逻辑，在前端作为后备检查
    // 获取系统角色权限映射（从localStorage或API获取）
    const systemRolePermissions = getSystemRolePermissions();
    // 检查用户角色是否拥有该权限
    if (systemRolePermissions[currentUser.role] && systemRolePermissions[currentUser.role].includes(permission)) {
      return true;
    }
    return false;
  };

  // 获取系统角色权限映射
  const getSystemRolePermissions = () => {
    try {
      // 从localStorage获取保存的系统角色权限映射
      const savedRolePermissions = localStorage.getItem('systemRolePermissions');
      if (savedRolePermissions) {
        return JSON.parse(savedRolePermissions);
      }
    } catch (error) {
      console.error('Error parsing system role permissions:', error);
    }
    // 返回默认的角色权限映射
    return {
      admin: ['manage_users', 'manage_products', 'manage_orders', 'view_reports'],
      store_manager: ['manage_products', 'manage_orders', 'view_reports'],
      user: ['view_products', 'create_orders']
    };
  };

  // 从后端获取并更新系统角色权限映射
  const fetchAndUpdateSystemRolePermissions = async () => {
    try {
      // 首先获取所有角色
      const rolesResponse = await rolesApi.getRoles();
      // 然后获取所有角色权限关联
      const rolePermissionsResponse = await rolePermissionsApi.getRolePermissions();
      
      // 确保处理正确的数据格式
      const roles = rolesResponse?.data || rolesResponse || [];
      const rolePermissions = rolePermissionsResponse?.data || rolePermissionsResponse || [];
      
      // 构建角色权限映射
      const rolePermissionMap = {};
      
      // 初始化每个角色的权限数组
      if (Array.isArray(roles)) {
        roles.forEach(role => {
          rolePermissionMap[role.name] = [];
        });
      } else {
        console.warn('Roles data is not an array, using empty array instead');
      }
      
      // 根据角色权限关联添加权限
      if (Array.isArray(rolePermissions)) {
        rolePermissions.forEach(rolePermission => {
          // 假设rolePermission对象包含roleName和permissionName字段
          // 如果后端返回的字段名不同，需要根据实际情况调整
          const roleName = rolePermission.roleName || rolePermission.role?.name;
          const permissionName = rolePermission.permissionName || rolePermission.permission?.name;
          
          if (roleName && permissionName && rolePermissionMap[roleName]) {
            rolePermissionMap[roleName].push(permissionName);
          }
        });
      } else {
        console.warn('Role permissions data is not an array, using empty array instead');
      }
      
      // 保存到localStorage
      localStorage.setItem('systemRolePermissions', JSON.stringify(rolePermissionMap));
      
      // 刷新当前用户的权限信息
      if (currentUser && currentUser.role && rolePermissionMap[currentUser.role]) {
        const updatedUser = {
          ...currentUser,
          permissions: [...new Set([...(currentUser.permissions || []), ...rolePermissionMap[currentUser.role]])]
        };
        setCurrentUser(updatedUser);
        setUserInfo(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      }
      
      return rolePermissionMap;
    } catch (error) {
      console.error('Error fetching system role permissions:', error);
      // 如果获取失败，返回现有的角色权限映射
      return getSystemRolePermissions();
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!isAuthenticated || !currentUser) return false;
    return currentUser.role === role;
  };

  // Added for backward compatibility with App.jsx
  const isLoggedIn = isAuthenticated;
  
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
    fetchAndUpdateSystemRolePermissions
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