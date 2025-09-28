package com.retailsys.service;

import com.retailsys.entity.Messages;
import java.util.List;

/**
 * (Messages)表服务接�?
 *
 * @author makejava
 * @since 2025-09-23 17:57:45
 */
public interface MessagesService {

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    Messages queryById(Integer id);

    /**
     * 分页查询
     *
     * @param messages 筛选条件
     * @return 查询结果
     */
    List<Messages> queryAll(Messages messages);

    /**
     * 新增数据
     *
     * @param messages 实例对象
     * @return 实例对象
     */
    Messages insert(Messages messages);

    /**
     * 修改数据
     *
     * @param messages 实例对象
     * @return 实例对象
     */
    Messages update(Messages messages);

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    boolean deleteById(Integer id);

}
