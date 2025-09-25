package com.retailsys.entity;

import java.util.Date;
import java.io.Serializable;

/**
 * (Messages)实体类
 *
 * @author makejava
 * @since 2025-09-23 17:57:45
 */
public class Messages implements Serializable {
    private static final long serialVersionUID = 440220244389625944L;
/**
     * 消息ID，主键
     */
    private Integer id;
/**
     * 用户ID，关联users表
     */
    private Integer userId;
/**
     * 消息标题
     */
    private String title;
/**
     * 消息内容
     */
    private String content;
/**
     * 是否已读
     */
    private Integer isRead;
/**
     * 创建时间
     */
    private Date createdAt;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getIsRead() {
        return isRead;
    }

    public void setIsRead(Integer isRead) {
        this.isRead = isRead;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

}

