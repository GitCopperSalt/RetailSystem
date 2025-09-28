package com.retailsys.service;

import com.retailsys.entity.Addresses;
import java.util.List;

/**
 * (Addresses)表服务接�?
 *
 * @author makejava
 * @since 2025-09-23 17:57:03
 */
public interface AddressesService {

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    Addresses queryById(Integer id);

    /**
     * 分页查询
     *
     * @param addresses 筛选条件
     * @return 查询结果
     */
    List<Addresses> queryAll(Addresses addresses);

    /**
     * 新增数据
     *
     * @param addresses 实例对象
     * @return 实例对象
     */
    Addresses insert(Addresses addresses);

    /**
     * 修改数据
     *
     * @param addresses 实例对象
     * @return 实例对象
     */
    Addresses update(Addresses addresses);

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    boolean deleteById(Integer id);

}
