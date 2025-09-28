package com.retailsys.auth;

import com.retailsys.dao.RolesDao;
import com.retailsys.dao.UsersDao;
import com.retailsys.entity.Roles;
import com.retailsys.entity.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * UserDetailsService接口的实现类，用于加载用户信息
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsersDao usersDao;

    @Autowired
    private RolesDao rolesDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 从数据库中查询用户信息
        Users user = usersDao.queryByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        // 从数据库中查询用户实际角色信息
        String roleName = "USER"; // 默认角色
        if (user.getRoleId() != null) {
            Roles role = rolesDao.queryById(user.getRoleId());
            if (role != null && role.getRoleName() != null) {
                roleName = role.getRoleName();
            }
        }

        // 构建并返回UserDetails对象
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .roles(roleName) // 使用实际角色
                .build();
    }
}