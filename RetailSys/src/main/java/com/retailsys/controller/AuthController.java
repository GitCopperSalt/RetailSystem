package com.retailsys.controller;

import com.retailsys.auth.UserDetailsServiceImpl;
import com.retailsys.config.JwtUtils;
import com.retailsys.dao.RolesDao;
import com.retailsys.dao.UsersDao;
import com.retailsys.entity.Roles;
import com.retailsys.entity.Users;

import java.util.List;

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
    PasswordEncoder passwordEncoder;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(loginRequest.getUsername());

        // 获取用户实际角色信息
        Users user = usersDao.queryByUsername(loginRequest.getUsername());
        String roleName = "USER";
        if (user != null && user.getRoleId() != null) {
            Roles role = rolesDao.queryById(user.getRoleId());
            if (role != null && role.getRoleName() != null) {
                roleName = role.getRoleName();
            }
        }

        // 返回包含角色信息的响应
        return ResponseEntity.ok(new JwtResponse(jwt, roleName, user.getId(), user.getUsername()));
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

    // 根据角色名称获取角色
    private Roles getRoleByName(String roleName) {
        Roles roleQuery = new Roles();
        roleQuery.setRoleName(roleName);
        List<Roles> roles = rolesDao.queryAll(roleQuery);
        return roles != null && !roles.isEmpty() ? roles.get(0) : null;
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

        public JwtResponse(String token, String role, Integer userId, String username) {
            this.token = token;
            this.role = role;
            this.userId = userId;
            this.username = username;
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
    }
}
