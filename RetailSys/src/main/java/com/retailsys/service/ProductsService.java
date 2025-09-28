package com.retailsys.service;

import com.retailsys.entity.Products;
import java.util.List;

/**
 * (Products)表服务接�?
 *
 * @author makejava
 * @since 2025-09-23 17:59:29
 */
public interface ProductsService {

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    Products queryById(Integer id);

    /**
     * 分页查询
     *
     * @param products 筛选条件
     * @return 查询结果
     */
    List<Products> queryAll(Products products);

    /**
     * 新增数据
     *
     * @param products 实例对象
     * @return 实例对象
     */
    Products insert(Products products);

    /**
     * 修改数据
     *
     * @param products 实例对象
     * @return 实例对象
     */
    Products update(Products products);

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    boolean deleteById(Integer id);

}
