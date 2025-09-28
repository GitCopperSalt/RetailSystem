package com.retailsys.service.impl;

import com.retailsys.entity.ProductAddresses;
import com.retailsys.dao.ProductAddressesDao;
import com.retailsys.service.ProductAddressesService;

import java.util.List;

import org.springframework.stereotype.Service;
import jakarta.annotation.Resource;

/**
 * (ProductAddresses)表服务实现类
 *
 * @author makejava
 * @since 2025-09-23 17:59:21
 */
@Service("productAddressesService")
public class ProductAddressesServiceImpl implements ProductAddressesService {
    @Resource
    private ProductAddressesDao productAddressesDao;

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    @Override
    public ProductAddresses queryById(Integer id) {
        return this.productAddressesDao.queryById(id);
    }

    /**
     * 分页查询
     *
     * @param productAddresses 筛选条件
     * @return 查询结果
     */
    @Override
    public List<ProductAddresses> queryAll(ProductAddresses productAddresses) {
        return productAddressesDao.queryAll(productAddresses);
    }

    /**
     * 新增数据
     *
     * @param productAddresses 实例对象
     * @return 实例对象
     */
    @Override
    public ProductAddresses insert(ProductAddresses productAddresses) {
        this.productAddressesDao.insert(productAddresses);
        return productAddresses;
    }

    /**
     * 修改数据
     *
     * @param productAddresses 实例对象
     * @return 实例对象
     */
    @Override
    public ProductAddresses update(ProductAddresses productAddresses) {
        this.productAddressesDao.update(productAddresses);
        return this.queryById(productAddresses.getId());
    }

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    @Override
    public boolean deleteById(Integer id) {
        return this.productAddressesDao.deleteById(id) > 0;
    }
}
