package com.retailsys.service.impl;

import com.retailsys.entity.RolePermissions;
import com.retailsys.dao.RolePermissionsDao;
import com.retailsys.service.RolePermissionsService;
import org.springframework.stereotype.Service;
import jakarta.annotation.Resource;
import java.util.List;

/**
 * (RolePermissions)表服务实现类
 *
 * @author makejava
 * @since 2025-09-23 17:59:39
 */
@Service("rolePermissionsService")
public class RolePermissionsServiceImpl implements RolePermissionsService {
    @Resource
    private RolePermissionsDao rolePermissionsDao;

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    @Override
    public RolePermissions queryById(Integer id) {
        return this.rolePermissionsDao.queryById(id);
    }

    /**
     * 分页查询
     *
     * @param rolePermissions 筛选条�?
     * @return 查询结果
     */
    @Override
    public List<RolePermissions> queryAll(RolePermissions rolePermissions) {
        return rolePermissionsDao.queryAll(rolePermissions);
    }

    /**
     * 新增数据
     *
     * @param rolePermissions 实例对象
     * @return 实例对象
     */
    @Override
    public RolePermissions insert(RolePermissions rolePermissions) {
        this.rolePermissionsDao.insert(rolePermissions);
        return rolePermissions;
    }

    /**
     * 修改数据
     *
     * @param rolePermissions 实例对象
     * @return 实例对象
     */
    @Override
    public RolePermissions update(RolePermissions rolePermissions) {
        this.rolePermissionsDao.update(rolePermissions);
        return this.queryById(rolePermissions.getId());
    }

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    @Override
    public boolean deleteById(Integer id) {
        return this.rolePermissionsDao.deleteById(id) > 0;
    }
}
