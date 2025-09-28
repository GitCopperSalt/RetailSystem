package com.retailsys.controller;

import com.retailsys.entity.OrderItems;
import com.retailsys.service.OrderItemsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import jakarta.annotation.Resource;

/**
 * (OrderItems)表控制层
 *
 * @author makejava
 * @since 2025-09-23 17:57:57
 */
@RestController
@RequestMapping("orderItems")
public class OrderItemsController {
    /**
     * 服务对象
     */
    @Resource
    private OrderItemsService orderItemsService;

    /**
     * 查询所有数据
     *
     * @param orderItems 筛选条件
     * @return 查询结果
     */
    @GetMapping
    public ResponseEntity<List<OrderItems>> queryAll(OrderItems orderItems) {
        return ResponseEntity.ok(this.orderItemsService.queryAll(orderItems));
    }

    /**
     * 通过主键查询单条数据
     *
     * @param id 主键
     * @return 单条数据
     */
    @GetMapping("{id}")
    public ResponseEntity<OrderItems> queryById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.orderItemsService.queryById(id));
    }

    /**
     * 新增数据
     *
     * @param orderItems 实体
     * @return 新增结果
     */
    @PostMapping
    public ResponseEntity<OrderItems> add(OrderItems orderItems) {
        return ResponseEntity.ok(this.orderItemsService.insert(orderItems));
    }

    /**
     * 编辑数据
     *
     * @param orderItems 实体
     * @return 编辑结果
     */
    @PutMapping
    public ResponseEntity<OrderItems> edit(OrderItems orderItems) {
        return ResponseEntity.ok(this.orderItemsService.update(orderItems));
    }

    /**
     * 删除数据
     *
     * @param id 主键
     * @return 删除是否成功
     */
    @DeleteMapping("{id}")
    public ResponseEntity<Boolean> deleteById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.orderItemsService.deleteById(id));
    }

}

