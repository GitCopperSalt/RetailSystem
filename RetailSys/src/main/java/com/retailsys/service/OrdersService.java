package com.retailsys.service;

import com.retailsys.entity.Orders;
import java.util.List;

/**
 * (Orders)表服务接�?
 *
 * @author makejava
 * @since 2025-09-23 17:58:59
 */
public interface OrdersService {

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    Orders queryById(Integer id);

    /**
     * 分页查询
     *
     * @param orders 筛选条件
     * @return 查询结果
     */
    List<Orders> queryAll(Orders orders);

    /**
     * 新增数据
     *
     * @param orders 实例对象
     * @return 实例对象
     */
    Orders insert(Orders orders);

    /**
     * 修改数据
     *
     * @param orders 实例对象
     * @return 实例对象
     */
    Orders update(Orders orders);

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    boolean deleteById(Integer id);

}
