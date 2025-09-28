package com.retailsys.controller;

import com.retailsys.entity.RolePermissions;
import com.retailsys.service.RolePermissionsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import jakarta.annotation.Resource;

/**
 * (RolePermissions)表控制层
 *
 * @author makejava
 * @since 2025-09-23 17:59:39
 */
@RestController
@RequestMapping("rolePermissions")
public class RolePermissionsController {
    /**
     * 服务对象
     */
    @Resource
    private RolePermissionsService rolePermissionsService;

    /**
     * 查询所有数据
     *
     * @param rolePermissions 筛选条件
     * @return 查询结果
     */
    @GetMapping
    public ResponseEntity<List<RolePermissions>> queryAll(RolePermissions rolePermissions) {
        return ResponseEntity.ok(this.rolePermissionsService.queryAll(rolePermissions));
    }

    /**
     * 通过主键查询单条数据
     *
     * @param id 主键
     * @return 单条数据
     */
    @GetMapping("{id}")
    public ResponseEntity<RolePermissions> queryById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.rolePermissionsService.queryById(id));
    }

    /**
     * 新增数据
     *
     * @param rolePermissions 实体
     * @return 新增结果
     */
    @PostMapping
    public ResponseEntity<RolePermissions> add(RolePermissions rolePermissions) {
        return ResponseEntity.ok(this.rolePermissionsService.insert(rolePermissions));
    }

    /**
     * 编辑数据
     *
     * @param rolePermissions 实体
     * @return 编辑结果
     */
    @PutMapping
    public ResponseEntity<RolePermissions> edit(RolePermissions rolePermissions) {
        return ResponseEntity.ok(this.rolePermissionsService.update(rolePermissions));
    }

    /**
     * 删除数据
     *
     * @param id 主键
     * @return 删除是否成功
     */
    @DeleteMapping("{id}")
    public ResponseEntity<Boolean> deleteById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.rolePermissionsService.deleteById(id));
    }

}

