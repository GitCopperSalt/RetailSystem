package com.retailsys.service.impl;

import com.retailsys.entity.Products;
import com.retailsys.dao.ProductsDao;
import com.retailsys.service.ProductsService;
import org.springframework.stereotype.Service;
import jakarta.annotation.Resource;
import java.util.List;

/**
 * (Products)表服务实现类
 *
 * @author makejava
 * @since 2025-09-23 17:59:29
 */
@Service("productsService")
public class ProductsServiceImpl implements ProductsService {
    @Resource
    private ProductsDao productsDao;

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    @Override
    public Products queryById(Integer id) {
        return this.productsDao.queryById(id);
    }

    /**
     * 分页查询
     *
     * @param products 筛选条�?
     * @return 查询结果
     */
    @Override
    public List<Products> queryAll(Products products) {
        return productsDao.queryAll(products);
    }

    /**
     * 新增数据
     *
     * @param products 实例对象
     * @return 实例对象
     */
    @Override
    public Products insert(Products products) {
        this.productsDao.insert(products);
        return products;
    }

    /**
     * 修改数据
     *
     * @param products 实例对象
     * @return 实例对象
     */
    @Override
    public Products update(Products products) {
        this.productsDao.update(products);
        return this.queryById(products.getId());
    }

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    @Override
    public boolean deleteById(Integer id) {
        return this.productsDao.deleteById(id) > 0;
    }
}
