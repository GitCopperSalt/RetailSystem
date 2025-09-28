package com.retailsys.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.retailsys.entity.Users;
import com.retailsys.dao.UsersDao;
import com.retailsys.service.UsersService;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

/**
 * (Users)表服务实现类
 *
 * @author makejava
 * @since 2025-09-23 18:00:03
 */
@Service("usersService")
public class UsersServiceImpl implements UsersService {
    @Autowired
    private UsersDao usersDao;

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    @Override
    public Users queryById(Integer id) {
        return usersDao.selectById(id);
    }

    /**
     * 分页查询
     *
     * @param users 筛选条件
     * @param page      分页对象
     * @return 查询结果
     */
    public Page<Users> queryByPage(Users users, Page<Users> page) {
        // 使用MyBatis-Plus的QueryWrapper构建查询条件
        QueryWrapper<Users> queryWrapper = new QueryWrapper<>();
        // 根据实体类的非空属性构建查询条件
        if (users.getUsername() != null) {
            queryWrapper.like("username", users.getUsername());
        }
        if (users.getRealName() != null) {
            queryWrapper.like("real_name", users.getRealName());
        }
        if (users.getPhone() != null) {
            queryWrapper.like("phone", users.getPhone());
        }
        if (users.getEmail() != null) {
            queryWrapper.like("email", users.getEmail());
        }
        if (users.getRoleId() != null) {
            queryWrapper.eq("role_id", users.getRoleId());
        }
        if (users.getIsActive() != null) {
            queryWrapper.eq("is_active", users.getIsActive());
        }
        
        // 执行分页查询
        return usersDao.selectPage(page, queryWrapper);
    }

    /**
     * 查询所有数据
     *
     * @param users 筛选条件
     * @return 查询结果
     */
    @Override
    public List<Users> queryAll(Users users) {
        QueryWrapper<Users> queryWrapper = new QueryWrapper<>();
        if (users.getUsername() != null) {
            queryWrapper.like("username", users.getUsername());
        }
        if (users.getRealName() != null) {
            queryWrapper.like("real_name", users.getRealName());
        }
        if (users.getPhone() != null) {
            queryWrapper.like("phone", users.getPhone());
        }
        if (users.getEmail() != null) {
            queryWrapper.like("email", users.getEmail());
        }
        if (users.getRoleId() != null) {
            queryWrapper.eq("role_id", users.getRoleId());
        }
        if (users.getIsActive() != null) {
            queryWrapper.eq("is_active", users.getIsActive());
        }
        return usersDao.selectList(queryWrapper);
    }

    /**
     * 新增数据
     *
     * @param users 实例对象
     * @return 实例对象
     */
    @Override
    public Users insert(Users users) {
        usersDao.insert(users);
        return users;
    }

    /**
     * 修改数据
     *
     * @param users 实例对象
     * @return 实例对象
     */
    @Override
    public Users update(Users users) {
        usersDao.updateById(users);
        return queryById(users.getId());
    }

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    @Override
    public boolean deleteById(Integer id) {
        return usersDao.deleteById(id) > 0;
    }

}
