package com.retailsys.entity;

import java.util.Date;
import java.io.Serializable;

/**
 * (ShoppingCart)实体类
 *
 * @author makejava
 * @since 2025-09-23 17:59:55
 */
public class ShoppingCart implements Serializable {
    private static final long serialVersionUID = 113424786274099971L;
/**
     * 购物车ID，主键
     */
    private Integer id;
/**
     * 用户ID，关联users�?
     */
    private Integer userId;
/**
     * 商品ID，关联products�?
     */
    private Integer productId;
/**
     * 数量
     */
    private Integer quantity;
/**
     * 是否选中
     */
    private Integer selected;
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

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getSelected() {
        return selected;
    }

    public void setSelected(Integer selected) {
        this.selected = selected;
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

