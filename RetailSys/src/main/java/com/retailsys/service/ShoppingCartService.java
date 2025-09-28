package com.retailsys.service;

import com.retailsys.entity.ShoppingCart;
import java.util.List;

/**
 * (ShoppingCart)表服务接�?
 *
 * @author makejava
 * @since 2025-09-23 17:59:55
 */
public interface ShoppingCartService {

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    ShoppingCart queryById(Integer id);

    /**
     * 分页查询
     *
     * @param shoppingCart 筛选条件
     * @return 查询结果
     */
    List<ShoppingCart> queryAll(ShoppingCart shoppingCart);

    /**
     * 新增数据
     *
     * @param shoppingCart 实例对象
     * @return 实例对象
     */
    ShoppingCart insert(ShoppingCart shoppingCart);

    /**
     * 修改数据
     *
     * @param shoppingCart 实例对象
     * @return 实例对象
     */
    ShoppingCart update(ShoppingCart shoppingCart);

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    boolean deleteById(Integer id);

}
