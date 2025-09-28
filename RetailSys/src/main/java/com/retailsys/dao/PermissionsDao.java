package com.retailsys.dao;

import com.retailsys.entity.Permissions;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * (Permissions)表数据库访问层
 *
 * @author makejava
 * @since 2025-09-23 17:59:12
 */
public interface PermissionsDao {

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    Permissions queryById(Integer id);

    /**
     * 查询指定行数
     *
     * @param permissions 查询条件
     * @return 对象列表
     */
    List<Permissions> queryAll(Permissions permissions);

    /**
     * 统计总行数
     *
     * @param permissions 查询条件
     * @return 总行数
     */
    long count(Permissions permissions);

    /**
     * 新增数据
     *
     * @param permissions 实例对象
     * @return 影响行数
     */
    int insert(Permissions permissions);

    /**
     * 批量新增数据（MyBatis原生foreach方法）
     *
     * @param entities List<Permissions> 实例对象列表
     * @return 影响行数
     */
    int insertBatch(@Param("entities") List<Permissions> entities);

    /**
     * 批量新增或按主键更新数据（MyBatis原生foreach方法）
     *
     * @param entities List<Permissions> 实例对象列表
     * @return 影响行数
     * @throws org.springframework.jdbc.BadSqlGrammarException 入参是空List的时候会抛SQL语句错误的异常，请自行校验入参
     */
    int insertOrUpdateBatch(@Param("entities") List<Permissions> entities);

    /**
     * 修改数据
     *
     * @param permissions 实例对象
     * @return 影响行数
     */
    int update(Permissions permissions);

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 影响行数
     */
    int deleteById(Integer id);

}

