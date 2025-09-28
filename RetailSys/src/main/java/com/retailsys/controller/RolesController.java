package com.retailsys.controller;

import com.retailsys.entity.Roles;
import com.retailsys.service.RolesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import jakarta.annotation.Resource;

/**
 * (Roles)表控制层
 *
 * @author makejava
 * @since 2025-09-23 17:59:47
 */
@RestController
@RequestMapping("roles")
public class RolesController {
    /**
     * 服务对象
     */
    @Resource
    private RolesService rolesService;

    /**
     * 查询所有数据
     *
     * @param roles 筛选条件
     * @return 查询结果
     */
    @GetMapping
    public ResponseEntity<List<Roles>> queryAll(Roles roles) {
        return ResponseEntity.ok(this.rolesService.queryAll(roles));
    }

    /**
     * 通过主键查询单条数据
     *
     * @param id 主键
     * @return 单条数据
     */
    @GetMapping("{id}")
    public ResponseEntity<Roles> queryById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.rolesService.queryById(id));
    }

    /**
     * 新增数据
     *
     * @param roles 实体
     * @return 新增结果
     */
    @PostMapping
    public ResponseEntity<Roles> add(Roles roles) {
        return ResponseEntity.ok(this.rolesService.insert(roles));
    }

    /**
     * 编辑数据
     *
     * @param roles 实体
     * @return 编辑结果
     */
    @PutMapping
    public ResponseEntity<Roles> edit(Roles roles) {
        return ResponseEntity.ok(this.rolesService.update(roles));
    }

    /**
     * 删除数据
     *
     * @param id 主键
     * @return 删除是否成功
     */
    @DeleteMapping("{id}")
    public ResponseEntity<Boolean> deleteById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.rolesService.deleteById(id));
    }

}

