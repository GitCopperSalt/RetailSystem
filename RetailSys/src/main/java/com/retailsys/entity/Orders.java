package com.retailsys.entity;

import java.util.Date;
import java.io.Serializable;

/**
 * (Orders)实体�?
 *
 * @author makejava
 * @since 2025-09-23 17:58:59
 */
public class Orders implements Serializable {
    private static final long serialVersionUID = -89051790491649604L;
/**
     * 订单ID，主�?
     */
    private Integer id;
/**
     * 订单编号
     */
    private String orderNo;
/**
     * 用户ID，关联users�?
     */
    private Integer userId;
/**
     * 订单总金�?
     */
    private Double totalAmount;
/**
     * 订单状�?
     */
    private String status;
/**
     * 支付方式
     */
    private String paymentMethod;
/**
     * 支付时间
     */
    private Date paymentTime;
/**
     * 收货地址ID，关联addresses�?
     */
    private Integer shippingAddressId;
/**
     * 联系电话
     */
    private String contactPhone;
/**
     * 联系人姓�?
     */
    private String contactName;
/**
     * 订单备注
     */
    private String remark;
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

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Date getPaymentTime() {
        return paymentTime;
    }

    public void setPaymentTime(Date paymentTime) {
        this.paymentTime = paymentTime;
    }

    public Integer getShippingAddressId() {
        return shippingAddressId;
    }

    public void setShippingAddressId(Integer shippingAddressId) {
        this.shippingAddressId = shippingAddressId;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
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

