package com.retailsys.entity;

import java.util.Date;
import java.io.Serializable;

/**
 * (RolePermissions)实体�?
 *
 * @author makejava
 * @since 2025-09-23 17:59:39
 */
public class RolePermissions implements Serializable {
    private static final long serialVersionUID = 516092868985585024L;
/**
     * 关联ID，主�?
     */
    private Integer id;
/**
     * 角色ID，关联roles�?
     */
    private Integer roleId;
/**
     * 权限ID，关联permissions�?
     */
    private Integer permissionId;
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

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public Integer getPermissionId() {
        return permissionId;
    }

    public void setPermissionId(Integer permissionId) {
        this.permissionId = permissionId;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

}

