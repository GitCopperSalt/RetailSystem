package com.retailsys.dao;

import com.retailsys.entity.Messages;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * (Messages)表数据库访问层
 *
 * @author makejava
 * @since 2025-09-23 17:57:45
 */
public interface MessagesDao {

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    Messages queryById(Integer id);

    /**
     * 查询指定行数
     *
     * @param messages 查询条件
     * @return 对象列表
     */
    List<Messages> queryAll(Messages messages);

    /**
     * 统计总行数
     *
     * @param messages 查询条件
     * @return 总行数
     */
    long count(Messages messages);

    /**
     * 新增数据
     *
     * @param messages 实例对象
     * @return 影响行数
     */
    int insert(Messages messages);

    /**
     * 批量新增数据（MyBatis原生foreach方法）
     *
     * @param entities List<Messages> 实例对象列表
     * @return 影响行数
     */
    int insertBatch(@Param("entities") List<Messages> entities);

    /**
     * 批量新增或按主键更新数据（MyBatis原生foreach方法）
     *
     * @param entities List<Messages> 实例对象列表
     * @return 影响行数
     * @throws org.springframework.jdbc.BadSqlGrammarException 入参是空List的时候会抛SQL语句错误的异常，请自行校验入参
     */
    int insertOrUpdateBatch(@Param("entities") List<Messages> entities);

    /**
     * 修改数据
     *
     * @param messages 实例对象
     * @return 影响行数
     */
    int update(Messages messages);

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 影响行数
     */
    int deleteById(Integer id);

}

