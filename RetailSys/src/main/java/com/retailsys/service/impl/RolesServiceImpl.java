package com.retailsys.service.impl;

import com.retailsys.entity.Roles;
import com.retailsys.dao.RolesDao;
import com.retailsys.service.RolesService;
import org.springframework.stereotype.Service;
import jakarta.annotation.Resource;
import java.util.List;

/**
 * (Roles)表服务实现类
 *
 * @author makejava
 * @since 2025-09-23 17:59:47
 */
@Service("rolesService")
public class RolesServiceImpl implements RolesService {
    @Resource
    private RolesDao rolesDao;

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    @Override
    public Roles queryById(Integer id) {
        return this.rolesDao.queryById(id);
    }

    /**
     * 分页查询
     *
     * @param roles 筛选条�?
     * @return 查询结果
     */
    @Override
    public List<Roles> queryAll(Roles roles) {
        return rolesDao.queryAll(roles);
    }

    /**
     * 新增数据
     *
     * @param roles 实例对象
     * @return 实例对象
     */
    @Override
    public Roles insert(Roles roles) {
        this.rolesDao.insert(roles);
        return roles;
    }

    /**
     * 修改数据
     *
     * @param roles 实例对象
     * @return 实例对象
     */
    @Override
    public Roles update(Roles roles) {
        this.rolesDao.update(roles);
        return this.queryById(roles.getId());
    }

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    @Override
    public boolean deleteById(Integer id) {
        return this.rolesDao.deleteById(id) > 0;
    }
}
