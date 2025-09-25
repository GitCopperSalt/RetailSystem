import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useState, useEffect, useRef } from 'react';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HomePage = () => {
  // 导航栏滚动状态
  const [scrolled, setScrolled] = useState(false);
  // 移动端菜单状态
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // 元素可见性状态
  const [visibleSections, setVisibleSections] = useState({
    hero: false,
    features: false,
    analytics: false,
    about: false,
    cta: false
  });
  
  // 引用各部分
  const sectionRefs = {
    hero: useRef(null),
    features: useRef(null),
    analytics: useRef(null),
    about: useRef(null),
    cta: useRef(null)
  };
  
  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      // 导航栏滚动效果
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // 检测元素可见性，用于滚动动画
      setVisibleSections(prevVisibleSections => {
        const newVisibleSections = { ...prevVisibleSections };
        
        Object.entries(sectionRefs).forEach(([key, ref]) => {
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const isVisible = (
              rect.top <= window.innerHeight * 0.8 && 
              rect.bottom >= window.innerHeight * 0.2
            );
            
            if (isVisible !== prevVisibleSections[key]) {
              newVisibleSections[key] = isVisible;
            }
          }
        });
        
        return newVisibleSections;
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // 初始化时检查一次
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // 移除sectionRefs依赖，避免无限循环
  
  // 数据可视化示例数据
  const salesData = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
    datasets: [
      {
        label: '销售额 (万元)',
        data: [65, 59, 80, 81, 56, 85],
        backgroundColor: '#1E40AF',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="min-h-screen bg-light text-dark font-sans">
      {/* 导航栏 - 带滚动效果 */}
      <nav className={`bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 shadow-md' : 'py-4'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <i className="fa fa-store text-primary text-2xl"></i>
              <span className="text-xl font-bold text-dark">零售智能运营系统</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-primary transition-colors flex items-center">
                <i className="fa fa-tasks mr-2"></i>功能
              </a>
              <a href="#analytics" className="text-gray-600 hover:text-primary transition-colors flex items-center">
                <i className="fa fa-bar-chart mr-2"></i>数据分析
              </a>
              <a href="#about" className="text-gray-600 hover:text-primary transition-colors flex items-center">
                <i className="fa fa-info-circle mr-2"></i>关于我们
              </a>
              <Link to="/login" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors shadow-btn flex items-center">
                <i className="fa fa-sign-in mr-2"></i>登录
              </Link>
            </div>
            <div className="md:hidden">
              <button 
                className="text-gray-600 hover:text-primary transition-colors duration-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <i className={`fa ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          
          {/* 移动端下拉菜单 */}
          <div className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out transform z-50 ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col space-y-3">
                <a 
                  href="#features" 
                  className="text-gray-600 hover:text-primary transition-colors py-2 flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fa fa-tasks mr-2"></i>功能
                </a>
                <a 
                  href="#analytics" 
                  className="text-gray-600 hover:text-primary transition-colors py-2 flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fa fa-bar-chart mr-2"></i>数据分析
                </a>
                <a 
                  href="#about" 
                  className="text-gray-600 hover:text-primary transition-colors py-2 flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fa fa-info-circle mr-2"></i>关于我们
                </a>
                <Link 
                  to="/login" 
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors shadow-btn flex items-center justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fa fa-sign-in mr-2"></i>登录
                </Link>
              </div>
            </div>
          </div>
          </div>
        </div>
      </nav>

      {/* 英雄区 - 增强装饰效果 */}
      <section 
        ref={sectionRefs.hero}
        className={`relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-gradient-start/5 to-gradient-end/5 transition-all duration-1000 transform ${visibleSections.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        {/* 装饰网格线 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231E40AF' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-70 pointer-events-none"></div>
        {/* 装饰元素 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl relative z-10">
              {/* 装饰性标签 - 增强视觉吸引力 */}
              <div className="inline-flex items-center px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 group">
                <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                行业领先的零售解决方案
                <div className="ml-2 w-1.5 h-1.5 bg-primary rounded-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="ml-1 w-1.5 h-1.5 bg-primary rounded-full opacity-50 group-hover:opacity-80 transition-opacity"></div>
              </div>
              <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-tight text-dark mb-6">
                <span className="inline-block">智能驱动</span><br />
                <span className="text-primary inline-flex items-center">
                  零售未来
                  <i className="fa fa-arrow-right ml-2"></i>
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                一体化的零售管理平台，结合数据分析与智能决策，助力您的业务实现可持续增长。从商品管理到客户体验，全方位提升运营效率。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/login" 
                  className="bg-primary hover:bg-primary/90 text-white text-base font-medium py-3 px-8 rounded-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center"
                >
                  <i className="fa fa-rocket mr-2"></i>立即体验
                </Link>
                <Link 
                  to="/user/products" 
                  className="bg-white border border-gray-200 hover:border-primary/30 text-dark hover:text-primary text-base font-medium py-3 px-8 rounded-md transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex items-center justify-center"
                >
                  <i className="fa fa-eye mr-2"></i>浏览演示
                </Link>
              </div>
            </div>
            
            {/* 数据可视化卡片 - 增强视觉效果 */}
            <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-elevated p-6 relative z-10 transform transition-transform hover:scale-[1.02] duration-500 hover:shadow-xl border border-gray-100">
              <div className="absolute -top-1.5 -right-1.5 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <i className="fa fa-line-chart text-primary"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">销售趋势分析</h3>
              <div className="h-64">
                <Bar data={salesData} options={chartOptions} />
              </div>
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>2024年上半年数据</span>
                <span className="text-primary font-medium">查看详情</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 客户信任区 - 增强视觉吸引力 */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* 装饰元素 */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1/3 h-64 bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl -z-10"></div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1/3 h-64 bg-gradient-to-l from-accent/5 to-transparent rounded-full blur-3xl -z-10"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm uppercase tracking-wider">值得信赖的合作伙伴</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
            <div className="text-2xl font-bold text-gray-400 transition-all duration-500 hover:text-primary/80 hover:-translate-y-1 flex items-center">
              <i className="fa fa-building mr-2"></i>
              <span className="inline-block border-b-2 border-transparent hover:border-primary/30 pb-1">品牌A</span>
            </div>
            <div className="text-2xl font-bold text-gray-400 transition-all duration-500 hover:text-primary/80 hover:-translate-y-1 flex items-center">
              <i className="fa fa-building mr-2"></i>
              <span className="inline-block border-b-2 border-transparent hover:border-primary/30 pb-1">品牌B</span>
            </div>
            <div className="text-2xl font-bold text-gray-400 transition-all duration-500 hover:text-primary/80 hover:-translate-y-1 flex items-center">
              <i className="fa fa-building mr-2"></i>
              <span className="inline-block border-b-2 border-transparent hover:border-primary/30 pb-1">品牌C</span>
            </div>
            <div className="text-2xl font-bold text-gray-400 transition-all duration-500 hover:text-primary/80 hover:-translate-y-1 flex items-center">
              <i className="fa fa-building mr-2"></i>
              <span className="inline-block border-b-2 border-transparent hover:border-primary/30 pb-1">品牌D</span>
            </div>
            <div className="text-2xl font-bold text-gray-400 transition-all duration-500 hover:text-primary/80 hover:-translate-y-1 flex items-center">
              <i className="fa fa-building mr-2"></i>
              <span className="inline-block border-b-2 border-transparent hover:border-primary/30 pb-1">品牌E</span>
            </div>
          </div>
        </div>
      </section>

      {/* 核心功能区 */}
      <section 
        id="features" 
        ref={sectionRefs.features}
        className={`py-20 bg-gray-50 transition-all duration-1000 transform ${visibleSections.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              强大功能
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">全方位零售管理解决方案</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              我们的系统融合了最新的技术与行业最佳实践，为您提供一站式的零售运营管理体验
            </p>
          </div>
          
          {/* 功能卡片网格 - 增强视觉深度 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* 装饰性线条 */}
            <div className="absolute left-1/2 top-[50%] w-[80%] h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent transform -translate-x-1/2 -z-10"></div>
            {/* 功能卡片 1 */}
            <div className="bg-white rounded-xl p-8 shadow-card border border-gray-100 transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2 group">
              <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                <i className="fa fa-tachometer text-primary text-2xl group-hover:scale-110 transition-transform"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <i className="fa fa-bar-chart text-primary mr-2"></i>智能数据分析
              </h3>
              <p className="text-gray-600 mb-6">
                多维度数据统计与分析，实时监控销售趋势、库存状况和客户行为，辅助科学决策。
              </p>
              <a href="#" className="text-primary hover:text-primary/80 font-medium inline-flex items-center group">
                <span>了解更多</span>
                <i className="fa fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
              </a>
            </div>

            {/* 功能卡片 2 */}
            <div className="bg-white rounded-xl p-8 shadow-card border border-gray-100 transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2 group">
              <div className="bg-accent/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/15 transition-colors">
                <i className="fa fa-shopping-cart text-accent text-2xl group-hover:scale-110 transition-transform"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <i className="fa fa-shopping-cart text-accent mr-2"></i>全渠道订单管理
              </h3>
              <p className="text-gray-600 mb-6">
                统一管理线上线下订单，自动同步库存，支持多种支付方式，提升订单处理效率。
              </p>
              <a href="#" className="text-accent hover:text-accent/80 font-medium inline-flex items-center group">
                <span>了解更多</span>
                <i className="fa fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
              </a>
            </div>

            {/* 功能卡片 3 */}
            <div className="bg-white rounded-xl p-8 shadow-card border border-gray-100 transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2 group">
              <div className="bg-success/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-success/15 transition-colors">
                <i className="fa fa-cubes text-success text-2xl group-hover:scale-110 transition-transform"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <i className="fa fa-cubes text-success mr-2"></i>智能库存管理
              </h3>
              <p className="text-gray-600 mb-6">
                自动化库存跟踪与预警，智能补货建议，减少库存积压和缺货风险，优化资金周转。
              </p>
              <a href="#" className="text-success hover:text-success/80 font-medium inline-flex items-center group">
                <span>了解更多</span>
                <i className="fa fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
              </a>
            </div>

            {/* 功能卡片 4 */}
            <div className="bg-white rounded-xl p-8 shadow-card border border-gray-100 transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2 group">
              <div className="bg-warning/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-warning/15 transition-colors">
                <i className="fa fa-users text-warning text-2xl group-hover:scale-110 transition-transform"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <i className="fa fa-users text-warning mr-2"></i>客户关系管理
              </h3>
              <p className="text-gray-600 mb-6">
                完善的会员体系，精准的客户画像，个性化营销推送，提升客户忠诚度和复购率。
              </p>
              <a href="#" className="text-warning hover:text-warning/80 font-medium inline-flex items-center group">
                <span>了解更多</span>
                <i className="fa fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
              </a>
            </div>

            {/* 功能卡片 5 */}
            <div className="bg-white rounded-xl p-8 shadow-card border border-gray-100 transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2 group">
              <div className="bg-danger/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-danger/15 transition-colors">
                <i className="fa fa-file-text text-danger text-2xl group-hover:scale-110 transition-transform"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <i className="fa fa-file-text text-danger mr-2"></i>智能报表系统
              </h3>
              <p className="text-gray-600 mb-6">
                自定义多维度报表，一键生成财务、销售、库存等数据报告，满足不同管理层需求。
              </p>
              <a href="#" className="text-danger hover:text-danger/80 font-medium inline-flex items-center group">
                <span>了解更多</span>
                <i className="fa fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
              </a>
            </div>

            {/* 功能卡片 6 */}
            <div className="bg-white rounded-xl p-8 shadow-card border border-gray-100 transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2 group">
              <div className="bg-info/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-info/15 transition-colors">
                <i className="fa fa-lock text-info text-2xl group-hover:scale-110 transition-transform"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <i className="fa fa-lock text-info mr-2"></i>精细权限管理
              </h3>
              <p className="text-gray-600 mb-6">
                角色化权限分配，多级审批流程，确保数据安全和操作规范，适应企业复杂组织架构。
              </p>
              <a href="#" className="text-info hover:text-info/80 font-medium inline-flex items-center group">
                <span>了解更多</span>
                <i className="fa fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 数据分析区 - 增强视觉层次感 */}
      <section 
        id="analytics" 
        ref={sectionRefs.analytics}
        className={`py-20 bg-white relative overflow-hidden transition-all duration-1000 transform ${visibleSections.analytics ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        {/* 装饰圆形 */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-accent/5 rounded-full filter blur-3xl -z-10"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2">
              <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                数据驱动
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">用数据指导决策，让业务持续增长</h2>
              <p className="text-gray-600 mb-8 text-lg">
                我们的智能分析系统能够实时收集和处理销售数据、客户行为数据和库存数据，为您提供直观、全面的数据洞察。
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1 transition-transform hover:scale-110">
                  <i className="fa fa-check text-primary text-sm"></i>
                </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 flex items-center">
                    <i className="fa fa-line-chart text-primary mr-2"></i>实时销售监控
                  </h4>
                    <p className="text-gray-600">24小时实时监控销售数据，及时发现销售趋势和异常情况</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                    <i className="fa fa-check text-primary text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 flex items-center">
                    <i className="fa fa-area-chart text-primary mr-2"></i>智能预测分析
                  </h4>
                    <p className="text-gray-600">基于历史数据和市场趋势，智能预测未来销售和库存需求</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                    <i className="fa fa-check text-primary text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 flex items-center">
                    <i className="fa fa-table text-primary mr-2"></i>多维度报表
                  </h4>
                    <p className="text-gray-600">支持按时间、地区、商品类别等多维度生成数据报表</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link 
                  to="/login" 
                  className="bg-primary hover:bg-primary/90 text-white text-base font-medium py-3 px-8 rounded-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 inline-flex items-center"
                >
                  <span>查看演示报表</span>
                  <i className="fa fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                </Link>
              </div>
            </div>
            {/* 数据统计卡片 - 增强视觉吸引力 */}
            <div className="w-full lg:w-1/2 bg-gray-50 rounded-2xl shadow-card p-6 transition-all duration-500 hover:shadow-lg border border-gray-100">
              {/* 数据统计卡片 - 添加悬停效果 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  <p className="text-gray-500 text-sm mb-1 flex items-center">
                    <i className="fa fa-money text-primary mr-2 transition-transform duration-300 hover:scale-110"></i>总销售额
                  </p>
                  <p className="text-2xl font-bold text-primary">¥2,453,892</p>
                  <p className="text-success text-sm flex items-center mt-1">
                    <i className="fa fa-arrow-up mr-1 transition-transform duration-300 hover:scale-110"></i> 12.5%
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  <p className="text-gray-500 text-sm mb-1 flex items-center">
                    <i className="fa fa-shopping-bag text-accent mr-2 transition-transform duration-300 hover:scale-110"></i>订单数量
                  </p>
                  <p className="text-2xl font-bold text-accent">18,456</p>
                  <p className="text-success text-sm flex items-center mt-1">
                    <i className="fa fa-arrow-up mr-1 transition-transform duration-300 hover:scale-110"></i> 8.2%
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  <p className="text-gray-500 text-sm mb-1 flex items-center">
                    <i className="fa fa-users text-success mr-2 transition-transform duration-300 hover:scale-110"></i>活跃用户
                  </p>
                  <p className="text-2xl font-bold text-success">12,348</p>
                  <p className="text-success text-sm flex items-center mt-1">
                    <i className="fa fa-arrow-up mr-1 transition-transform duration-300 hover:scale-110"></i> 15.7%
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  <p className="text-gray-500 text-sm mb-1 flex items-center">
                    <i className="fa fa-tag text-warning mr-2 transition-transform duration-300 hover:scale-110"></i>客单价
                  </p>
                  <p className="text-2xl font-bold text-warning">¥132.9</p>
                  <p className="text-danger text-sm flex items-center mt-1">
                    <i className="fa fa-arrow-down mr-1 transition-transform duration-300 hover:scale-110"></i> 2.3%
                  </p>
                </div>
              </div>
              <div className="h-64 bg-white p-4 rounded-xl shadow-sm">
                <Bar data={salesData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 关于我们 - 增强视觉深度 */}
      <section 
        id="about" 
        ref={sectionRefs.about}
        className={`py-20 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden transition-all duration-1000 transform ${visibleSections.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        {/* 装饰网格 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231E40AF' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-70 pointer-events-none"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              关于我们
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">专注零售科技，引领行业创新</h2>
            <p className="text-gray-600 mb-8 text-lg">
              我们是一支由零售专家、技术精英和数据分析师组成的团队，致力于为零售企业提供最前沿的智能运营解决方案。
            </p>
            {/* 数据统计 - 添加动画效果 */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12">
                <div className="text-center group">
                  <div className="text-4xl font-bold text-primary mb-2 transition-all duration-500 group-hover:text-primary/80 group-hover:scale-110">500+</div>
                  <p className="text-gray-600 flex items-center justify-center"><i className="fa fa-building-o mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary"></i>合作客户</p>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-primary mb-2 transition-all duration-500 group-hover:text-primary/80 group-hover:scale-110">10+</div>
                  <p className="text-gray-600 flex items-center justify-center"><i className="fa fa-calendar mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary"></i>行业经验</p>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-primary mb-2 transition-all duration-500 group-hover:text-primary/80 group-hover:scale-110">98%</div>
                  <p className="text-gray-600 flex items-center justify-center"><i className="fa fa-smile-o mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary"></i>客户满意度</p>
                </div>
              </div>
            <Link 
              to="/contact" 
              className="bg-white border border-gray-200 hover:border-primary/30 text-dark hover:text-primary text-base font-medium py-3 px-8 rounded-md transition-all duration-300 hover:shadow-md inline-flex items-center"
            >
              <i className="fa fa-paper-plane mr-2"></i>
              <span>联系我们</span>
              <i className="fa fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* 行动召唤区 - 增强视觉吸引力 */}
      <section 
        id="cta" 
        ref={sectionRefs.cta}
        className={`py-24 bg-primary relative overflow-hidden transition-all duration-1000 transform ${visibleSections.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        {/* 装饰元素 */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full filter blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full filter blur-xl"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full filter blur-lg"></div>
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">准备好提升您的零售业务了吗？</h2>
            <p className="text-white/80 mb-10 text-lg max-w-2xl mx-auto">
              立即注册，免费体验30天，感受智能零售系统带来的效率提升和业务增长
            </p>
            {/* 按钮组 - 增强交互效果 */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/login" 
                className="bg-white text-primary text-base font-medium py-3 px-8 rounded-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary flex items-center justify-center"
              >
                <i className="fa fa-calendar-check-o mr-2"></i>免费试用 14 天
              </Link>
              <Link 
                to="/demo" 
                className="bg-transparent border border-white/50 text-white hover:bg-white/10 text-base font-medium py-3 px-8 rounded-md transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary flex items-center justify-center"
              >
                <i className="fa fa-desktop mr-2"></i>预约演示
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 - 增强视觉层次 */}
      <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
        {/* 装饰线条 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-success"></div>
        <div className="container mx-auto px-4">
          {/* 页脚内容 - 增强响应式布局 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <h4 className="text-xl font-bold mb-6 text-white flex items-center group">
                零售智能运营系统
                <span className="ml-2 text-primary group-hover:text-white transition-colors duration-300">
                  <i className="fa fa-store"></i>
                </span>
              </h4>
              <p className="text-gray-400 mb-6">
                我们致力于为零售企业提供高效、智能的运营管理解决方案，助力企业实现数字化转型和可持续发展。
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 mr-4 group">
                  <i className="fa fa-weixin text-xl group-hover:scale-110 transition-transform duration-300"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 mr-4 group">
                  <i className="fa fa-weibo text-xl group-hover:scale-110 transition-transform duration-300"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 group">
                  <i className="fa fa-linkedin text-xl group-hover:scale-110 transition-transform duration-300"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">产品</h4>
              <ul className="space-y-4">
                <li className="mb-3">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-1 h-1 bg-primary rounded-full mr-2 group-hover:bg-white transition-colors duration-300"></span>
                    销售管理
                  </a>
                </li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-1 h-1 bg-primary rounded-full mr-2 group-hover:bg-white transition-colors duration-300"></span>
                    <i className="fa fa-cubes mr-2"></i>库存管理
                  </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-1 h-1 bg-primary rounded-full mr-2 group-hover:bg-white transition-colors duration-300"></span>
                    <i className="fa fa-users mr-2"></i>客户管理
                  </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-1 h-1 bg-primary rounded-full mr-2 group-hover:bg-white transition-colors duration-300"></span>
                    <i className="fa fa-bar-chart mr-2"></i>数据分析
                  </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-1 h-1 bg-primary rounded-full mr-2 group-hover:bg-white transition-colors duration-300"></span>
                    <i className="fa fa-mobile mr-2"></i>移动应用
                  </a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">资源</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-1 h-1 bg-primary rounded-full mr-2 group-hover:bg-white transition-colors duration-300"></span>
                    <i className="fa fa-question-circle mr-2"></i>帮助中心
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-1 h-1 bg-primary rounded-full mr-2 group-hover:bg-white transition-colors duration-300"></span>
                    <i className="fa fa-book mr-2"></i>用户指南
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-1 h-1 bg-primary rounded-full mr-2 group-hover:bg-white transition-colors duration-300"></span>
                    <i className="fa fa-code mr-2"></i>API文档
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-1 h-1 bg-primary rounded-full mr-2 group-hover:bg-white transition-colors duration-300"></span>
                    <i className="fa fa-puzzle-piece mr-2"></i>行业解决方案
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-1 h-1 bg-primary rounded-full mr-2 group-hover:bg-white transition-colors duration-300"></span>
                    <i className="fa fa-trophy mr-2"></i>成功案例
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">联系我们</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <i className="fa fa-map-marker text-primary mt-1 mr-3"></i>
                  <span className="text-gray-400">郑州轻工业大学小作坊</span>
                </li>
                <li className="flex items-start">
                  <i className="fa fa-phone text-primary mt-1 mr-3"></i>
                  <span className="text-gray-400">400-123-4567</span>
                </li>
                <li className="flex items-start">
                  <i className="fa fa-envelope text-primary mt-1 mr-3"></i>
                  <span className="text-gray-400">542312320212@zzuli.edu.cn</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* 页脚底部 - 增强视觉效果 */}
          <div className="border-t border-gray-800 pt-8 mt-12 text-center text-gray-500 text-sm">
            <div className="max-w-3xl mx-auto">
              <p className="mb-4">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mr-2 mb-2">智能零售</span>
                <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium mr-2 mb-2">数据分析</span>
                <span className="inline-block px-3 py-1 bg-success/10 text-success rounded-full text-xs font-medium mr-2 mb-2">效率提升</span>
                <span className="inline-block px-3 py-1 bg-warning/10 text-warning rounded-full text-xs font-medium mr-2 mb-2">增长赋能</span>
              </p>
              <p>&copy; 2025 零售智能运营系统. 保留所有权利.</p>
              <p className="mt-4 text-gray-600">
                由 <a href="#" className="text-primary hover:text-white transition-colors inline-flex items-center">
                  <i className="fa fa-cogs mr-1"></i> 第19组
                </a> 技术团队提供支持
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;