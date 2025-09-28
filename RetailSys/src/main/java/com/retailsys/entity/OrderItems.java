package com.retailsys.entity;

import java.util.Date;
import java.io.Serializable;

/**
 * (OrderItems)实体类
 *
 * @author makejava
 * @since 2025-09-23 17:57:57
 */
public class OrderItems implements Serializable {
    private static final long serialVersionUID = -84141448884676202L;
/**
     * 订单项ID，主键
     */
    private Integer id;
/**
     * 订单ID，关联orders�?
     */
    private Integer orderId;
/**
     * 商品ID，关联products�?
     */
    private Integer productId;
/**
     * 商品名称
     */
    private String productName;
/**
     * 商品图片URL
     */
    private String productImage;
/**
     * 购买数量
     */
    private Integer quantity;
/**
     * 购买时单价
     */
    private Double price;
/**
     * 商品总价
     */
    private Double totalPrice;
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

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductImage() {
        return productImage;
    }

    public void setProductImage(String productImage) {
        this.productImage = productImage;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

}

