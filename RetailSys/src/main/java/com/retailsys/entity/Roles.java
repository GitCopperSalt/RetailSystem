package com.retailsys.entity;

import java.util.Date;
import java.io.Serializable;

/**
 * (Roles)实体类
 *
 * @author makejava
 * @since 2025-09-23 17:59:47
 */
public class Roles implements Serializable {
    private static final long serialVersionUID = -31126401525238367L;
/**
     * 角色ID，主键
     */
    private Integer id;
/**
     * 角色名称
     */
    private String roleName;
/**
     * 角色描述
     */
    private String description;
/**
     * 创建时间
     */
    private Date createdAt;
/**
     * 更新时间
     */
    private Date updatedAt;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
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

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

}

