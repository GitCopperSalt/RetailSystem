package com.retailsys.controller;

import com.retailsys.entity.Products;
import com.retailsys.service.ProductsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import jakarta.annotation.Resource;

/**
 * (Products)表控制层
 *
 * @author makejava
 * @since 2025-09-23 17:59:29
 */
@RestController
@RequestMapping("/api/products")
public class ProductsController {
    /**
     * 服务对象
     */
    @Resource
    private ProductsService productsService;

    /**
     * 查询所有数�?
     *
     * @param products 筛选条�?
     * @return 查询结果
     */
    @GetMapping
    public ResponseEntity<List<Products>> queryAll(Products products) {
        return ResponseEntity.ok(this.productsService.queryAll(products));
    }

    /**
     * 通过主键查询单条数据
     *
     * @param id 主键
     * @return 单条数据
     */
    @GetMapping("{id}")
    public ResponseEntity<Products> queryById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.productsService.queryById(id));
    }

    /**
     * 新增数据
     *
     * @param products 实体
     * @return 新增结果
     */
    @PostMapping
    public ResponseEntity<Products> add(Products products) {
        return ResponseEntity.ok(this.productsService.insert(products));
    }

    /**
     * 编辑数据
     *
     * @param products 实体
     * @return 编辑结果
     */
    @PutMapping
    public ResponseEntity<Products> edit(Products products) {
        return ResponseEntity.ok(this.productsService.update(products));
    }

    /**
     * 删除数据
     *
     * @param id 主键
     * @return 删除是否成功
     */
    @DeleteMapping
    public ResponseEntity<Boolean> deleteById(Integer id) {
        return ResponseEntity.ok(this.productsService.deleteById(id));
    }

}

