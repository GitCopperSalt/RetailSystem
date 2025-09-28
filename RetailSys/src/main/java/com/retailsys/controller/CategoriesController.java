package com.retailsys.controller;

import com.retailsys.entity.Categories;
import com.retailsys.service.CategoriesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import jakarta.annotation.Resource;

/**
 * (Categories)表控制层
 *
 * @author makejava
 * @since 2025-09-23 17:57:19
 */
@RestController
@RequestMapping("categories")
public class CategoriesController {
    /**
     * 服务对象
     */
    @Resource
    private CategoriesService categoriesService;

    /**
     * 查询所有数据
     *
     * @param categories 筛选条件
     * @return 查询结果
     */
    @GetMapping
    public ResponseEntity<List<Categories>> queryAll(Categories categories) {
        return ResponseEntity.ok(this.categoriesService.queryAll(categories));
    }

    /**
     * 通过主键查询单条数据
     *
     * @param id 主键
     * @return 单条数据
     */
    @GetMapping("{id}")
    public ResponseEntity<Categories> queryById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.categoriesService.queryById(id));
    }

    /**
     * 新增数据
     *
     * @param categories 实体
     * @return 新增结果
     */
    @PostMapping
    public ResponseEntity<Categories> add(Categories categories) {
        return ResponseEntity.ok(this.categoriesService.insert(categories));
    }

    /**
     * 编辑数据
     *
     * @param categories 实体
     * @return 编辑结果
     */
    @PutMapping
    public ResponseEntity<Categories> edit(Categories categories) {
        return ResponseEntity.ok(this.categoriesService.update(categories));
    }

    /**
     * 删除数据
     *
     * @param id 主键
     * @return 删除是否成功
     */
    @DeleteMapping("{id}")
    public ResponseEntity<Boolean> deleteById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.categoriesService.deleteById(id));
    }

}

