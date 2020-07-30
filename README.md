# BIT-linux-login
北京理工大学，命令行-登陆客户端，支持 linux，windows 以及 macos。主要作为 ssh 远程登录

当你成功时会返回 login-ok 200

在 config.json中填写自己的用户名以及密码

**注意代码中有一些需要你自己填写的地方写一下**

getIPv4 返回的你本机的 ip 并不能保证这个方法在你机器上能正常使用，要是不用能直接返回你自己写好的 ip 即可

例如：

``` python
getIPv4(){
  return '10.108.15.40';
}

```
还有就是 login.js中 183 行 jsonp 后面的数字，可以在 10.0.0.55 登陆一下后看一下这个数值填上（在登陆时 右击chrome->检查->network 来查看请求头中的 URL 参数中 jsonp 数值）
**这个数值修改过一次后能用很多次，失效了再修改**

运行工具为 node.js，下载最新版的 node, 进入文件夹 node login.js 即可运行
