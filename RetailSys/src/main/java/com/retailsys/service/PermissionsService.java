package com.retailsys.service;

import com.retailsys.entity.Permissions;
import java.util.List;

/**
 * (Permissions)表服务接�?
 *
 * @author makejava
 * @since 2025-09-23 17:59:12
 */
public interface PermissionsService {

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    Permissions queryById(Integer id);

    /**
     * 分页查询
     *
     * @param permissions 筛选条�?
     * @return 查询结果
     */
    List<Permissions> queryAll(Permissions permissions);

    /**
     * 新增数据
     *
     * @param permissions 实例对象
     * @return 实例对象
     */
    Permissions insert(Permissions permissions);

    /**
     * 修改数据
     *
     * @param permissions 实例对象
     * @return 实例对象
     */
    Permissions update(Permissions permissions);

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    boolean deleteById(Integer id);

}
