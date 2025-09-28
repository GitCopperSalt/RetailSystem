package com.retailsys.service;

import com.retailsys.entity.ProductAddresses;
import java.util.List;

/**
 * (ProductAddresses)表服务接�?
 *
 * @author makejava
 * @since 2025-09-23 17:59:21
 */
public interface ProductAddressesService {

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    ProductAddresses queryById(Integer id);

    /**
     * 分页查询
     *
     * @param productAddresses 筛选条件
     * @return 查询结果
     */
    List<ProductAddresses> queryAll(ProductAddresses productAddresses);

    /**
     * 新增数据
     *
     * @param productAddresses 实例对象
     * @return 实例对象
     */
    ProductAddresses insert(ProductAddresses productAddresses);

    /**
     * 修改数据
     *
     * @param productAddresses 实例对象
     * @return 实例对象
     */
    ProductAddresses update(ProductAddresses productAddresses);

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    boolean deleteById(Integer id);

}
