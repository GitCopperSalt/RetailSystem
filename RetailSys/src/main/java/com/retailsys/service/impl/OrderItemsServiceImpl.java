package com.retailsys.service.impl;

import com.retailsys.entity.OrderItems;
import com.retailsys.dao.OrderItemsDao;
import com.retailsys.service.OrderItemsService;

import java.util.List;

import org.springframework.stereotype.Service;
import jakarta.annotation.Resource;

/**
 * (OrderItems)表服务实现类
 *
 * @author makejava
 * @since 2025-09-23 17:57:57
 */
@Service("orderItemsService")
public class OrderItemsServiceImpl implements OrderItemsService {
    @Resource
    private OrderItemsDao orderItemsDao;

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    @Override
    public OrderItems queryById(Integer id) {
        return this.orderItemsDao.queryById(id);
    }

    /**
     * 分页查询
     *
     * @param orderItems 筛选条件
     * @return 查询结果
     */
    @Override
    public List<OrderItems> queryAll(OrderItems orderItems) {
        return orderItemsDao.queryAll(orderItems);
    }

    /**
     * 新增数据
     *
     * @param orderItems 实例对象
     * @return 实例对象
     */
    @Override
    public OrderItems insert(OrderItems orderItems) {
        this.orderItemsDao.insert(orderItems);
        return orderItems;
    }

    /**
     * 修改数据
     *
     * @param orderItems 实例对象
     * @return 实例对象
     */
    @Override
    public OrderItems update(OrderItems orderItems) {
        this.orderItemsDao.update(orderItems);
        return this.queryById(orderItems.getId());
    }

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    @Override
    public boolean deleteById(Integer id) {
        return this.orderItemsDao.deleteById(id) > 0;
    }
}
