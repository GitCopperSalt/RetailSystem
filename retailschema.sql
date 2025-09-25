-- 数据库表结构定义文件
-- 适配前端代码中的数据模型和API调用
CREATE DATABASE RetailSchema;
USE RetailSchema;
-- 1. 用户表：存储系统所有用户的基本信息
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID，主键',
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名，登录账号',
    password VARCHAR(100) NOT NULL COMMENT '密码，加密存储',
    real_name VARCHAR(50) COMMENT '真实姓名',
    phone VARCHAR(20) UNIQUE COMMENT '手机号码',
    email VARCHAR(100) UNIQUE COMMENT '电子邮箱',
    avatar_url VARCHAR(255) COMMENT '头像URL',
    wechat_openid VARCHAR(100) UNIQUE COMMENT '微信OpenID',
    role_id INT COMMENT '角色ID，关联roles表',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否激活',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_role_id (role_id),
    INDEX idx_username (username),
    INDEX idx_phone (phone),
    INDEX idx_email (email)
);

-- 2. 角色表：定义系统中的角色类型
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '角色ID，主键',
    role_name VARCHAR(50) UNIQUE NOT NULL COMMENT '角色名称',
    description TEXT COMMENT '角色描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_role_name (role_name)
);

-- 3. 权限表：定义系统中的操作权限
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '权限ID，主键',
    permission_name VARCHAR(50) UNIQUE NOT NULL COMMENT '权限名称',
    description TEXT COMMENT '权限描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_permission_name (permission_name)
);

-- 4. 角色权限关联表：建立角色与权限之间的多对多关系
CREATE TABLE role_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '关联ID，主键',
    role_id INT NOT NULL COMMENT '角色ID，关联roles表',
    permission_id INT NOT NULL COMMENT '权限ID，关联permissions表',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_role_permission (role_id, permission_id),
    INDEX idx_role_id (role_id),
    INDEX idx_permission_id (permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- 6. 分类表：存储商品分类信息，支持多级分类
CREATE TABLE categories (
                            id INT PRIMARY KEY AUTO_INCREMENT COMMENT '分类ID，主键',
                            name VARCHAR(50) NOT NULL COMMENT '分类名称',
                            description TEXT COMMENT '分类描述',
                            parent_id INT COMMENT '父分类ID，自关联',
                            is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                            UNIQUE KEY uk_name_parent (name, parent_id),
                            INDEX idx_parent_id (parent_id),
                            INDEX idx_is_active (is_active),
                            FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 5. 商品表：存储系统所有商品信息
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '商品ID，主键',
    name VARCHAR(100) NOT NULL COMMENT '商品名称',
    description TEXT COMMENT '商品描述',
    price DECIMAL(10,2) NOT NULL COMMENT '销售价格',
    original_price DECIMAL(10,2) COMMENT '原价',
    stock INT DEFAULT 0 COMMENT '库存量',
    category_id INT COMMENT '分类ID，关联categories表',
    image_url VARCHAR(255) COMMENT '商品图片URL',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否上架',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_category_id (category_id),
    INDEX idx_name (name),
    INDEX idx_is_active (is_active),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 9. 地址表：存储用户的收货地址信息
CREATE TABLE addresses (
                           id INT PRIMARY KEY AUTO_INCREMENT COMMENT '地址ID，主键',
                           user_id INT NOT NULL COMMENT '用户ID，关联users表',
                           recipient VARCHAR(50) NOT NULL COMMENT '收件人姓名',
                           phone VARCHAR(20) NOT NULL COMMENT '联系电话',
                           province VARCHAR(50) COMMENT '省份',
                           city VARCHAR(50) COMMENT '城市',
                           district VARCHAR(50) COMMENT '区/县',
                           address_detail TEXT NOT NULL COMMENT '详细地址',
                           is_default BOOLEAN DEFAULT FALSE COMMENT '是否默认地址',
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                           INDEX idx_user_id (user_id),
                           INDEX idx_is_default (is_default),
                           FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- 7. 订单表：存储用户订单信息
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '订单ID，主键',
    order_no VARCHAR(50) UNIQUE NOT NULL COMMENT '订单编号',
    user_id INT NOT NULL COMMENT '用户ID，关联users表',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
    status VARCHAR(20) NOT NULL COMMENT '订单状态',
    payment_method VARCHAR(20) COMMENT '支付方式',
    payment_time TIMESTAMP COMMENT '支付时间',
    shipping_address_id INT COMMENT '收货地址ID，关联addresses表',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    contact_name VARCHAR(50) COMMENT '联系人姓名',
    remark TEXT COMMENT '订单备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_order_no (order_no),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shipping_address_id) REFERENCES addresses(id) ON DELETE SET NULL
);

-- 8. 订单项表：存储订单中的商品明细
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '订单项ID，主键',
    order_id INT NOT NULL COMMENT '订单ID，关联orders表',
    product_id INT NOT NULL COMMENT '商品ID，关联products表',
    product_name VARCHAR(100) NOT NULL COMMENT '商品名称',
    product_image VARCHAR(255) COMMENT '商品图片URL',
    quantity INT NOT NULL COMMENT '购买数量',
    price DECIMAL(10,2) NOT NULL COMMENT '购买时单价',
    total_price DECIMAL(10,2) NOT NULL COMMENT '商品总价',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 10. 购物车表：存储用户购物车信息
CREATE TABLE shopping_cart (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '购物车ID，主键',
    user_id INT NOT NULL COMMENT '用户ID，关联users表',
    product_id INT NOT NULL COMMENT '商品ID，关联products表',
    quantity INT NOT NULL COMMENT '数量',
    selected BOOLEAN DEFAULT TRUE COMMENT '是否选中',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_user_product (user_id, product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 11. 消息表：存储系统消息
CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '消息ID，主键',
    user_id INT COMMENT '用户ID，关联users表',
    title VARCHAR(100) NOT NULL COMMENT '消息标题',
    content TEXT NOT NULL COMMENT '消息内容',
    is_read BOOLEAN DEFAULT FALSE COMMENT '是否已读',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 12. 商品地址表：存储仓库、发货点等与商品相关的地址信息
CREATE TABLE product_addresses (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '地址ID，主键',
    name VARCHAR(50) NOT NULL COMMENT '地址名称',
    contact_person VARCHAR(50) NOT NULL COMMENT '联系人姓名',
    contact_phone VARCHAR(20) NOT NULL COMMENT '联系电话',
    province VARCHAR(50) NOT NULL COMMENT '省份',
    city VARCHAR(50) NOT NULL COMMENT '城市',
    district VARCHAR(50) NOT NULL COMMENT '区/县',
    address_detail TEXT NOT NULL COMMENT '详细地址',
    zip_code VARCHAR(10) COMMENT '邮政编码',
    type VARCHAR(20) NOT NULL COMMENT '地址类型（如仓库、发货点）',
    is_default BOOLEAN DEFAULT FALSE COMMENT '是否默认地址',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否激活',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_type (type),
    INDEX idx_is_default (is_default),
    INDEX idx_is_active (is_active)
);

-- 13. 折扣设置表：存储系统的折扣活动设置
CREATE TABLE discounts (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '折扣ID，主键',
    name VARCHAR(100) NOT NULL COMMENT '折扣名称',
    type VARCHAR(20) NOT NULL COMMENT '折扣类型',
    value DECIMAL(10,2) NOT NULL COMMENT '折扣值',
    min_amount DECIMAL(10,2) COMMENT '最低消费金额',
    start_time TIMESTAMP COMMENT '开始时间',
    end_time TIMESTAMP COMMENT '结束时间',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否激活',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_type (type),
    INDEX idx_is_active (is_active),
    INDEX idx_start_end_time (start_time, end_time)
);

-- 初始化系统角色数据
INSERT INTO roles (role_name, description) VALUES
('admin', '系统管理员'),
('store_manager', '店铺运营'),
('inventory_manager', '库存管理员'),
('cashier', '收银员'),
('customer', '普通用户');

-- 初始化系统权限数据
INSERT INTO permissions (permission_name, description) VALUES
('manage_users', '管理用户'),
('manage_products', '管理商品'),
('manage_orders', '管理订单'),
('manage_categories', '管理分类'),
('view_dashboard', '查看仪表盘'),
('manage_inventory', '管理库存'),
('process_payments', '处理支付');

-- 初始化角色权限关联数据
INSERT INTO role_permissions (role_id, permission_id) VALUES
-- 管理员权限
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7),
-- 店铺运营权限
(2, 2), (2, 3), (2, 4), (2, 5),
-- 库存管理员权限
(3, 2), (3, 6),
-- 收银员权限
(4, 3), (4, 7);

-- 初始化默认管理员账号
INSERT INTO users (username, password, real_name, phone, email, role_id, is_active)
VALUES ('admin', 'admin123', '管理员', '13794488060', 'admin@example.com', 1, TRUE);