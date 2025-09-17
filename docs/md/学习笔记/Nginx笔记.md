# Nginx 笔记

## Nginx 基础

### 下载 依赖 安装

首先我们需要访问 nginx 的官网下载该软件的压缩包，我这里选择的是 `nginx-1.19.0.tar.gz`

~~~shell
# 官网地址
https://nginx.org/download/
~~~

远程连接你的服务器后，首先要为你的 nginx 安装做准备，想要安装 nginx 需要安装一些依赖：

~~~shell
# 安装 nginx 的依赖
yum -y install pcre-devel zlib-devel
# 如果你的服务器已安装 gcc 环境，那么这步就可以省略
yum -y install gcc automake autoconf libtool make
~~~

- 这里直接通过 yum 安装依赖，比较方便快捷，但 nginx 会使用编译安装，因为方便控制版本，nginx 也可以通过 yum 直接安装，但是这样依赖版本就不能被我们自己掌控了



环境到这里就准备完毕了，接下来准备安装 nginx，将之前下载好的压缩文件上传至服务器中，然后解压，上传步骤这里就不赘述了，直接开始解压安装

~~~shell
# 移动目录至local下
cd /usr/local
# 解压上传的压缩文件
tar -zxvf nginx-1.19.0.tar.gz
# 移动目录到解压好的文件中
cd nginx-1.19.0
~~~

> 接下来准备编译安装，注意这些步骤都是在解压好的目录中执行
>
> 如果提示找不到 make 命令，就是 gcc 没有安装，上面有安装命令

~~~shell
# 检查压缩包，生成Makefile文件
./configure
# 然后开始执行安装方法
make && make install
~~~

执行到这里，安装也完成了，接下来就是运行 nginx，当前是在解压好的目录中，首先返回上一级，这时你会发现，目录中多了一个 nginx 的文件夹，这就是安装后的目录，至此 nginx 就算安装完成了

> 在安装好的 nginx 目录中有一个 sbin 目录，在这里面就可以启动 nginx 服务，启动好后就可以通过 ip 地址直接访问了，nginx 默认是 80 端口。

~~~shell
# 进入sbin目录
cd nginx/sbin
# 启动 nginx
./nginx
~~~



### 配置环境变量

老规矩，将目录移动到 etc，使用 vim 编辑 profile 文件，在文件尾部追加以下代码：

~~~shell
export NGINX_HOME=/usr/local/nginx
export PATH=$PATH:$NGINX_HOME/sbin
~~~

然后刷新配置文件，就可以在任何地方都可以调用 nginx 命令了



### Nginx 常用命令

上面简单的启动了 nginx，这里就介绍一下 nginx 常用的几个命令：

~~~shell
# 启动 nginx 服务
nginx

# 关闭 nginx 服务
nginx -s stop

# 查看当前 nginx 服务是否运行
ps -ef | grep nginx

# 查看 nginx 版本
nginx -v

# 重新载入配置
nginx -s reload
~~~



## 反向代理

> 什么是反向代理

反向代理技术是 nginx 的特点之一，跟名字一样，代理模式是将客户端的所有请求都通过代理发出，而反向代理是客户端并不知道自己被代理的情况下完成了请求。

反向代理是服务器和 nginx 之间完成的任务，正常是客户端直接访问服务端，但是有了 nginx 反向代理后，在服务端你的请求会先被 nginx 接受，然后在重新请求一个新的地址，所做的一切都是服务端完成的。所以说客户端并不知道自己被代理了。



> 如何使用反向代理

在 nginx 的安装目录下，有一个 `conf` 目录，改目录下的 `nginx.conf` 配置文件中的 http 模块下，可以通过 server 设置反向代理，他的标准写法是这个样子的：

~~~
server {
	listen       80;
	server_name  www.baidu.com;
	location / {
	    proxy_pass http://www.baidu.com;
	    index index.html index.htm index.jsp default.html default.htm default.jsp
	}
}
~~~

- server 表示一个监听的目标
  - listen [ 监听条件1 ] 可以是端口号，可以是 ip 地址，也可以是 ip 地址+端口号，也可以使用通配符 *
  - server_name [ 监听条件2 ] 可以是一个域名，也可以是多个域名 ( 逗号分隔 )，也可以使用通配符 * 
  - location [ 监听条件3 ] 后面跟着一个空格，接着是一个url，例如 /blog/，/shop/ 等等区分项目路径，可以使用通配符，也可以使用正则表达式
    - proxy_pass [ 目标地址 ]  符合监听条件后跳转的目标地址
    - index [ 默认首页 ] 跳转的目标项目路径，可以通过这里设置默认首页，一般不常用

- 关于配置具体参考网站:  `https://www.cnblogs.com/ysocean/p/9392908.html`

在配置文件中可以有多个 server 出现，nginx 会从上到下依次监听，当符合某一个的时候就不会继续往下走。



> 反向代理可以干些什么

我购买了一个服务器，并且已经绑定域名，但是我如果想要访问我的项目，必须要将项目放在 80 端口下才可以直接访问，否则还需要手动指定端口号，这个时候我就可以通过反向代理来配置，例如

blog.hanzhe.club -> 访问博客网站 ( 博客网站在本地的8081端口 )

~~~
server {
	listen       localhost:80;
	server_name  blog.hanzhe.club;
	location / {
	    proxy_pass http://localhost:8081/;
	}
}
~~~

zhang.hanzhe.club -> 访问个人网站 ( 个人网站在本地的8082端口 )

~~~
server {
	listen       localhost:80;
	server_name  zhang.hanzhe.club;
	location / {
	    proxy_pass http://localhost:8082/;
	}
}
~~~

这样一来，当我访问 blog.hanzhe.club 的时候，访问的是博客网站，访问 zhang.hanzhe.club 的时候访问的是个人网站，都是 80 端口，但是对应本地确实两个不一样的端口



## 负载均衡

### 负载均衡的实现

> 什么是负载均衡

反向代理技术是 nginx 的特点之一，那么 `负载均衡` 就是第二大特点，什么是负载均衡？顾名思义，负载均衡就是讲服务器接收的请求分散开来，从而达到减缓服务器压力的一门技术

既然将请求分散开来，那么就肯定还要有服务器来接受这些分散出去的请求，所以就需要多台服务器进行配合，按照要求轮流来负责处理请求，那么将这些请求合理的分发出去的技术就叫做 负载均衡



> 实现负载均衡

还是老位置，nginx 的安装目录下的 conf 目录下的 nginx.conf 配置文件中使用 upstream 来完成负载均衡

upstream 后面跟着标识符作为名称，然后下面可书写 n 多个 server 指向目标地址

~~~shell
upstream blog {
	server 127.0.0.1:8080;
	server 127.0.0.1:8081;
	server 127.0.0.1:8082;
}
~~~

这里匹配到 blog.hanzhe.com:80 域名之后，直接移交给上面 blog 对应的负载均衡进行处理，会按照特定的规则来分发请求。

~~~
server {
	listen      80;
	server_name blog.hanzhe.com;
	location / {
		proxy_pass  http://blog;
	}
}
~~~



### 集中方式说明

在上面提到了负载均衡会按照特定的规则来向各个服务器中分发请求，那么这个规则究竟是什么，现在就来简单了解一下。

> 1 - 轮询规则

轮询规则是 nginx 默认的负载规则，当我们书写的格式像上面的代码一样，没有多余的修饰，那么他默认就是轮询规则

轮询规则，顾名思义，就是所有请求都按照时间顺序分发到不同的服务器上，期间如果有服务器突然死机，那么就会被踢出轮询队伍中。

> 2 - 权重规则 ( weight )

轮询规则是按照时间来依次分发请求的，而权重规则是按照服务器的权重比例来进行请求分发的。

~~~shell
# 实例配置
upstream blog {
	server  localhost:8080 weight=2;
	server  localhost:8081 weight=6;
	server  localhost:8082 weight=3;
}
~~~

在目标服务器地址后面跟上空格，追加 `weight` 关键字就可以设置权重比例了，对应的数字越大，被访问的频率也就越高，例如上面的配置，如果访问量较高的话，8080 和 8082 两个端口加一起的访问量可能还没有一个 8081 多，可以让高性能服务器拿到较高的值，适合多个服务器配置不一致时起到的均衡作用，这就是权重规则。

> 3 - 哈希规则 ( ip_hash )

该规则会根据客户端的 ip 地址进行 hash 计算后的结果进行分类，这样的好处是可以让客户端自始至终访问的都是同一台服务器，可以解决 session 的问题。

配置方法也十分简单，在 upstream 中添加关键字即可。

~~~shell
# 实例配置
upstream blog {
	ip_hash;
	server  localhost:8080;
	....
}
~~~

- ip_hash 还可以配合 weight 权重一起使用。

> 4 - 最少规则 ( least_conn )

看名字就可以轻松的看出来，该规则的特点就是将请求交给连接数最少的服务器进行处理，也就是所谓的均摊。

代码就不粘了，使用方法同上面一致，将关键字敲上即可。

> 5 - 延迟规则 ( fair )

按照服务器的响应时间来分配，两台服务器等待的情况下，延迟低的服务器优先分配，使用方法同上

<hr />
<font color="red">这里需要注意的一点是，无论是 server 还是 upstream 都是在 http 模块下的，而且 upstream 要在 server 的前面，不然不起作用</font>



## 动静分离

目前我所需要的技术只有上面那些，后续带日后更新



## 高可用