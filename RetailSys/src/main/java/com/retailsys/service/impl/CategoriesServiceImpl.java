package com.retailsys.service.impl;

import com.retailsys.entity.Categories;
import com.retailsys.dao.CategoriesDao;
import com.retailsys.service.CategoriesService;

import java.util.List;

import org.springframework.stereotype.Service;
import jakarta.annotation.Resource;

/**
 * (Categories)表服务实现类
 *
 * @author makejava
 * @since 2025-09-23 17:57:19
 */
@Service("categoriesService")
public class CategoriesServiceImpl implements CategoriesService {
    @Resource
    private CategoriesDao categoriesDao;

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    @Override
    public Categories queryById(Integer id) {
        return this.categoriesDao.queryById(id);
    }

    /**
     * 分页查询
     *
     * @param categories 筛选条�?
     * @return 查询结果
     */
    @Override
    public List<Categories> queryAll(Categories categories) {
        return categoriesDao.queryAll(categories);
    }

    /**
     * 新增数据
     *
     * @param categories 实例对象
     * @return 实例对象
     */
    @Override
    public Categories insert(Categories categories) {
        this.categoriesDao.insert(categories);
        return categories;
    }

    /**
     * 修改数据
     *
     * @param categories 实例对象
     * @return 实例对象
     */
    @Override
    public Categories update(Categories categories) {
        this.categoriesDao.update(categories);
        return this.queryById(categories.getId());
    }

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    @Override
    public boolean deleteById(Integer id) {
        return this.categoriesDao.deleteById(id) > 0;
    }
}
