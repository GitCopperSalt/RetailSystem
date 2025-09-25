import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  // 管理面板导航项
  const navItems = [
    {
      path: '/admin/dashboard',
      icon: 'fa-home',
      label: '工作台',
      permission: 'dashboard_view'
    },
    {
      path: '/admin/products',
      icon: 'fa-shopping-bag',
      label: '商品管理',
      permission: 'product_view'
    },
    {
      path: '/admin/orders',
      icon: 'fa-shopping-cart',
      label: '订单管理',
      permission: 'order_view'
    },
    {
      path: '/admin/inventory',
      icon: 'fa-archive',
      label: '库存管理',
      permission: 'inventory_view'
    },
    {
      path: '/admin/messages',
      icon: 'fa-bell',
      label: '消息中心',
      permission: 'message_view'
    },
    {
      path: '/admin/analytics',
      icon: 'fa-chart-bar',
      label: '数据分析',
      permission: 'analytics_view'
    },
    {
      path: '/admin/categories',
      icon: 'fa-th-large',
      label: '分类管理',
      permission: 'category_view'
    },
    {
      path: '/admin/discounts',
      icon: 'fa-tags',
      label: '折扣管理',
      permission: 'discount_view'
    },
    {
      path: '/admin/permissions',
      icon: 'fa-lock',
      label: '权限管理',
      permission: 'user_view'
    }
  ];

  // Check if current user has permission for a nav item
  const canAccess = (item) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true; // Admin has all permissions
    
    return currentUser.permissions && currentUser.permissions.includes(item.permission);
  };

  // Filter nav items based on permissions
  const filteredNavItems = navItems.filter(item => canAccess(item));

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      logout();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* 侧边栏导航 */}
      <aside 
        className={`bg-white shadow-md transition-all duration-300 ease-in-out business
          ${sidebarOpen ? 'w-64' : 'w-0 md:w-20'}`}
        aria-label="管理面板导航"
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className={`flex items-center ${!sidebarOpen && 'md:justify-center w-full'}`}>
            <i className="fa fa-store text-primary text-2xl mr-2"></i>
            {sidebarOpen && <span className="text-lg font-bold text-primary">零售智能运营系统</span>}
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`text-gray-500 hover:text-primary focus:outline-none transition-colors duration-200
              ${!sidebarOpen && 'hidden md:block'}`}
            aria-label={sidebarOpen ? '收起侧边栏' : '展开侧边栏'}
          >
            <i className={`fa fa-chevron-${sidebarOpen ? 'left' : 'right'}`}></i>
          </button>
        </div>
        
        <nav className="py-4">
          {filteredNavItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : 'text-gray-700 hover:bg-gray-100'}
                ${!sidebarOpen && 'md:justify-center'}`}
              aria-label={item.label}
            >
              <i className={`fa ${item.icon} w-5 text-center mr-3 ${sidebarOpen ? '' : 'mx-auto'}`}></i>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-primary md:hidden focus:outline-none"
            aria-label="切换侧边栏"
          >
            <i className={`fa fa-bars text-xl`}></i>
          </button>
          
          <div className="flex items-center space-x-6">
            {/* 页面标题 */}
            <h1 className="text-xl font-semibold text-gray-900 hidden md:block">
              {filteredNavItems.find(item => location.pathname === item.path)?.label || '工作台'}
            </h1>
            
            {/* 用户信息 */}
            <div className="relative">
              <button 
                className="flex items-center text-gray-700 focus:outline-none hover:bg-gray-50 p-2 rounded-full transition-colors duration-200"
                onClick={handleLogout}
                aria-label="退出登录"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <i className="fa fa-user text-primary"></i>
                </div>
                <span className="hidden md:inline">{currentUser?.username || '管理员'}</span>
                <i className="fa fa-sign-out ml-2 text-gray-400"></i>
              </button>
            </div>
          </div>
        </header>

        {/* 内容区域 */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 custom-scrollbar">
          <div className="fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;