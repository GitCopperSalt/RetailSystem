package com.retailsys.service;

import com.retailsys.entity.Roles;
import java.util.List;

/**
 * (Roles)表服务接�?
 *
 * @author makejava
 * @since 2025-09-23 17:59:47
 */
public interface RolesService {

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    Roles queryById(Integer id);

    /**
     * 分页查询
     *
     * @param roles 筛选条件
     * @return 查询结果
     */
    List<Roles> queryAll(Roles roles);

    /**
     * 新增数据
     *
     * @param roles 实例对象
     * @return 实例对象
     */
    Roles insert(Roles roles);

    /**
     * 修改数据
     *
     * @param roles 实例对象
     * @return 实例对象
     */
    Roles update(Roles roles);

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    boolean deleteById(Integer id);

}
