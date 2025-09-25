package com.retailsys.service;

import com.retailsys.entity.OrderItems;
import java.util.List;

/**
 * (OrderItems)表服务接�?
 *
 * @author makejava
 * @since 2025-09-23 17:57:57
 */
public interface OrderItemsService {

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    OrderItems queryById(Integer id);

    /**
     * 分页查询
     *
     * @param orderItems 筛选条�?
     * @return 查询结果
     */
    List<OrderItems> queryAll(OrderItems orderItems);

    /**
     * 新增数据
     *
     * @param orderItems 实例对象
     * @return 实例对象
     */
    OrderItems insert(OrderItems orderItems);

    /**
     * 修改数据
     *
     * @param orderItems 实例对象
     * @return 实例对象
     */
    OrderItems update(OrderItems orderItems);

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    boolean deleteById(Integer id);

}
