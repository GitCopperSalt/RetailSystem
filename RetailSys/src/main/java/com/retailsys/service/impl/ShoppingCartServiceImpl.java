package com.retailsys.service.impl;

import com.retailsys.entity.ShoppingCart;
import com.retailsys.dao.ShoppingCartDao;
import com.retailsys.service.ShoppingCartService;

import java.util.List;

import org.springframework.stereotype.Service;
import jakarta.annotation.Resource;

/**
 * (ShoppingCart)表服务实现类
 *
 * @author makejava
 * @since 2025-09-23 17:59:55
 */
@Service("shoppingCartService")
public class ShoppingCartServiceImpl implements ShoppingCartService {
    @Resource
    private ShoppingCartDao shoppingCartDao;

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    @Override
    public ShoppingCart queryById(Integer id) {
        return this.shoppingCartDao.queryById(id);
    }

    /**
     * 分页查询
     *
     * @param shoppingCart 筛选条�?
     * @return 查询结果
     */
    @Override
    public List<ShoppingCart> queryAll(ShoppingCart shoppingCart) {
        return shoppingCartDao.queryAll(shoppingCart);
    }

    /**
     * 新增数据
     *
     * @param shoppingCart 实例对象
     * @return 实例对象
     */
    @Override
    public ShoppingCart insert(ShoppingCart shoppingCart) {
        this.shoppingCartDao.insert(shoppingCart);
        return shoppingCart;
    }

    /**
     * 修改数据
     *
     * @param shoppingCart 实例对象
     * @return 实例对象
     */
    @Override
    public ShoppingCart update(ShoppingCart shoppingCart) {
        this.shoppingCartDao.update(shoppingCart);
        return this.queryById(shoppingCart.getId());
    }

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    @Override
    public boolean deleteById(Integer id) {
        return this.shoppingCartDao.deleteById(id) > 0;
    }
}
