package com.retailsys.controller;

import com.retailsys.entity.Orders;
import com.retailsys.service.OrdersService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import jakarta.annotation.Resource;

/**
 * (Orders)表控制层
 *
 * @author makejava
 * @since 2025-09-23 17:58:59
 */
@RestController
@RequestMapping("orders")
public class OrdersController {
    /**
     * 服务对象
     */
    @Resource
    private OrdersService ordersService;

    /**
     * 查询所有数据
     *
     * @param orders 筛选条件
     * @return 查询结果
     */
    @GetMapping
    public ResponseEntity<List<Orders>> queryAll(Orders orders) {
        return ResponseEntity.ok(this.ordersService.queryAll(orders));
    }

    /**
     * 通过主键查询单条数据
     *
     * @param id 主键
     * @return 单条数据
     */
    @GetMapping("{id}")
    public ResponseEntity<Orders> queryById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.ordersService.queryById(id));
    }

    /**
     * 新增数据
     *
     * @param orders 实体
     * @return 新增结果
     */
    @PostMapping
    public ResponseEntity<Orders> add(Orders orders) {
        return ResponseEntity.ok(this.ordersService.insert(orders));
    }

    /**
     * 编辑数据
     *
     * @param orders 实体
     * @return 编辑结果
     */
    @PutMapping
    public ResponseEntity<Orders> edit(Orders orders) {
        return ResponseEntity.ok(this.ordersService.update(orders));
    }

    /**
     * 删除数据
     *
     * @param id 主键
     * @return 删除是否成功
     */
    @DeleteMapping("{id}")
    public ResponseEntity<Boolean> deleteById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.ordersService.deleteById(id));
    }

}

