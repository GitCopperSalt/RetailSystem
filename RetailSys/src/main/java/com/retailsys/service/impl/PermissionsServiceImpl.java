package com.retailsys.service.impl;

import com.retailsys.entity.Permissions;
import com.retailsys.dao.PermissionsDao;
import com.retailsys.service.PermissionsService;

import java.util.List;

import org.springframework.stereotype.Service;
import jakarta.annotation.Resource;

/**
 * (Permissions)表服务实现类
 *
 * @author makejava
 * @since 2025-09-23 17:59:12
 */
@Service("permissionsService")
public class PermissionsServiceImpl implements PermissionsService {
    @Resource
    private PermissionsDao permissionsDao;

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    @Override
    public Permissions queryById(Integer id) {
        return this.permissionsDao.queryById(id);
    }

    /**
     * 分页查询
     *
     * @param permissions 筛选条件
     * @return 查询结果
     */
    @Override
    public List<Permissions> queryAll(Permissions permissions) {
        return permissionsDao.queryAll(permissions);
    }

    /**
     * 新增数据
     *
     * @param permissions 实例对象
     * @return 实例对象
     */
    @Override
    public Permissions insert(Permissions permissions) {
        this.permissionsDao.insert(permissions);
        return permissions;
    }

    /**
     * 修改数据
     *
     * @param permissions 实例对象
     * @return 实例对象
     */
    @Override
    public Permissions update(Permissions permissions) {
        this.permissionsDao.update(permissions);
        return this.queryById(permissions.getId());
    }

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    @Override
    public boolean deleteById(Integer id) {
        return this.permissionsDao.deleteById(id) > 0;
    }
}
