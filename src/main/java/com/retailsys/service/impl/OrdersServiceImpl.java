package com.retailsys.service.impl;

import com.retailsys.entity.Orders;
import com.retailsys.dao.OrdersDao;
import com.retailsys.service.OrdersService;
import org.springframework.stereotype.Service;
import jakarta.annotation.Resource;
import java.util.List;

/**
 * (Orders)表服务实现类
 *
 * @author makejava
 * @since 2025-09-23 17:58:59
 */
@Service("ordersService")
public class OrdersServiceImpl implements OrdersService {
    @Resource
    private OrdersDao ordersDao;

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    @Override
    public Orders queryById(Integer id) {
        return this.ordersDao.queryById(id);
    }

    /**
     * 分页查询
     *
     * @param orders 筛选条�?
     * @return 查询结果
     */
    @Override
    public List<Orders> queryAll(Orders orders) {
        return ordersDao.queryAll(orders);
    }

    /**
     * 新增数据
     *
     * @param orders 实例对象
     * @return 实例对象
     */
    @Override
    public Orders insert(Orders orders) {
        this.ordersDao.insert(orders);
        return orders;
    }

    /**
     * 修改数据
     *
     * @param orders 实例对象
     * @return 实例对象
     */
    @Override
    public Orders update(Orders orders) {
        this.ordersDao.update(orders);
        return this.queryById(orders.getId());
    }

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    @Override
    public boolean deleteById(Integer id) {
        return this.ordersDao.deleteById(id) > 0;
    }
}
