package com.retailsys.controller;

import com.retailsys.entity.Discounts;
import com.retailsys.service.DiscountsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import jakarta.annotation.Resource;

/**
 * (Discounts)表控制层
 *
 * @author makejava
 * @since 2025-09-23 17:57:33
 */
@RestController
@RequestMapping("discounts")
public class DiscountsController {
    /**
     * 服务对象
     */
    @Resource
    private DiscountsService discountsService;

    /**
     * 查询所有数�?
     *
     * @param discounts 筛选条�?
     * @return 查询结果
     */
    @GetMapping
    public ResponseEntity<List<Discounts>> queryAll(Discounts discounts) {
        return ResponseEntity.ok(this.discountsService.queryAll(discounts));
    }

    /**
     * 通过主键查询单条数据
     *
     * @param id 主键
     * @return 单条数据
     */
    @GetMapping("{id}")
    public ResponseEntity<Discounts> queryById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.discountsService.queryById(id));
    }

    /**
     * 新增数据
     *
     * @param discounts 实体
     * @return 新增结果
     */
    @PostMapping
    public ResponseEntity<Discounts> add(Discounts discounts) {
        return ResponseEntity.ok(this.discountsService.insert(discounts));
    }

    /**
     * 编辑数据
     *
     * @param discounts 实体
     * @return 编辑结果
     */
    @PutMapping
    public ResponseEntity<Discounts> edit(Discounts discounts) {
        return ResponseEntity.ok(this.discountsService.update(discounts));
    }

    /**
     * 删除数据
     *
     * @param id 主键
     * @return 删除是否成功
     */
    @DeleteMapping
    public ResponseEntity<Boolean> deleteById(Integer id) {
        return ResponseEntity.ok(this.discountsService.deleteById(id));
    }

}

