package com.retailsys.service.impl;

import com.retailsys.entity.Messages;
import com.retailsys.dao.MessagesDao;
import com.retailsys.service.MessagesService;

import java.util.List;

import org.springframework.stereotype.Service;
import jakarta.annotation.Resource;

/**
 * (Messages)表服务实现类
 *
 * @author makejava
 * @since 2025-09-23 17:57:45
 */
@Service("messagesService")
public class MessagesServiceImpl implements MessagesService {
    @Resource
    private MessagesDao messagesDao;

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    @Override
    public Messages queryById(Integer id) {
        return this.messagesDao.queryById(id);
    }

    /**
     * 分页查询
     *
     * @param messages 筛选条�?
     * @return 查询结果
     */
    @Override
    public List<Messages> queryAll(Messages messages) {
        return messagesDao.queryAll(messages);
    }

    /**
     * 新增数据
     *
     * @param messages 实例对象
     * @return 实例对象
     */
    @Override
    public Messages insert(Messages messages) {
        this.messagesDao.insert(messages);
        return messages;
    }

    /**
     * 修改数据
     *
     * @param messages 实例对象
     * @return 实例对象
     */
    @Override
    public Messages update(Messages messages) {
        this.messagesDao.update(messages);
        return this.queryById(messages.getId());
    }

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    @Override
    public boolean deleteById(Integer id) {
        return this.messagesDao.deleteById(id) > 0;
    }
}
