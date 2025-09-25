package com.retailsys.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.retailsys.entity.Users;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * (Users)表数据库访问层
 *
 * @author makejava
 * @since 2025-09-23 18:00:03
 */
@Mapper
public interface UsersDao extends BaseMapper<Users> {

    /**
     * 通过用户名查询用�?
     *
     * @param username 用户�?
     * @return 用户对象
     */
    Users queryByUsername(@Param("username") String username);
}

