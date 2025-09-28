package com.retailsys.controller;

import com.retailsys.entity.ProductAddresses;
import com.retailsys.service.ProductAddressesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import jakarta.annotation.Resource;

/**
 * (ProductAddresses)表控制层
 *
 * @author makejava
 * @since 2025-09-23 17:59:21
 */
@RestController
@RequestMapping("productAddresses")
public class ProductAddressesController {
    /**
     * 服务对象
     */
    @Resource
    private ProductAddressesService productAddressesService;

    /**
     * 查询所有数据
     *
     * @param productAddresses 筛选条件
     * @return 查询结果
     */
    @GetMapping
    public ResponseEntity<List<ProductAddresses>> queryAll(ProductAddresses productAddresses) {
        return ResponseEntity.ok(this.productAddressesService.queryAll(productAddresses));
    }

    /**
     * 通过主键查询单条数据
     *
     * @param id 主键
     * @return 单条数据
     */
    @GetMapping("{id}")
    public ResponseEntity<ProductAddresses> queryById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.productAddressesService.queryById(id));
    }

    /**
     * 新增数据
     *
     * @param productAddresses 实体
     * @return 新增结果
     */
    @PostMapping
    public ResponseEntity<ProductAddresses> add(ProductAddresses productAddresses) {
        return ResponseEntity.ok(this.productAddressesService.insert(productAddresses));
    }

    /**
     * 编辑数据
     *
     * @param productAddresses 实体
     * @return 编辑结果
     */
    @PutMapping
    public ResponseEntity<ProductAddresses> edit(ProductAddresses productAddresses) {
        return ResponseEntity.ok(this.productAddressesService.update(productAddresses));
    }

    /**
     * 删除数据
     *
     * @param id 主键
     * @return 删除是否成功
     */
    @DeleteMapping("{id}")
    public ResponseEntity<Boolean> deleteById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.productAddressesService.deleteById(id));
    }

}

