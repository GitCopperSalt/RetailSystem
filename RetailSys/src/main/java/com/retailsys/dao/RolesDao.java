package com.retailsys.dao;

import com.retailsys.entity.Roles;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * (Roles)表数据库访问层
 *
 * @author makejava
 * @since 2025-09-23 17:59:47
 */
public interface RolesDao {

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    Roles queryById(Integer id);

    /**
     * 查询指定行数数据
     *
     * @param roles 查询条件
     * @return 对象列表
     */
    List<Roles> queryAll(Roles roles);

    /**
     * 统计总行数
     *
     * @param roles 查询条件
     * @return 总行数
     */
    long count(Roles roles);

    /**
     * 新增数据
     *
     * @param roles 实例对象
     * @return 影响行数
     */
    int insert(Roles roles);

    /**
     * 批量新增数据（MyBatis原生foreach方法）
     *
     * @param entities List<Roles> 实例对象列表
     * @return 影响行数
     */
    int insertBatch(@Param("entities") List<Roles> entities);

    /**
     * 批量新增或按主键更新数据（MyBatis原生foreach方法）
     *
     * @param entities List<Roles> 实例对象列表
     * @return 影响行数
     * @throws org.springframework.jdbc.BadSqlGrammarException 入参是空List的时候会抛SQL语句错误的异常，请自行校验入参
     */
    int insertOrUpdateBatch(@Param("entities") List<Roles> entities);

    /**
     * 修改数据
     *
     * @param roles 实例对象
     * @return 影响行数
     */
    int update(Roles roles);

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 影响行数
     */
    int deleteById(Integer id);

}

