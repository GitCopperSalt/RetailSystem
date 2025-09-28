// 确保UserDetailsServiceImpl正确实现
package com.retailsys.auth;

import com.retailsys.dao.PermissionsDao;
import com.retailsys.dao.RolePermissionsDao;
import com.retailsys.dao.RolesDao;
import com.retailsys.dao.UsersDao;
import com.retailsys.entity.Permissions;
import com.retailsys.entity.RolePermissions;
import com.retailsys.entity.Roles;
import com.retailsys.entity.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 用户详情服务实现
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsersDao usersDao;

    @Autowired
    private RolesDao rolesDao;
    
    @Autowired
    private RolePermissionsDao rolePermissionsDao;
    
    @Autowired
    private PermissionsDao permissionsDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 从数据库中查询用户
        Users user = usersDao.queryByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("用户不存在: " + username);
        }

        // 检查账户是否激活
        if (user.getIsActive() != 1) {
            throw new UsernameNotFoundException("账户未激活: " + username);
        }

        // 获取用户的角色和权限
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        if (user.getRoleId() != null) {
            Roles role = rolesDao.queryById(user.getRoleId());
            if (role != null && role.getRoleName() != null) {
                // 添加角色权限
                authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getRoleName().toUpperCase()));
                
                // 添加具体权限（从数据库中查询）
                addPermissionsByRole(user.getRoleId(), authorities);
            }
        }

        // 创建UserDetails对象
        return new User(
                user.getUsername(),
                user.getPassword(),
                // 账户是否启用
                user.getIsActive() == 1,
                // 账户是否过期
                true, // 实际应用中应检查过期时间
                // 凭证是否过期
                true, // 实际应用中应检查凭证过期时间
                // 账户是否锁定
                true, // 实际应用中应检查锁定状态
                authorities
        );
    }

    // 根据角色ID从数据库中查询并添加具体权限
    private void addPermissionsByRole(Integer roleId, List<SimpleGrantedAuthority> authorities) {
        if (roleId == null) {
            return;
        }
        
        // 查询角色对应的所有权限关联记录
        RolePermissions rolePermissionQuery = new RolePermissions();
        rolePermissionQuery.setRoleId(roleId);
        List<RolePermissions> rolePermissions = rolePermissionsDao.queryAll(rolePermissionQuery);
        
        // 为每个权限ID查询权限名称并添加到authorities中
        for (RolePermissions rp : rolePermissions) {
            if (rp.getPermissionId() != null) {
                Permissions permission = permissionsDao.queryById(rp.getPermissionId());
                if (permission != null && permission.getPermissionName() != null) {
                    authorities.add(new SimpleGrantedAuthority(permission.getPermissionName()));
                }
            }
        }
    }
}

