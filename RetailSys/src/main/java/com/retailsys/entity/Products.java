package com.retailsys.entity;

import java.util.Date;
import java.io.Serializable;

/**
 * (Products)实体类
 *
 * @author makejava
 * @since 2025-09-23 17:59:29
 */
public class Products implements Serializable {
    private static final long serialVersionUID = -35532687325523040L;
/**
     * 商品ID，主键
     */
    private Integer id;
/**
     * 商品名称
     */
    private String name;
/**
     * 商品描述
     */
    private String description;
/**
     * 销售价格
     */
    private Double price;
/**
     * 原价
     */
    private Double originalPrice;
/**
     * 库存数量
     */
    private Integer stock;
/**
     * 分类ID，关联categories表
     */
    private Integer categoryId;
/**
     * 商品图片URL
     */
    private String imageUrl;
/**
     * 是否上架
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

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(Double originalPrice) {
        this.originalPrice = originalPrice;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
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

