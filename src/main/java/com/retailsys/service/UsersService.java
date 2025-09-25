package com.retailsys.service;

import com.retailsys.entity.Users;
import java.util.List;

/**
 * (Users)表服务接�?
 *
 * @author makejava
 * @since 2025-09-23 18:00:03
 */
public interface UsersService {

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    Users queryById(Integer id);

    /**
     * 分页查询
     *
     * @param users 筛选条�?
     * @return 查询结果
     */
    List<Users> queryAll(Users users);

    /**
     * 新增数据
     *
     * @param users 实例对象
     * @return 实例对象
     */
    Users insert(Users users);

    /**
     * 修改数据
     *
     * @param users 实例对象
     * @return 实例对象
     */
    Users update(Users users);

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    boolean deleteById(Integer id);

}
