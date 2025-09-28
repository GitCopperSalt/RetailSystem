package com.retailsys.entity;

import java.util.Date;
import java.io.Serializable;

/**
 * (Addresses)实体类
 *
 * @author makejava
 * @since 2025-09-23 17:57:00
 */
public class Addresses implements Serializable {
    private static final long serialVersionUID = -90607548187174000L;
/**
     * 地址ID，主键
     */
    private Integer id;
/**
     * 用户ID，关联users表
     */
    private Integer userId;
/**
     * 收件人姓名
     */
    private String recipient;
/**
     * 联系电话
     */
    private String phone;
/**
     * 省份
     */
    private String province;
/**
     * 城市
     */
    private String city;
/**
     * 区县
     */
    private String district;
/**
     * 详细地址
     */
    private String addressDetail;
/**
     * 是否默认地址
     */
    private Integer isDefault;
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

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getAddressDetail() {
        return addressDetail;
    }

    public void setAddressDetail(String addressDetail) {
        this.addressDetail = addressDetail;
    }

    public Integer getIsDefault() {
        return isDefault;
    }

    public void setIsDefault(Integer isDefault) {
        this.isDefault = isDefault;
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

