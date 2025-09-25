package com.retailsys.dao;

import com.retailsys.entity.Categories;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * (Categories)表数据库访问�?
 *
 * @author makejava
 * @since 2025-09-23 17:57:19
 */
public interface CategoriesDao {

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    Categories queryById(Integer id);

    /**
     * 查询指定行数�?
     *
     * @param categories 查询条件
     * @return 对象列表
     */
    List<Categories> queryAll(Categories categories);

    /**
     * 统计总行�?
     *
     * @param categories 查询条件
     * @return 总行�?
     */
    long count(Categories categories);

    /**
     * 新增数据
     *
     * @param categories 实例对象
     * @return 影响行数
     */
    int insert(Categories categories);

    /**
     * 批量新增数据（MyBatis原生foreach方法�?
     *
     * @param entities List<Categories> 实例对象列表
     * @return 影响行数
     */
    int insertBatch(@Param("entities") List<Categories> entities);

    /**
     * 批量新增或按主键更新数据（MyBatis原生foreach方法�?
     *
     * @param entities List<Categories> 实例对象列表
     * @return 影响行数
     * @throws org.springframework.jdbc.BadSqlGrammarException 入参是空List的时候会抛SQL语句错误的异常，请自行校验入�?
     */
    int insertOrUpdateBatch(@Param("entities") List<Categories> entities);

    /**
     * 修改数据
     *
     * @param categories 实例对象
     * @return 影响行数
     */
    int update(Categories categories);

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 影响行数
     */
    int deleteById(Integer id);

}

