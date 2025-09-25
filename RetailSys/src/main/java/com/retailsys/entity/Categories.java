package com.retailsys.entity;

import java.util.Date;
import java.io.Serializable;

/**
 * (Categories)实体�?
 *
 * @author makejava
 * @since 2025-09-23 17:57:19
 */
public class Categories implements Serializable {
    private static final long serialVersionUID = 861894520361047372L;
/**
     * 分类ID，主�?
     */
    private Integer id;
/**
     * 分类名称
     */
    private String name;
/**
     * 分类描述
     */
    private String description;
/**
     * 父分类ID，自关联
     */
    private Integer parentId;
/**
     * 是否启用
     */
    private Integer isActive;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public Integer getIsActive() {
        return isActive;
    }

    public void setIsActive(Integer isActive) {
        this.isActive = isActive;
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

