import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState('admin'); // 'admin' or 'user'
  const [userLoginMethod, setUserLoginMethod] = useState('password'); // 'password' or 'wechat'
  const navigate = useNavigate();
  const { login, wechatLogin } = useAuth();

  // 处理用户账号密码登录
  const handleUserPasswordLogin = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await login({ username, password, type: 'user' });
      navigate('/user/products');
    } catch (err) {
      setError(err.message || '登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理管理员登录
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await login({ username, password, type: 'admin' });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || '登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理用户微信登录
  const handleWechatLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // 这里应该集成微信API
      // 为了演示目的，使用模拟的openid
      await wechatLogin('user123');
      navigate('/user/products');
    } catch (err) {
      setError('微信登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
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