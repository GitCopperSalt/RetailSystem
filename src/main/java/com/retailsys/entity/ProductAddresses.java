package com.retailsys.entity;

import java.util.Date;
import java.io.Serializable;

/**
 * (ProductAddresses)实体�?
 *
 * @author makejava
 * @since 2025-09-23 17:59:21
 */
public class ProductAddresses implements Serializable {
    private static final long serialVersionUID = -90500958785568352L;
/**
     * 地址ID，主�?
     */
    private Integer id;
/**
     * 地址名称
     */
    private String name;
/**
     * 联系人姓�?
     */
    private String contactPerson;
/**
     * 联系电话
     */
    private String contactPhone;
/**
     * 省份
     */
    private String province;
/**
     * 城市
     */
    private String city;
/**
     * �?�?
     */
    private String district;
/**
     * 详细地址
     */
    private String addressDetail;
/**
     * 邮政编码
     */
    private String zipCode;
/**
     * 地址类型（如仓库、发货点�?
     */
    private String type;
/**
     * 是否默认地址
     */
    private Integer isDefault;
/**
     * 是否激�?
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

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
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

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getIsDefault() {
        return isDefault;
    }

    public void setIsDefault(Integer isDefault) {
        this.isDefault = isDefault;
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

