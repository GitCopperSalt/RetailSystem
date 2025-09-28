package com.retailsys.service.impl;

import com.retailsys.entity.Discounts;
import com.retailsys.dao.DiscountsDao;
import com.retailsys.service.DiscountsService;

import java.util.List;

import org.springframework.stereotype.Service;
import jakarta.annotation.Resource;

/**
 * (Discounts)表服务实现类
 *
 * @author makejava
 * @since 2025-09-23 17:57:33
 */
@Service("discountsService")
public class DiscountsServiceImpl implements DiscountsService {
    @Resource
    private DiscountsDao discountsDao;

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    @Override
    public Discounts queryById(Integer id) {
        return this.discountsDao.queryById(id);
    }

    /**
     * 分页查询
     *
     * @param discounts 筛选条件
     * @return 查询结果
     */
    @Override
    public List<Discounts> queryAll(Discounts discounts) {
        return discountsDao.queryAll(discounts);
    }

    /**
     * 新增数据
     *
     * @param discounts 实例对象
     * @return 实例对象
     */
    @Override
    public Discounts insert(Discounts discounts) {
        this.discountsDao.insert(discounts);
        return discounts;
    }

    /**
     * 修改数据
     *
     * @param discounts 实例对象
     * @return 实例对象
     */
    @Override
    public Discounts update(Discounts discounts) {
        this.discountsDao.update(discounts);
        return this.queryById(discounts.getId());
    }

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    @Override
    public boolean deleteById(Integer id) {
        return this.discountsDao.deleteById(id) > 0;
    }
}
