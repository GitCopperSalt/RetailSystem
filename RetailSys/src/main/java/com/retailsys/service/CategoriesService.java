package com.retailsys.service;

import com.retailsys.entity.Categories;
import java.util.List;

/**
 * (Categories)表服务接�?
 *
 * @author makejava
 * @since 2025-09-23 17:57:19
 */
public interface CategoriesService {

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    Categories queryById(Integer id);

    /**
     * 分页查询
     *
     * @param categories 筛选条�?
     * @return 查询结果
     */
    List<Categories> queryAll(Categories categories);

    /**
     * 新增数据
     *
     * @param categories 实例对象
     * @return 实例对象
     */
    Categories insert(Categories categories);

    /**
     * 修改数据
     *
     * @param categories 实例对象
     * @return 实例对象
     */
    Categories update(Categories categories);

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    boolean deleteById(Integer id);

}
