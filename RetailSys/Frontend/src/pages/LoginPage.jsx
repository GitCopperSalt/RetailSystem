import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState('admin'); // 'admin' or 'user'
  const [userLoginMethod, setUserLoginMethod] = useState('password'); // 'password' or 'wechat'
  const navigate = useNavigate();
  const { login, wechatLogin } = useAuth();

  // 组件挂载时检查是否已登录
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // 验证token是否有效（可以通过调用一个需要认证的简单接口）
          try {
            const response = await axios.get('/api/auth/me', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // 如果token有效，根据用户角色跳转到对应的页面
            if (response.data && response.data.role) {
              const role = response.data.role.toLowerCase();
              if (role === 'admin' || role === 'store_manager') {
                navigate('/admin/dashboard');
              } else {
                navigate('/user/products');
              }
            }
          } catch (err) {
            // Token无效或过期，继续显示登录页面
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
          }
        }
      } catch (error) {
        console.error('检查登录状态失败:', error);
      }
    };

    checkLoginStatus();
  }, [navigate]);

  // 处理用户账号密码登录
  const handleUserPasswordLogin = async (e) => {
    e.preventDefault();
    
    // 表单验证
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // 调用登录方法，获取用户数据
      const userData = await login({ username, password });
      
      // 根据后端返回的用户角色进行跳转
      if (userData.role) {
        const role = userData.role.toLowerCase();
        if (role === 'admin' || role === 'store_manager') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/products');
        }
      } else {
        navigate('/user/products');
      }
    } catch (err) {
      // 处理不同类型的错误
      if (err.response && err.response.status === 401) {
        setError('用户名或密码错误，请重试');
      } else if (err.response && err.response.status === 403) {
        setError('该账号没有用户访问权限');
      } else {
        setError(err.message || '登录失败，请重试');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 处理管理员登录
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    // 表单验证
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // 调用登录方法，获取用户数据
      const userData = await login({ username, password });
      
      // 根据后端返回的用户角色进行跳转
      if (userData.role && (userData.role.toLowerCase() === 'admin' || userData.role.toLowerCase() === 'store_manager')) {
        navigate('/admin/dashboard');
      } else {
        // 如果不是管理员角色，则显示错误信息
        setError('该账号没有管理权限');
      }
    } catch (err) {
      // 处理不同类型的错误
      if (err.response && err.response.status === 401) {
        setError('用户名或密码错误，请重试');
      } else if (err.response && err.response.status === 403) {
        setError('该账号没有管理权限');
      } else {
        setError(err.message || '登录失败，请重试');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 处理用户微信登录
  const handleWechatLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // 在实际应用中，这里应该调用微信官方API获取授权码
      // 然后使用该授权码调用后端的微信登录接口
      // 为了演示目的，我们使用模拟的code
      const mockCode = 'mock_wechat_code_' + Date.now();
      
      // 调用微信登录方法
      const userData = await wechatLogin(mockCode);
      
      // 登录成功后跳转到用户首页
      navigate('/user/products');
    } catch (err) {
      // 处理微信登录错误
      setError(err.message || '微信登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理忘记密码
  const handleForgotPassword = (e) => {
    e.preventDefault();
    // 实现忘记密码逻辑
    navigate('/forgot-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 装饰性元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* 返回主页按钮 */}
      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={() => navigate('/')}
          className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-primary"
          aria-label="返回主页"
        >
          <i className="fa fa-arrow-left"></i>
        </button>
      </div>
      
      {/* 登录卡片 */}
      <div className="relative z-10 max-w-md w-full bg-white rounded-xl shadow-elevated overflow-hidden transition-all duration-500 hover:shadow-lg">
        {/* 头部渐变 */}
        <div className="h-2 bg-gradient-to-r from-primary to-primary/80"></div>
        
        <div className="p-8 space-y-8">
          {/* 品牌标识 */}
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center shadow-sm transition-transform duration-300 hover:scale-105">
              <i className="fa fa-store text-primary text-3xl"></i>
            </div>
            <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
              {loginType === 'admin' ? '管理终端登录' : '用户登录'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {loginType === 'admin' 
                ? '请输入您的用户名和密码' 
                : '请选择登录方式'}
            </p>
          </div>

          {/* 登录类型切换 */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden transition-all duration-300">
            <button
              type="button"
              className={`flex-1 py-2.5 px-4 text-center transition-all duration-300 font-medium ${loginType === 'admin' 
                ? 'bg-primary text-white shadow-sm' 
                : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setLoginType('admin')}
              aria-pressed={loginType === 'admin'}
            >
              管理登录
            </button>
            <button
              type="button"
              className={`flex-1 py-2.5 px-4 text-center transition-all duration-300 font-medium ${loginType === 'user' 
                ? 'bg-primary text-white shadow-sm' 
                : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setLoginType('user')}
              aria-pressed={loginType === 'user'}
            >
              用户登录
            </button>
          </div>

          {/* 错误信息 */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-danger px-4 py-3 rounded-lg animate-in fade-in slide-in-from-top-3">
              <i className="fa fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          {/* 管理员登录表单 */}
          {loginType === 'admin' ? (
            <form className="mt-8 space-y-5" onSubmit={handleAdminLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    用户名
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="input w-full px-4 py-2.5"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入用户名"
                    aria-label="用户名"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    密码
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="input w-full px-4 py-2.5"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    aria-label="密码"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-primary text-white rounded-lg font-medium transition-all duration-300 hover:bg-primary/90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="loader mr-2 h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      登录中...
                    </div>
                  ) : (
                    '登录'
                  )}
                </button>
              </div>

              <div className="text-center text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors duration-200">
                  忘记密码?
                </a>
              </div>
            </form>
          ) : (
            // 用户登录方式
            <>
              {/* 登录方式切换 */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 mb-6">
                <button
                  type="button"
                  className={userLoginMethod === 'password' 
                    ? "flex-1 py-2 text-center transition-all duration-300 font-medium text-sm bg-primary text-white shadow-sm" 
                    : "flex-1 py-2 text-center transition-all duration-300 font-medium text-sm bg-white text-gray-700 hover:bg-gray-50"}
                  onClick={() => setUserLoginMethod('password')}
                  aria-pressed={userLoginMethod === 'password'}
                >
                  账号密码登录
                </button>
                <button
                  type="button"
                  className={userLoginMethod === 'wechat' 
                    ? "flex-1 py-2 text-center transition-all duration-300 font-medium text-sm bg-primary text-white shadow-sm" 
                    : "flex-1 py-2 text-center transition-all duration-300 font-medium text-sm bg-white text-gray-700 hover:bg-gray-50"}
                  onClick={() => setUserLoginMethod('wechat')}
                  aria-pressed={userLoginMethod === 'wechat'}
                >
                  微信一键登录
                </button>
              </div>

              {/* 用户账号密码登录表单 */}
              {userLoginMethod === 'password' ? (
                <form className="mt-4 space-y-5" onSubmit={handleUserPasswordLogin}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        用户名
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        className="input w-full px-4 py-2.5"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="请输入用户名"
                        aria-label="用户名"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        密码
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="input w-full px-4 py-2.5"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="请输入密码"
                        aria-label="密码"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-primary text-white rounded-lg font-medium transition-all duration-300 hover:bg-primary/90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-70 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="loader mr-2 h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          登录中...
                        </div>
                      ) : (
                        '登录'
                      )}
                    </button>
                  </div>

                  <div className="text-center text-sm">
                    <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors duration-200">
                      忘记密码?
                    </a>
                  </div>
                </form>
              ) : (
                // 用户微信登录
                <div className="mt-8 flex flex-col items-center">
                  <button
                    onClick={handleWechatLogin}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center transition-all duration-300 hover:bg-green-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-70 disabled:cursor-not-allowed"
                    aria-label="微信一键登录"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="loader mr-2 h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        登录中...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <i className="fa fa-weixin text-xl mr-2"></i>
                        微信一键登录
                      </div>
                    )}
                  </button>
                  <p className="mt-6 text-sm text-gray-500 text-center">
                    登录即表示您同意我们的
                    <a href="#" className="text-primary hover:text-primary/80 mx-1 transition-colors duration-200">
                      用户协议
                    </a>
                    和
                    <a href="#" className="text-primary hover:text-primary/80 mx-1 transition-colors duration-200">
                      隐私政策
                    </a>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;