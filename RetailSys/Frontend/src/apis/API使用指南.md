# 前端API使用指南

## 项目中现有的API管理方式

项目中现在采用**统一的API管理方式**：

- **统一使用axios实现的API服务**: 在 `/src/services/apiService.js` 中，集中管理所有API接口调用

> 注意：项目已经完成API统一管理，所有API都已迁移到apiService.js中并使用axios实现

## 现有代码如何使用API

项目中的组件都从 `apiService.js` 导入和使用API，例如在 `ProductManagementPage.jsx` 中：

```javascript
// 导入所需的API服务
import { productApi, categoryApi } from '../../services/apiService';

// 在组件中使用
const fetchData = async () => {
  try {
    // 并行获取商品和分类数据
    const [productsResponse, categoriesResponse] = await Promise.all([
      productApi.getProducts(0, 100), // 获取所有商品，限制为100条
      categoryApi.getCategories()      // 获取所有分类
    ]);
    
    // 处理返回的数据
    const productsData = productsResponse.items.map(item => ({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      // ...其他属性转换
    }));
    
    setProducts(productsData);
  } catch (error) {
    console.error('获取数据失败:', error);
    // 错误处理和备用数据
  }
};
```

在 `AuthContext.jsx` 中也有类似用法：

```javascript
import { authApi } from '../services/apiService';

// 在登录函数中使用
const login = async (username, password) => {
  try {
    const response = await authApi.login(username, password);
    if (response.token) {
      // 存储token和设置用户信息
      localStorage.setItem('authToken', response.token);
      setIsAuthenticated(true);
      // ...其他逻辑
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
```

## API服务中包含的模块

apiService.js中包含以下API模块：

- productApi - 商品管理API
- categoryApi - 分类管理API
- authApi - 认证相关API
- orderApi - 订单管理API
- addressApi - 地址管理API
- shoppingCartApi - 购物车管理API
- usersApi - 用户管理API
- discountsApi - 折扣管理API
- messagesApi - 消息管理API
- orderItemsApi - 订单项管理API
- permissionsApi - 权限管理API
- productAddressesApi - 商品地址管理API
- rolePermissionsApi - 角色权限管理API
- rolesApi - 角色管理API

## 推荐的API使用方式

### 1. 从apiService导入所需API模块

```javascript
// 从apiService导入所需的API
import { 
  productsApi, 
  categoriesApi, 
  ordersApi,
  usersApi,
  authApi
} from '../../services/apiService';
```

### 2. 在组件中使用API示例

#### 获取商品列表

```javascript
import { useState, useEffect } from 'react';
import { productsApi } from '../../services/apiService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      // 可以传入查询参数
      const data = await productsApi.getProducts(0, 10, '', null);
      setProducts(data);
    } catch (err) {
      console.error('获取商品列表失败:', err);
      setError('获取商品列表失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <div>加载中...</div>}
      {error && <div className="error">{error}</div>}
      <ul>
        {products.items && products.items.map(product => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

```

#### 创建新商品

```javascript
import { useState } from 'react';
import { productsApi } from '../../services/apiService';

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: '',
    price: 0,
    inventory: 0,
    categoryId: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newProduct = await productsApi.createProduct(productData);
      console.log('创建成功:', newProduct);
      setSuccess(true);
      // 重置表单或跳转页面
    } catch (error) {
      console.error('创建商品失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={productData.name}
        onChange={handleChange}
        placeholder="商品名称"
        required
      />
      <input
        type="number"
        name="price"
        value={productData.price}
        onChange={handleChange}
        placeholder="商品价格"
        min="0"
        step="0.01"
        required
      />
      {/* 其他表单字段 */}
      <button type="submit" disabled={submitting}>
        {submitting ? '提交中...' : '创建商品'}
      </button>
      {success && <div className="success">创建成功!</div>}
    </form>
  );
};
```

#### 使用多个API并行请求

```javascript
import { useState, useEffect } from 'react';
import { productsApi, categoriesApi, discountsApi } from '../../services/apiService';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    products: [],
    categories: [],
    activeDiscounts: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 并行请求多个API数据
      const [products, categories, discounts] = await Promise.all([
        productsApi.getProducts(),
        categoriesApi.getCategories(),
        discountsApi.getDiscounts({ active: true })
      ]);
      
      setDashboardData({
        products: products.items || [],
        categories: categories || [],
        activeDiscounts: discounts.items || []
      });
    } catch (error) {
      console.error('加载仪表盘数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      {loading ? (
        <div>加载中...</div>
      ) : (
        <>
          <div>商品总数: {dashboardData.products.length}</div>
          <div>分类总数: {dashboardData.categories.length}</div>
          <div>有效折扣数: {dashboardData.activeDiscounts.length}</div>
          {/* 显示详细数据 */}
        </>
      )}
    </div>
  );
};
```

## API使用最佳实践

1. **统一错误处理**
   ```javascript
try {
  const data = await apiService.method();
  // 处理成功数据
} catch (error) {
  // 统一错误处理
  console.error('API调用失败:', error);
  // 可以显示用户友好的错误信息
  showErrorMessage(error.message || '操作失败，请重试');
}
```

2. **请求加载状态管理**
   ```javascript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await apiService.method();
    // 处理数据
  } catch (error) {
    // 错误处理
  } finally {
    setLoading(false);
  }
};
```

3. **并行请求优化**
   ```javascript
// 使用Promise.all并行处理多个请求
const [products, categories, orders] = await Promise.all([
  productsApi.getProducts(),
  categoriesApi.getCategories(),
  ordersApi.getOrders()
]);
```

4. **请求取消（防止竞态条件）**
   ```javascript
import axios from 'axios';

// 创建取消令牌
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

// 发送请求时传入取消令牌
// 注意：在当前apiService.js中，需要在具体API方法中添加此功能
// 如需实现请求取消，请在相应API方法中修改
```

5. **组件卸载时处理异步请求**
   ```javascript
import { useEffect, useState, useRef } from 'react';
import { productsApi } from '../../services/apiService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const isMounted = useRef(true);
  
  useEffect(() => {
    // 设置标记表示组件已挂载
    isMounted.current = true;
    
    const fetchData = async () => {
      try {
        const data = await productsApi.getProducts();
        // 只有当组件仍然挂载时才更新状态
        if (isMounted.current) {
          setProducts(data.items || []);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
      }
    };
    
    fetchData();
    
    // 组件卸载时设置标记为false
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  return (
    // 组件内容
  );
};
```

## API服务特点

当前统一的API服务具有以下特点：

1. **统一的axios实例配置**：包含基础URL、超时设置、请求头配置等
2. **统一的请求拦截器**：自动添加认证token，简化认证流程
3. **统一的响应拦截器**：统一错误处理，对401未授权进行特殊处理
4. **模块化设计**：按功能领域划分API模块，便于维护和使用
5. **完整的错误日志**：每个API方法都包含详细的错误日志记录

通过以上方式，您可以在前端项目中统一、高效地使用API进行数据交互。