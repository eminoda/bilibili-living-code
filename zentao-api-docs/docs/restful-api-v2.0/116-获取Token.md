# 获取Token

> 来源：[https://www.zentao.net/book/api/post-users-login-2142.html](https://www.zentao.net/book/api/post-users-login-2142.html)  
> 下载时间：2026-10-02 23:29:28 +08:00

### 本篇目录

- 获取Token 
- 请求URL
- 请求体
- 请求示例
- 请求响应
- 响应示例

POST

/users/login

## 获取Token 

### 请求URL

https://xxx.com/api.php/v2/users/login
### 请求体

名称 类型 必填 描述

account string 是 用户名 
password string 是 密码
### 请求示例

```text
{
 "account": "admin",
 "password": "123Qwe!@#"
}
```

### 请求响应

名称 类型 描述

status string 状态(success 成功 | fail 失败) 
token string API凭证 
token string API凭证
### 响应示例

```text
{
 "status": "success",
 "token": "llb8ocefb0kbgklif53j839k6l"
}
```

