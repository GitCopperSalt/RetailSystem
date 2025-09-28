package com.retailsys.service;

import com.retailsys.entity.Discounts;
import java.util.List;

/**
 * (Discounts)表服务接�?
 *
 * @author makejava
 * @since 2025-09-23 17:57:33
 */
public interface DiscountsService {

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    Discounts queryById(Integer id);

    /**
     * 分页查询
     *
     * @param discounts 筛选条件
     * @return 查询结果
     */
    List<Discounts> queryAll(Discounts discounts);

    /**
     * 新增数据
     *
     * @param discounts 实例对象
     * @return 实例对象
     */
    Discounts insert(Discounts discounts);

    /**
     * 修改数据
     *
     * @param discounts 实例对象
     * @return 实例对象
     */
    Discounts update(Discounts discounts);

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    boolean deleteById(Integer id);

}
