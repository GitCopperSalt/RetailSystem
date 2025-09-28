package com.retailsys.service;

import com.retailsys.entity.RolePermissions;
import java.util.List;

/**
 * (RolePermissions)表服务接�?
 *
 * @author makejava
 * @since 2025-09-23 17:59:39
 */
public interface RolePermissionsService {

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    RolePermissions queryById(Integer id);

    /**
     * 分页查询
     *
     * @param rolePermissions 筛选条件
     * @return 查询结果
     */
    List<RolePermissions> queryAll(RolePermissions rolePermissions);

    /**
     * 新增数据
     *
     * @param rolePermissions 实例对象
     * @return 实例对象
     */
    RolePermissions insert(RolePermissions rolePermissions);

    /**
     * 修改数据
     *
     * @param rolePermissions 实例对象
     * @return 实例对象
     */
    RolePermissions update(RolePermissions rolePermissions);

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    boolean deleteById(Integer id);

}
