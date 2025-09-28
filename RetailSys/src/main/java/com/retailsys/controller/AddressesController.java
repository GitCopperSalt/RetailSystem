package com.retailsys.controller;


import com.retailsys.entity.Addresses;
import com.retailsys.service.AddressesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import java.util.List;

/**
 * (Addresses)表控制层
 *
 * @author makejava
 * @since 2025-09-23 17:56:59
 */
@RestController
@RequestMapping("addresses")
public class AddressesController {
    /**
     * 服务对象
     */
    @Resource
    private AddressesService addressesService;

    /**
     * 查询所有数据
     *
     * @param addresses 筛选条件
     * @return 查询结果
     */
    @GetMapping
    public ResponseEntity<List<Addresses>> queryAll(Addresses addresses) {
        return ResponseEntity.ok(this.addressesService.queryAll(addresses));
    }

    /**
     * 通过主键查询单条数据
     *
     * @param id 主键
     * @return 单条数据
     */
    @GetMapping("{id}")
    public ResponseEntity<Addresses> queryById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.addressesService.queryById(id));
    }

    /**
     * 新增数据
     *
     * @param addresses 实体
     * @return 新增结果
     */
    @PostMapping
    public ResponseEntity<Addresses> add(Addresses addresses) {
        return ResponseEntity.ok(this.addressesService.insert(addresses));
    }

    /**
     * 编辑数据
     *
     * @param addresses 实体
     * @return 编辑结果
     */
    @PutMapping
    public ResponseEntity<Addresses> edit(Addresses addresses) {
        return ResponseEntity.ok(this.addressesService.update(addresses));
    }

    /**
     * 删除数据
     *
     * @param id 主键
     * @return 删除是否成功
     */
    @DeleteMapping("{id}")
    public ResponseEntity<Boolean> deleteById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.addressesService.deleteById(id));
    }

}

