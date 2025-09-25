import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import dayjs from 'dayjs';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsPage = () => {
  const { hasPermission } = useAuth();
  const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month', 'year'
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState({});
  const [categoryData, setCategoryData] = useState({});
  const [topProducts, setTopProducts] = useState([]);
  const [inventoryTurnover, setInventoryTurnover] = useState(0);

  // Generate mock data for analytics
  useEffect(() => {
    // Simulate API call
    const fetchAnalyticsData = async () => {
      setLoading(true);
      
      setTimeout(() => {
        // Generate sales data based on time range
        let labels = [];
        let revenueData = [];
        let orderCountData = [];
        let customerCountData = [];
        
        const today = dayjs();
        
        if (timeRange === 'day') {
          // Last 24 hours
          for (let i = 23; i >= 0; i--) {
            const hour = today.subtract(i, 'hour');
            labels.push(hour.format('HH:00'));
            revenueData.push(Math.floor(Math.random() * 500) + 100);
            orderCountData.push(Math.floor(Math.random() * 20) + 5);
            customerCountData.push(Math.floor(Math.random() * 15) + 3);
          }
        } else if (timeRange === 'week') {
          // Last 7 days
          for (let i = 6; i >= 0; i--) {
            const day = today.subtract(i, 'day');
            labels.push(day.format('MM/DD'));
            revenueData.push(Math.floor(Math.random() * 3000) + 1000);
            orderCountData.push(Math.floor(Math.random() * 80) + 30);
            customerCountData.push(Math.floor(Math.random() * 60) + 20);
          }
        } else if (timeRange === 'month') {
          // Last 30 days
          for (let i = 29; i >= 0; i--) {
            const day = today.subtract(i, 'day');
            labels.push(day.format('MM/DD'));
            revenueData.push(Math.floor(Math.random() * 4000) + 1500);
            orderCountData.push(Math.floor(Math.random() * 100) + 40);
            customerCountData.push(Math.floor(Math.random() * 80) + 30);
          }
        } else if (timeRange === 'year') {
          // Last 12 months
          for (let i = 11; i >= 0; i--) {
            const month = today.subtract(i, 'month');
            labels.push(month.format('YYYY/MM'));
            revenueData.push(Math.floor(Math.random() * 80000) + 30000);
            orderCountData.push(Math.floor(Math.random() * 2000) + 1000);
            customerCountData.push(Math.floor(Math.random() * 1500) + 800);
          }
        }
        
        // Calculate total revenue
        const totalRevenue = revenueData.reduce((sum, value) => sum + value, 0);
        const totalOrders = orderCountData.reduce((sum, value) => sum + value, 0);
        const totalCustomers = customerCountData.reduce((sum, value) => sum + value, 0);
        const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00';
        
        // Set sales data
        setSalesData({
          labels,
          revenueData,
          orderCountData,
          customerCountData,
          totalRevenue,
          totalOrders,
          totalCustomers,
          avgOrderValue
        });
        
        // Category distribution data
        const categoryColors = [
          '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'
        ];
        
        const categories = [
          { name: '蔬菜', revenue: 25000, orders: 500, profitMargin: 35 },
          { name: '水果', revenue: 18000, orders: 420, profitMargin: 30 },
          { name: '粮油', revenue: 32000, orders: 680, profitMargin: 25 },
          { name: '乳制品', revenue: 15000, orders: 390, profitMargin: 28 },
          { name: '饮料', revenue: 12000, orders: 350, profitMargin: 32 },
          { name: '零食', revenue: 10000, orders: 280, profitMargin: 40 },
          { name: '日用品', revenue: 8000, orders: 200, profitMargin: 38 }
        ];
        
        setCategoryData({
          labels: categories.map(c => c.name),
          revenue: categories.map(c => c.revenue),
          orders: categories.map(c => c.orders),
          profitMargin: categories.map(c => c.profitMargin),
          colors: categoryColors.slice(0, categories.length)
        });
        
        // Top products
        const products = [
          { id: 1, name: '有机蔬菜礼盒', revenue: 12000, sales: 134, profit: 4200 },
          { id: 2, name: '优质大米 5kg', revenue: 9800, sales: 196, profit: 2450 },
          { id: 3, name: '纯牛奶 1L*12', revenue: 8500, sales: 122, profit: 2380 },
          { id: 4, name: '精选苹果 10个装', revenue: 7200, sales: 180, profit: 2160 },
          { id: 5, name: '特级橄榄油 500ml', revenue: 6500, sales: 50, profit: 2600 }
        ];
        
        setTopProducts(products);
        
        // Calculate inventory turnover (mock value)
        setInventoryTurnover(3.2);
        
        setLoading(false);
      }, 1000);
    };
    
    fetchAnalyticsData();
  }, [timeRange]);

  // Prepare chart data
  const getSalesChartData = () => {
    return {
      labels: salesData.labels || [],
      datasets: [
        {
          label: '销售额',
          data: salesData.revenueData || [],
          borderColor: '#0088FE',
          backgroundColor: 'rgba(0, 136, 254, 0.1)',
          fill: true,
          tension: 0.3,
          yAxisID: 'y'
        },
        {
          label: '订单数',
          data: salesData.orderCountData || [],
          borderColor: '#00C49F',
          backgroundColor: 'rgba(0, 196, 159, 0.1)',
          fill: true,
          tension: 0.3,
          yAxisID: 'y1'
        }
      ]
    };
  };

  const getSalesChartOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false,
        },
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: '销售额 (¥)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: '订单数'
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    };
  };

  const getCategoryChartData = () => {
    return {
      labels: categoryData.labels || [],
      datasets: [
        {
          label: '销售额占比',
          data: categoryData.revenue || [],
          backgroundColor: categoryData.colors || [],
          borderWidth: 1,
        },
      ],
    };
  };

  const getCategoryChartOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        },
      },
    };
  };

  const getProfitMarginChartData = () => {
    return {
      labels: categoryData.labels || [],
      datasets: [
        {
          label: '毛利率 (%)',
          data: categoryData.profitMargin || [],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1,
        },
      ],
    };
  };

  const getProfitMarginChartOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 50,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        },
      },
    };
  };

  // Export data to Excel (mock function)
  const exportToExcel = (type) => {
    alert(`${type === 'sales' ? '销售数据' : '库存数据'}导出成功！`);
    // In a real implementation, this would create and download an Excel file
  };

  // Check if user can access analytics
  const canAccessAnalytics = hasPermission('view_analytics') || hasPermission('all');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">加载分析数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">数据分析</h1>
          <p className="text-gray-500 mt-1">多维度报表和数据可视化</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          {/* Time Range Selector */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex">
            <button 
              className={`px-4 py-2 text-sm ${timeRange === 'day' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setTimeRange('day')}
            >
              日
            </button>
            <button 
              className={`px-4 py-2 text-sm ${timeRange === 'week' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setTimeRange('week')}
            >
              周
            </button>
            <button 
              className={`px-4 py-2 text-sm ${timeRange === 'month' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setTimeRange('month')}
            >
              月
            </button>
            <button 
              className={`px-4 py-2 text-sm ${timeRange === 'year' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setTimeRange('year')}
            >
              年
            </button>
          </div>
          
          {/* Export Buttons */}
          {canAccessAnalytics && (
            <div className="flex space-x-2">
              <button 
                className="btn btn-secondary"
                onClick={() => exportToExcel('sales')}
              >
                <i className="fa fa-download mr-1"></i>导出销售数据
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => exportToExcel('inventory')}
              >
                <i className="fa fa-download mr-1"></i>导出库存数据
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">总销售额</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">¥{salesData.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <i className="fa fa-line-chart text-primary text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">订单总数</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{salesData.totalOrders.toLocaleString()}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <i className="fa fa-shopping-bag text-success text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">顾客总数</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{salesData.totalCustomers.toLocaleString()}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <i className="fa fa-users text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">平均订单价值</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">¥{salesData.avgOrderValue}</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <i className="fa fa-money text-yellow-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Trends Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">销售趋势</h2>
        <div className="h-80">
          <Line data={getSalesChartData()} options={getSalesChartOptions()} />
        </div>
      </div>

      {/* Category Analysis and Profit Margin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">商品类别分布</h2>
          <div className="h-80">
            <Pie data={getCategoryChartData()} options={getCategoryChartOptions()} />
          </div>
        </div>
        
        {/* Profit Margin by Category */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">各品类毛利率</h2>
          <div className="h-80">
            <Bar data={getProfitMarginChartData()} options={getProfitMarginChartOptions()} />
          </div>
        </div>
      </div>

      {/* Top Products and Inventory Turnover */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top 5 畅销商品</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-gray-50">
                  <th>商品名称</th>
                  <th>销售额</th>
                  <th>销量</th>
                  <th>利润</th>
                  <th>利润率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topProducts.map((product, index) => {
                  const profitMargin = ((product.profit / product.revenue) * 100).toFixed(1);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 text-primary font-semibold`}>
                            {index + 1}
                          </div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">¥{product.revenue.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{product.sales}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-success">¥{product.profit.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900 mr-2">{profitMargin}%</div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-success h-2 rounded-full" 
                              style={{ width: `${Math.min(100, profitMargin)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Inventory Analytics */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">库存分析</h2>
          
          {/* Inventory Turnover */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">库存周转率</span>
              <span className="text-base font-medium text-gray-900">{inventoryTurnover} 次/月</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full bg-primary"
                style={{ width: `${(inventoryTurnover / 5) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>低</span>
              <span>高</span>
            </div>
          </div>
          
          {/* Category Performance */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">类别表现</h3>
            <div className="space-y-4">
              {categoryData.labels && categoryData.revenue && categoryData.labels.map((category, index) => {
                const totalRevenue = categoryData.revenue.reduce((sum, value) => sum + value, 0);
                const percentage = totalRevenue > 0 ? ((categoryData.revenue[index] / totalRevenue) * 100).toFixed(1) : '0';
                return (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">{category}</span>
                      <span className="text-xs font-medium text-gray-900">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: categoryData.colors[index]
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;