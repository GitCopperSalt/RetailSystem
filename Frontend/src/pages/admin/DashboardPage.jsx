import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartJSTooltip, Legend, ArcElement } from 'chart.js';
import { useAuth } from '../../context/AuthContext';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartJSTooltip, Legend, ArcElement);

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for dashboard
  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      setTimeout(() => {
        const mockData = {
          summary: {
            totalOrders: 128,
            totalRevenue: 18560.50,
            pendingOrders: 12,
            lowStockItems: 5
          },
          salesTrend: [
            { day: '周一', sales: 3500 },
            { day: '周二', sales: 2800 },
            { day: '周三', sales: 4200 },
            { day: '周四', sales: 3900 },
            { day: '周五', sales: 5100 },
            { day: '周六', sales: 6800 },
            { day: '周日', sales: 5200 }
          ],
          categoryDistribution: [
            { name: '生鲜食品', value: 35 },
            { name: '日用品', value: 25 },
            { name: '粮油调味', value: 20 },
            { name: '休闲零食', value: 15 },
            { name: '其他', value: 5 }
          ],
          topSellers: [
            { id: 1, name: '有机蔬菜礼盒', price: 89.90, sales: 45, image: 'https://picsum.photos/80' },
            { id: 2, name: '优质大米 5kg', price: 49.90, sales: 38, image: 'https://picsum.photos/80' },
            { id: 3, name: '纯牛奶 1L*12', price: 69.90, sales: 32, image: 'https://picsum.photos/80' },
            { id: 4, name: '精选苹果 10个装', price: 39.90, sales: 28, image: 'https://picsum.photos/80' },
            { id: 5, name: '天然矿泉水 500ml*24', price: 29.90, sales: 25, image: 'https://picsum.photos/80' }
          ],
          recentOrders: [
            { id: 'ORD-20240518-001', customer: '张三', amount: 128.50, status: 'processing', time: '10:23' },
            { id: 'ORD-20240518-002', customer: '李四', amount: 89.90, status: 'processing', time: '09:45' },
            { id: 'ORD-20240518-003', customer: '王五', amount: 156.80, status: 'delivered', time: '09:12' },
            { id: 'ORD-20240518-004', customer: '赵六', amount: 69.90, status: 'cancelled', time: '08:30' },
            { id: 'ORD-20240518-005', customer: '孙七', amount: 99.90, status: 'completed', time: '08:15' }
          ]
        };
        setDashboardData(mockData);
        setLoading(false);
      }, 800);
    };

    fetchDashboardData();
  }, []);

  // Get status color and label
  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { color: 'bg-warning/20 text-warning', label: '待接单' },
      processing: { color: 'bg-info/20 text-info', label: '准备中' },
      delivered: { color: 'bg-primary/20 text-primary', label: '配送中' },
      completed: { color: 'bg-success/20 text-success', label: '已完成' },
      cancelled: { color: 'bg-danger/20 text-danger', label: '已取消' }
    };
    return statusMap[status] || { color: 'bg-gray-200 text-gray-700', label: '未知' };
  };

  // Chart colors
  const COLORS = ['#4F46E5', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">加载数据中...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <i className="fa fa-exclamation-circle text-4xl text-warning mb-4"></i>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">无法加载数据</h3>
        <p className="text-gray-500">请稍后重试或联系系统管理员</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">工作台</h1>
          <p className="text-gray-500 mt-1">欢迎回来，{currentUser?.name}！以下是您的今日运营概览</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="btn btn-secondary flex items-center">
            <i className="fa fa-download mr-2"></i>
            导出报告
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">今日订单</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{dashboardData.summary.totalOrders}</h3>
              <p className="text-sm text-success mt-1 flex items-center">
                <i className="fa fa-arrow-up mr-1"></i>
                12.5% 较昨日
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <i className="fa fa-shopping-cart text-primary text-xl"></i>
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-secondary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">今日销售额</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">¥{dashboardData.summary.totalRevenue.toFixed(2)}</h3>
              <p className="text-sm text-success mt-1 flex items-center">
                <i className="fa fa-arrow-up mr-1"></i>
                8.2% 较昨日
              </p>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg">
              <i className="fa fa-money-bill-wave text-secondary text-xl"></i>
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">待处理订单</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{dashboardData.summary.pendingOrders}</h3>
              <p className="text-sm text-danger mt-1 flex items-center">
                <i className="fa fa-arrow-up mr-1"></i>
                5.3% 较昨日
              </p>
            </div>
            <div className="p-3 bg-warning/10 rounded-lg">
              <i className="fa fa-clock text-warning text-xl"></i>
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-danger">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">低库存商品</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{dashboardData.summary.lowStockItems}</h3>
              <p className="text-sm text-danger mt-1 flex items-center">
                <i className="fa fa-arrow-up mr-1"></i>
                2 个新品
              </p>
            </div>
            <div className="p-3 bg-danger/10 rounded-lg">
              <i className="fa fa-exclamation-triangle text-danger text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Trend Chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">本周销售趋势</h3>
            <div className="flex space-x-2">
              <button className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">周</button>
              <button className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded">月</button>
              <button className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded">季</button>
            </div>
          </div>
          <div className="h-64 w-full">
              <Bar 
                data={{
                  labels: dashboardData.salesTrend.map(item => item.day),
                  datasets: [{
                    label: '销售额',
                    data: dashboardData.salesTrend.map(item => item.sales),
                    backgroundColor: '#4F46E5',
                    borderRadius: 4
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: {
                        display: true,
                        color: '#f0f0f0',
                        drawBorder: false,
                        drawOnChartArea: true,
                        drawTicks: false,
                        tickLength: 10,
                        borderDash: ['3 3']
                      }
                    },
                    y: {
                      grid: {
                        display: true,
                        color: '#f0f0f0',
                        drawBorder: false,
                        drawOnChartArea: true,
                        drawTicks: false,
                        tickLength: 10,
                        borderDash: ['3 3']
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return [`¥${context.parsed.y}`, '销售额'];
                        }
                      }
                    }
                  }
                }}
              />
          </div>
        </div>

        {/* Category Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">商品分类占比</h3>
          <div className="h-64 w-full">
                  <Pie
                    data={{
                      labels: dashboardData.categoryDistribution.map(item => item.name),
                      datasets: [{
                        data: dashboardData.categoryDistribution.map(item => item.value),
                        backgroundColor: COLORS.slice(0, dashboardData.categoryDistribution.length)
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right'
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return [`${context.parsed}%`, '占比'];
                            }
                          }
                        }
                      },
                      cutout: '75%',
                      padding: 2,
                      radius: '70%'
                    }}
                  />
          </div>
        </div>
      </div>

      {/* Top Sellers and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Sellers */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">热销商品 TOP 5</h3>
            <Link to="/admin/products" className="text-primary text-sm hover:underline">
              查看全部
            </Link>
          </div>
          <div className="space-y-4">
            {dashboardData.topSellers.map((product, index) => (
              <div key={product.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-gray-100 rounded-md h-12 w-12 flex-shrink-0 flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-8 w-8 object-cover"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center">
                    <span className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded mr-2">
                      #{index + 1}
                    </span>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{product.name}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">¥{product.price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{product.sales} 件</p>
                  <p className="text-xs text-success mt-0.5">热销</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">最近订单</h3>
            <Link to="/admin/orders" className="text-primary text-sm hover:underline">
              查看全部
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>订单编号</th>
                  <th>顾客</th>
                  <th>金额</th>
                  <th>状态</th>
                  <th>下单时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.recentOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="text-sm text-gray-500">{order.customer}</td>
                      <td className="text-sm font-semibold text-gray-900">¥{order.amount.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="text-sm text-gray-500">{order.time}</td>
                      <td>
                        <button className="text-primary hover:text-primary/80 text-sm">
                          查看详情
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;