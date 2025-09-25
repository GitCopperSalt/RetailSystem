import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SmartCustomerService from '../components/SmartCustomerService';

const UserLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  // 用户端导航项
  const navItems = [
    {
      path: '/user/products',
      icon: 'fa-th-large',
      label: '商品列表'
    },
    {
      path: '/user/cart',
      icon: 'fa-shopping-cart',
      label: '购物车',
      badge: true
    },
    {
      path: '/user/orders',
      icon: 'fa-list-alt',
      label: '订单管理'
    },
    {
      path: '/user/addresses',
      icon: 'fa-map-marker',
      label: '地址管理'
    },
    {
      path: '/user/profile',
      icon: 'fa-user-circle',
      label: '个人中心'
    }
  ];

  // 处理搜索提交
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 实现搜索逻辑，这里简化处理
      console.log('搜索:', searchQuery);
      // 可以重定向到搜索结果页
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center">
              <i className="fa fa-store text-primary text-2xl mr-2"></i>
              <span className="text-lg font-bold text-primary">便捷购物</span>
            </div>

            {/* 搜索栏 - 仅在桌面显示 */}
            <div className="hidden md:block w-full max-w-md">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="搜索商品..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                  aria-label="搜索"
                >
                  <i className="fa fa-search"></i>
                </button>
              </form>
            </div>

            {/* 用户信息和移动菜单按钮 */}
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="relative group">
                  <button 
                    className="flex items-center text-gray-700 focus:outline-none hover:bg-gray-50 p-2 rounded-full transition-colors duration-200"
                    aria-label="用户菜单"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                      <i className="fa fa-user text-primary"></i>
                    </div>
                    <span className="text-sm hidden md:inline font-medium">{currentUser.username || currentUser.name || '用户'}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-dropdown opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="py-1">
                      <Link to="/user/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">个人中心</Link>
                      <Link to="/user/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">我的订单</Link>
                      <button 
                        onClick={() => logout()}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-danger"
                      >退出登录</button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary px-4 py-1 text-sm">
                  登录
                </Link>
              )}

              {/* 购物车快捷入口 - 仅在移动显示 */}
              <Link 
                to="/user/cart" 
                className="md:hidden text-gray-700 hover:text-primary relative"
                aria-label="购物车"
              >
                <i className="fa fa-shopping-cart text-xl"></i>
                <span className="absolute -top-1 -right-1 bg-danger text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </Link>

              {/* 移动菜单按钮 */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-700 hover:text-primary focus:outline-none"
                aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
              >
                <i className={`fa ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* 桌面导航 */}
        <nav className="hidden md:block bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-6">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center py-3 px-2 text-gray-700 hover:text-primary transition-all duration-200 relative
                    ${location.pathname === item.path ? 'text-primary font-medium' : ''}`}
                >
                  <i className={`fa ${item.icon} mr-2`}></i>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1.5 bg-danger text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      3
                    </span>
                  )}
                  {location.pathname === item.path && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* 移动端导航 */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t animate-in fade-in slide-in-from-top-5">
            {/* 移动端搜索 */}
            <div className="p-3 border-b border-gray-100">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="搜索商品..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                  aria-label="搜索"
                >
                  <i className="fa fa-search"></i>
                </button>
              </form>
            </div>
            
            {/* 移动端菜单 */}
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`block py-3 px-4 border-b border-gray-100 text-gray-700 transition-all duration-200
                  ${location.pathname === item.path ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-50'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <i className={`fa ${item.icon} w-6 text-center`}></i>
                  <span className="ml-3">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-danger text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      3
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* 主内容区域 */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="fade-in">
          <Outlet />
        </div>
      </main>

      {/* 智能客服悬浮按钮 - 仅在用户登录后显示 */}
      {currentUser && <SmartCustomerService />}

      {/* 页脚 */}
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">关于我们</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary transition-colors duration-200">公司介绍</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">新闻动态</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">加入我们</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">客户服务</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary transition-colors duration-200">帮助中心</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">联系我们</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">投诉建议</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">商务合作</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary transition-colors duration-200">供应商合作</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">广告投放</a></li>
                <li><a href="#" className="hover:text-primary transition-colors duration-200">招商加盟</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">关注我们</h3>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all duration-200" aria-label="微信公众号">
                  <i className="fa fa-weixin"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all duration-200" aria-label="微博">
                  <i className="fa fa-weibo"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all duration-200" aria-label="抖音">
                  <i className="fa fa-music"></i>
                </a>
              </div>
              <p className="text-sm text-gray-600">客服电话：400-123-4567</p>
              <p className="text-sm text-gray-600">服务时间：9:00-21:00</p>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
            <p>© 2024 零售智能运营系统 - 用户端. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;