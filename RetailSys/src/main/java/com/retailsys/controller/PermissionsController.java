package com.retailsys.controller;

import com.retailsys.entity.Permissions;
import com.retailsys.service.PermissionsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import jakarta.annotation.Resource;

/**
 * (Permissions)表控制层
 *
 * @author makejava
 * @since 2025-09-23 17:59:12
 */
@RestController
@RequestMapping("permissions")
public class PermissionsController {
    /**
     * 服务对象
     */
    @Resource
    private PermissionsService permissionsService;

    /**
     * 查询所有数据
     *
     * @param permissions 筛选条件
     * @return 查询结果
     */
    @GetMapping
    public ResponseEntity<List<Permissions>> queryAll(Permissions permissions) {
        return ResponseEntity.ok(this.permissionsService.queryAll(permissions));
    }

    /**
     * 通过主键查询单条数据
     *
     * @param id 主键
     * @return 单条数据
     */
    @GetMapping("{id}")
    public ResponseEntity<Permissions> queryById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.permissionsService.queryById(id));
    }

    /**
     * 新增数据
     *
     * @param permissions 实体
     * @return 新增结果
     */
    @PostMapping
    public ResponseEntity<Permissions> add(Permissions permissions) {
        return ResponseEntity.ok(this.permissionsService.insert(permissions));
    }

    /**
     * 编辑数据
     *
     * @param permissions 实体
     * @return 编辑结果
     */
    @PutMapping
    public ResponseEntity<Permissions> edit(Permissions permissions) {
        return ResponseEntity.ok(this.permissionsService.update(permissions));
    }

    /**
     * 删除数据
     *
     * @param id 主键
     * @return 删除是否成功
     */
    @DeleteMapping("{id}")
    public ResponseEntity<Boolean> deleteById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.permissionsService.deleteById(id));
    }

}

