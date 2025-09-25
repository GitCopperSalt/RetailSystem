package com.retailsys.service.impl;

import com.retailsys.entity.Addresses;
import com.retailsys.dao.AddressesDao;
import com.retailsys.service.AddressesService;

import java.util.List;

import org.springframework.stereotype.Service;
import jakarta.annotation.Resource;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

/**
 * (Addresses)表服务实现类
 *
 * @author makejava
 * @since 2025-09-23 17:57:04
 */
@Service("addressesService")
public class AddressesServiceImpl implements AddressesService {
    @Resource
    private AddressesDao addressesDao;

    /**
     * 通过ID查询单条数据
     *
     * @param id 主键
     * @return 实例对象
     */
    @Override
    public Addresses queryById(Integer id) {
        return this.addressesDao.queryById(id);
    }

    /**
     * 分页查询
     *
     * @param addresses 筛选条�?
     * @return 查询结果
     */
    @Override
    public List<Addresses> queryAll(Addresses addresses) {
        // 提供默认分页参数，查询所有数�?
        Page<Addresses> page = new Page<>(1, Integer.MAX_VALUE);
        return addressesDao.queryAllByLimit(addresses, page);
    }

    /**
     * 新增数据
     *
     * @param addresses 实例对象
     * @return 实例对象
     */
    @Override
    public Addresses insert(Addresses addresses) {
        this.addressesDao.insert(addresses);
        return addresses;
    }

    /**
     * 修改数据
     *
     * @param addresses 实例对象
     * @return 实例对象
     */
    @Override
    public Addresses update(Addresses addresses) {
        this.addressesDao.update(addresses);
        return this.queryById(addresses.getId());
    }

    /**
     * 通过主键删除数据
     *
     * @param id 主键
     * @return 是否成功
     */
    @Override
    public boolean deleteById(Integer id) {
        return this.addressesDao.deleteById(id) > 0;
    }
}
