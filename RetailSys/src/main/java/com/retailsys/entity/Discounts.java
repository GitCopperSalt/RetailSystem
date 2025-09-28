package com.retailsys.entity;

import java.util.Date;
import java.io.Serializable;

/**
 * (Discounts)实体类
 *
 * @author makejava
 * @since 2025-09-23 17:57:33
 */
public class Discounts implements Serializable {
    private static final long serialVersionUID = 583336180763363133L;
/**
     * 折扣ID，主键
     */
    private Integer id;
/**
     * 折扣名称
     */
    private String name;
/**
     * 折扣类型
     */
    private String type;
/**
     * 折扣值
     */
    private Double value;
/**
     * 最低消费金额
     */
    private Double minAmount;
/**
     * 开始时间
     */
    private Date startTime;
/**
     * 结束时间
     */
    private Date endTime;
/**
     * 是否激活
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public Double getMinAmount() {
        return minAmount;
    }

    public void setMinAmount(Double minAmount) {
        this.minAmount = minAmount;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
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

