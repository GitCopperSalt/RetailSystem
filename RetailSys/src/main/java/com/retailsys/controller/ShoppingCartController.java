package com.retailsys.controller;

import com.retailsys.entity.ShoppingCart;
import com.retailsys.service.ShoppingCartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import jakarta.annotation.Resource;

/**
 * (ShoppingCart)表控制层
 *
 * @author makejava
 * @since 2025-09-23 17:59:55
 */
@RestController
@RequestMapping("/api/shoppingCart")
public class ShoppingCartController {
    /**
     * 服务对象
     */
    @Resource
    private ShoppingCartService shoppingCartService;

    /**
     * 查询所有数�?
     *
     * @param shoppingCart 筛选条�?
     * @return 查询结果
     */
    @GetMapping
    public ResponseEntity<List<ShoppingCart>> queryAll(ShoppingCart shoppingCart) {
        return ResponseEntity.ok(this.shoppingCartService.queryAll(shoppingCart));
    }

    /**
     * 通过主键查询单条数据
     *
     * @param id 主键
     * @return 单条数据
     */
    @GetMapping("{id}")
    public ResponseEntity<ShoppingCart> queryById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.shoppingCartService.queryById(id));
    }

    /**
     * 新增数据
     *
     * @param shoppingCart 实体
     * @return 新增结果
     */
    @PostMapping
    public ResponseEntity<ShoppingCart> add(ShoppingCart shoppingCart) {
        return ResponseEntity.ok(this.shoppingCartService.insert(shoppingCart));
    }

    /**
     * 编辑数据
     *
     * @param shoppingCart 实体
     * @return 编辑结果
     */
    @PutMapping
    public ResponseEntity<ShoppingCart> edit(ShoppingCart shoppingCart) {
        return ResponseEntity.ok(this.shoppingCartService.update(shoppingCart));
    }

    /**
     * 删除数据
     *
     * @param id 主键
     * @return 删除是否成功
     */
    @DeleteMapping
    public ResponseEntity<Boolean> deleteById(Integer id) {
        return ResponseEntity.ok(this.shoppingCartService.deleteById(id));
    }

}

