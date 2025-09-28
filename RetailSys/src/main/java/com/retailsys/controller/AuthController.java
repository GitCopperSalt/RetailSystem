package com.retailsys.controller;

import com.retailsys.auth.UserDetailsServiceImpl;
import com.retailsys.config.JwtUtils;
import com.retailsys.dao.PermissionsDao;
import com.retailsys.dao.RolePermissionsDao;
import com.retailsys.dao.RolesDao;
import com.retailsys.dao.UsersDao;
import com.retailsys.entity.Permissions;
import com.retailsys.entity.RolePermissions;
import com.retailsys.entity.Roles;
import com.retailsys.entity.Users;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器，处理用户登录和注册功能
 */
@RestController
@RequestMapping("auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UsersDao usersDao;

    @Autowired
    RolesDao rolesDao;
    
    @Autowired
    RolePermissionsDao rolePermissionsDao;
    
    @Autowired
    PermissionsDao permissionsDao;

    @Autowired
    PasswordEncoder passwordEncoder;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        // 添加详细日志记录
        System.out.println("接收到登录请求：用户名 = " + loginRequest.getUsername());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            
            System.out.println("认证成功：" + authentication.isAuthenticated());

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 获取用户实际信息
            Users user = usersDao.queryByUsername(loginRequest.getUsername());
            System.out.println("从数据库获取用户信息：" + (user != null ? user.getUsername() : "未找到用户"));
            
            if (user == null) {
                System.out.println("用户不存在：" + loginRequest.getUsername());
                return ResponseEntity.badRequest().body("Error: User not found!");
            }
            
            System.out.println("用户状态：isActive = " + user.getIsActive());

            // 获取用户角色信息
            String roleName = "USER";
            List<String> permissions = new ArrayList<>();
            if (user.getRoleId() != null) {
                Roles role = rolesDao.queryById(user.getRoleId());
                if (role != null && role.getRoleName() != null) {
                    roleName = role.getRoleName();
                    // 从数据库中查询角色对应的权限列表
                    permissions = getPermissionsByRoleId(user.getRoleId());
                }
            }

            // 创建包含更多信息的JWT令牌
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", roleName);
            claims.put("permissions", permissions);
            claims.put("userId", user.getId());
            String jwt = jwtUtils.generateTokenWithClaims(loginRequest.getUsername(), claims);

            // 返回包含角色和权限信息的响应
            return ResponseEntity.ok(new JwtResponse(jwt, roleName, user.getId(), user.getUsername(), permissions));
            
        } catch (Exception e) {
            System.out.println("认证失败：" + e.getMessage());
            e.printStackTrace();
            
            if (e instanceof org.springframework.security.authentication.BadCredentialsException) {
                System.out.println("用户名或密码错误");
                return ResponseEntity.status(401).body("Error: Invalid username or password");
            } else if (e instanceof org.springframework.security.core.AuthenticationException) {
                System.out.println("认证异常：" + e.getMessage());
                return ResponseEntity.status(401).body("Error: Authentication failed");
            } else {
                System.out.println("服务器错误：" + e.getMessage());
                return ResponseEntity.status(500).body("Error: Internal server error");
            }
        }
    }

    /**
     * 用户注册
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        // 检查用户名是否已存在
        if (usersDao.queryByUsername(registerRequest.getUsername()) != null) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Username is already taken!");
        }

        // 创建新用户
        Users user = new Users();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRealName(registerRequest.getRealName());
        user.setPhone(registerRequest.getPhone());
        user.setEmail(registerRequest.getEmail());
        user.setIsActive(1); // 1表示激活，0表示未激活
        // 默认设置为customer角色（根据数据库中customer角色的ID设置）
        // 从数据库中查询customer角色ID
        Roles customerRole = getRoleByName("customer");
        if (customerRole != null) {
            user.setRoleId(customerRole.getId());
        }
        usersDao.insert(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    /**
     * 获取当前用户信息
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String username = authentication.getName();
        Users user = usersDao.queryByUsername(username);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        // 获取用户角色信息
        String roleName = "USER";
        List<String> permissions = new ArrayList<>();
        if (user.getRoleId() != null) {
            Roles role = rolesDao.queryById(user.getRoleId());
            if (role != null && role.getRoleName() != null) {
                roleName = role.getRoleName();
                // 从数据库中查询角色对应的权限列表
                permissions = getPermissionsByRoleId(user.getRoleId());
            }
        }

        // 构建用户信息响应
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("realName", user.getRealName());
        userInfo.put("phone", user.getPhone());
        userInfo.put("email", user.getEmail());
        userInfo.put("role", roleName);
        userInfo.put("permissions", permissions);
        userInfo.put("isActive", user.getIsActive() == 1);

        return ResponseEntity.ok(userInfo);
    }

    // 根据角色名称获取角色
    private Roles getRoleByName(String roleName) {
        Roles roleQuery = new Roles();
        roleQuery.setRoleName(roleName);
        List<Roles> roles = rolesDao.queryAll(roleQuery);
        return roles != null && !roles.isEmpty() ? roles.get(0) : null;
    }

    // 根据角色ID从数据库中查询权限列表
    private List<String> getPermissionsByRoleId(Integer roleId) {
        List<String> permissions = new ArrayList<>();
        
        if (roleId == null) {
            return permissions;
        }
        
        // 查询角色对应的所有权限关联记录
        RolePermissions rolePermissionQuery = new RolePermissions();
        rolePermissionQuery.setRoleId(roleId);
        List<RolePermissions> rolePermissions = rolePermissionsDao.queryAll(rolePermissionQuery);
        
        // 为每个权限ID查询权限名称并添加到permissions列表中
        for (RolePermissions rp : rolePermissions) {
            if (rp.getPermissionId() != null) {
                Permissions permission = permissionsDao.queryById(rp.getPermissionId());
                if (permission != null && permission.getPermissionName() != null) {
                    permissions.add(permission.getPermissionName());
                }
            }
        }
        
        return permissions;
    }

    // 登录请求体
    static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    // 注册请求体
    static class RegisterRequest {
        private String username;
        private String password;
        private String realName;
        private String phone;
        private String email;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRealName() {
            return realName;
        }

        public void setRealName(String realName) {
            this.realName = realName;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    // JWT响应体
    static class JwtResponse {
        private String token;
        private String role;
        private Integer userId;
        private String username;
        private List<String> permissions;

        public JwtResponse(String token, String role, Integer userId, String username, List<String> permissions) {
            this.token = token;
            this.role = role;
            this.userId = userId;
            this.username = username;
            this.permissions = permissions;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public Integer getUserId() {
            return userId;
        }

        public void setUserId(Integer userId) {
            this.userId = userId;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public List<String> getPermissions() {
            return permissions;
        }

        public void setPermissions(List<String> permissions) {
            this.permissions = permissions;
        }
    }
}
