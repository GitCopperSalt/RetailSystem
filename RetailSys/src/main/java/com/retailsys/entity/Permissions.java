package com.retailsys.entity;

import java.util.Date;
import java.io.Serializable;

/**
 * (Permissions)实体类
 *
 * @author makejava
 * @since 2025-09-23 17:59:12
 */
public class Permissions implements Serializable {
    private static final long serialVersionUID = -31384093310599978L;
/**
     * 权限ID，主键
     */
    private Integer id;
/**
     * 权限名称
     */
    private String permissionName;
/**
     * 权限描述
     */
    private String description;
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

    public String getPermissionName() {
        return permissionName;
    }

    public void setPermissionName(String permissionName) {
        this.permissionName = permissionName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

}

