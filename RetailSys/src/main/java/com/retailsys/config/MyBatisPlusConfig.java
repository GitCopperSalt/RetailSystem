package com.retailsys.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

/**
 * MyBatis-Plus 配置类
 */
@Configuration
@MapperScan("com.retailsys.dao") // 扫描指定包下的Mapper接口
public class MyBatisPlusConfig {
    
}
