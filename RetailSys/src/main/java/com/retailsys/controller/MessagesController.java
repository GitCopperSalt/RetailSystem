package com.retailsys.controller;

import com.retailsys.entity.Messages;
import com.retailsys.service.MessagesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import jakarta.annotation.Resource;

/**
 * (Messages)表控制层
 *
 * @author makejava
 * @since 2025-09-23 17:57:45
 */
@RestController
@RequestMapping("messages")
public class MessagesController {
    /**
     * 服务对象
     */
    @Resource
    private MessagesService messagesService;

    /**
     * 查询所有数据
     *
     * @param messages 筛选条件
     * @return 查询结果
     */
    @GetMapping
    public ResponseEntity<List<Messages>> queryAll(Messages messages) {
        return ResponseEntity.ok(this.messagesService.queryAll(messages));
    }

    /**
     * 通过主键查询单条数据
     *
     * @param id 主键
     * @return 单条数据
     */
    @GetMapping("{id}")
    public ResponseEntity<Messages> queryById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.messagesService.queryById(id));
    }

    /**
     * 新增数据
     *
     * @param messages 实体
     * @return 新增结果
     */
    @PostMapping
    public ResponseEntity<Messages> add(Messages messages) {
        return ResponseEntity.ok(this.messagesService.insert(messages));
    }

    /**
     * 编辑数据
     *
     * @param messages 实体
     * @return 编辑结果
     */
    @PutMapping
    public ResponseEntity<Messages> edit(Messages messages) {
        return ResponseEntity.ok(this.messagesService.update(messages));
    }

    /**
     * 删除数据
     *
     * @param id 主键
     * @return 删除是否成功
     */
    @DeleteMapping("{id}")
    public ResponseEntity<Boolean> deleteById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(this.messagesService.deleteById(id));
    }

}

