package com.retailsys.controller;

import com.retailsys.entity.Users;
import com.retailsys.service.UsersService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import jakarta.annotation.Resource;

/**
 * (Users)表控制层
 *
 * @author makejava
 * @since 2025-09-23 18:00:03
 */
@RestController
@RequestMapping("users")
public class UsersController {
    /**
     * 服务对象
     */
    @Resource
    private UsersService usersService;

    /**
     * 查询所有数据
     *
     * @param users 筛选条件
     * @return 查询结果
     */
    @GetMapping
    public ResponseEntity<List<Users>> queryAll(Users users) {
        return ResponseEntity.ok(this.usersService.queryAll(users));
    }

    /**
     * 通过主键查询单条数据
     *
     * @param id 主键
     * @return 单条数据
     */
    @GetMapping("{id}")
    public ResponseEntity<Users> queryById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.usersService.queryById(id));
    }

    /**
     * 新增数据
     *
     * @param users 实体
     * @return 新增结果
     */
    @PostMapping
    public ResponseEntity<Users> add(Users users) {
        return ResponseEntity.ok(this.usersService.insert(users));
    }

    /**
     * 编辑数据
     *
     * @param users 实体
     * @return 编辑结果
     */
    @PutMapping
    public ResponseEntity<Users> edit(Users users) {
        return ResponseEntity.ok(this.usersService.update(users));
    }

    /**
     * 删除数据
     *
     * @param id 主键
     * @return 删除是否成功
     */
    @DeleteMapping("{id}")
    public ResponseEntity<Boolean> deleteById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.usersService.deleteById(id));
    }

}

