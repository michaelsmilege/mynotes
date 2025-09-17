# CentOS8 部署服务器环境

## 远程连接服务器

连接服务器使用的是 xshell 工具，百度下载即可

如果你的服务器是购买的 ( 例如阿里 )，需要去你服务器的安全组进行端口放行才可以使用，详情百度，我这里是新建的 centos 8 的虚拟机，通过虚拟机模拟真实的服务器，想要连接虚拟机需要使用指定命令获取 ip 地址



### 获取 IP 地址

( 已购买服务器用户可以跳过，可以看看如何设置安全组开放端口 )

因为购买服务器会给一条外网 ip 地址，但虚拟机创建是不会告诉你 ip 地址的，所以需要自己手动运行虚拟机进行获取，使用命令 `ifconfig`

~~~bash
[root@192 ~]# ifconfig
ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.0.105  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::a234:dff6:40db:cb50  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:5f:11:17  txqueuelen 1000  (Ethernet)
        RX packets 17256  bytes 20130010 (19.1 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 4184  bytes 360390 (351.9 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 52  bytes 4320 (4.2 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 52  bytes 4320 (4.2 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

virbr0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet 192.168.122.1  netmask 255.255.255.0  broadcast 192.168.122.255
        ether 52:54:00:da:e0:e9  txqueuelen 1000  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
~~~

这里可以看到，我使用了 `ifconfig` 命令后，下面列出了三个 ip 地址，分别是 `192.168.0.105`，`127.0.0.1`，`192.168.122.1`，筛选后得出我的 ip 地址为 `192.168.0.105`

双击打开 shell，依次点击【文件】【新建】，然后在弹出的页面左侧选择【连接】，右侧填写服务器信息即可

![image.png](https://wx1.sbimg.cn/2020/05/24/image.png)

点击确定后，左侧就会出现你刚刚新建的回话，双击连接，输入用户名和密码就可以操作服务器了，建议用 root 用户登录防止出现权限问题等等。

> CentOS 7 注意事项

如果使用的是 centos7 的话查看 ip 地址的命令为 `ip addr`，结果如下所示：

```
#ip addr
1: lnk/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: enp2s1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether 00:17:08:49:9d:c5 brd ff:ff:ff:ff:ff:ff
```

2: 后面跟着的 `ens33` 就是网卡名称，我们可以通过 `ifup ens33` 来开启网卡，就可以访问网络，但是每次开机都需要手动开启网卡比较麻烦，所以我们需要设置网卡开机自启：

在 centos7 的`/etc/sysconfig/network-scripts` 目录下，有一个 `ifcfg-网卡名称` 的文件，使用 vim 打开该文件将 `ONBOOT=no` 改为 `yes`，网卡就可以开机自启动了

 

### 防火墙设置

如果 IP 地址输入正确，用户名密码也没问题，但还是连不上，那么可能就是防火墙给拦截了，打开虚拟机修改防火墙配置

> CentOS 操作防火墙常用命令

~~~shell
# 查看防火墙状态，running是运行中，not running是停止中
firewall-cmd --state

# 打开防火墙
systemctl start firewalld.service

# 关闭防火墙
systemctl stop firewalld.service

# 查看所有开放的端口-ports
firewall-cmd --list-all

# 查询指定端口开放状态 yes开启，no关闭
firewall-cmd --query-port=22/tcp

# 开放/关闭 指定端口 -- premanent代表永远生效，如果不携带该参数则仅本次有效
firewall-cmd --add-port=22/tcp --permanent
firewall-cmd --remove-port=22/tcp --permanent

# 重启防火墙服务 -- 端口状态修改后重启生效
firewall-cmd --reload
~~~

了解了以上命令后，就可以将端口开放了，这里只开放 22 剩下随用随开即可。

~~~shell
firewall-cmd --add-port=22/tcp --permanent
firewall-cmd --reload
~~~



## 部署 JDK 8

百度 Oracle 下载 jdk8 Linux 版本，在 Oracle 官网针对 Linux 版本的 jdk 提供了四种文件包，除了咱们熟悉的 x86 和 x64 之外，还有 rpm 和 tar.gz 的文件，这里我选择了 tar.gz 压缩文件进行安装配置

首先将 tar.gz 文件下载到本地，然后在下载另一个远程操作软件 xftp，它的功能类似 xshell，不过 xshell 是用来模拟终端的，而 xftp 是用来传输文件的，下载好 xftp 后双击打开

依次按照顺序点击左上角的【文件】【新建】，填写信息于 xshell 基本一致，协议的位置选择 `SFTP` ，然后在下面将用户名和密码直接填入即可

![image97ca57ed5735ee1b.png](https://wx1.sbimg.cn/2020/05/24/image97ca57ed5735ee1b.png)

然后连接服务器，将之前下载好的 tar.gz 文件拖拽到服务器 ( 右侧窗口 ) 上传至如下目录，然后解压

~~~shell
# 文件上传目录
/usr/local
~~~

- 这里补充一个小技巧，如果 xftp 显示中文文件名乱码的话，按照如下顺序走一遍即可
  - 选中当前连接【文件】【属性】上方选项卡【选项】勾选【使用 UTF-8 编码】| 完成



> Xshell 下操作

~~~shell
# 移动位置到当前目录
cd /usr/local
# 解压文件
tar -zxvf jdk-8u181-linux-x64.tar.gz
# 将文件重命名为简单的名称
mv jdk1.8.0_181 jdk8
# 删除掉无用的 tar.gz 文件
rm -rf jdk-8u181-linux-x64.tar.gz
~~~

截止到目前，Java 已经安装完毕了，这个没有安装过程，解压他的过程就是安装，接下来是配置环境变量，切换目录到 `etc` 下使用 xshell 操作

~~~shell
# 切换目录
cd /etc
# 使用vim编辑器编辑配置文件，增加环境变量
vim profile
~~~

输入以上命令后，就会看到配置文件的详细信息，翻到文件最底部敲击字母 i，下方会提示插入模式，然后在最底下编写代码，添加 jdk 的环境变量，代码如下：

~~~ts
export JAVA_HOME=/usr/local/jdk8
export PATH=$PATH:$JAVA_HOME/bin
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export JRE_HOME=$JAVA_HOME/jre
~~~

- 需要注意的是在输入 jdk8 的时候，小键盘数字键是不能用的

编写完成后，敲击键盘左上角的 `esc` 退出编辑模式，此时你处于命令模式，然后敲击 `:wq` ( 保存并退出 ) 然后回车即可。配置文件就搞定了，然后输入命令刷新环境变量

~~~shell
# 更新资源文件
source profile
~~~

接下来就像在 Windows 中一样输入 `javac`，`java`，`java -version` 来测试 jdk 有没有安装成功吧



> -- 补充

当我们在 Windows 中将打包好的 springboot 的 jar 包放在 centos 中运行的时候，会发现他启动的特别慢，这个时候我们就需要更改一些配置

~~~shell
# 编辑JDK下的指定文件
vim /usr/local/jdk8/jre/lib/security/java.security
# 修改 securerandom.source 的值为如下所示
securerandom.source=file:/dev/urandom
~~~





## 部署 Tomcat 8.5

安装 tomcat 同 jdk 一样，首先是去官网下载指定版本的 tomcat 的压缩包，然后上传至服务器等等操作

> tomcat 8.5 下载地址，记着选择 tar.gz 的 Linux 版本

~~~
https://tomcat.apache.org/download-80.cgi
~~~

下载完成后，使用 XFTP 工具将压缩包上传至服务器的 `/usr/local` 目录下，然后在 xshell  中操作

~~~shell
# 解压tomcat包
tar -zxvf apache-tomcat-8.5.55.tar.gz
~~~

解压之后就已经算是安装完成了，可以 cd 到 tomcat 目录下，执行命令检查是否安装成功

~~~shell
# 启动tomcat服务
startup.sh
# 关闭tomcat服务
shutdown.sh
~~~

启动后通过 ip 地址 + 8080 端口号是可以访问到网站的，如果访问失败可以尝试开放防火墙 8080 端口

~~~shell
firewall-cmd --zone=public --add-port=8080/tcp --permanent
firewall-cmd --reload
~~~



> 环境变量配置

~~~shell
cd /etc
vim profile
# 在insert模式下追加段代码
export CATALINA_HOME=/usr/local/tomcat/apache-tomcat-8.5.31
export PATH=$PATH:$CATALINA_HOME/bin
# 然后保存刷新即可
source profile
~~~





## 部署 MySQL

### 下载及安装

之前的环境都是下载好然后进行离线安装的，不过这次的 mysql 的安装是需要联网的，研究了一下午离线安装没有成功...妥协了 ( >_< )，毕竟我也是第一次

首先去 mysql 官网下载安装所需要的 rpm 包，官网直连地址：

> 我安装的是 5.7.30 下的 Red Hat 下的 Linux 7，在下面选择第一个 RPM Bundle 下载到本地即可。

~~~
https://dev.mysql.com/downloads/mysql/
~~~

下载完成后远程连接你的 服务器 / 虚拟机，cd 至 `usr/local/` 目录下新建一个文件夹，将你下载好的文件上传到新建文件夹中，然后开始解压，命令如下

> 因为他没有给文件包一层目录，所以这里我选择了新建一个文件夹，这样解压后文件就不会乱

~~~shell
# 新建文件夹
mkdir /usr/local/abc
# 移动到目标文件夹
cd /usr/local/abc
# 上传文件后，进行解压
tar -xvf mysql-5.7.30-1.el7.x86_64.rpm-bundle.tar
~~~

<hr />
> 接下来准备安装环境，依次运行以下命令安装依赖

~~~shell
# 安装三个依赖
yum -y install libaio perl net-tools
~~~

~~~shell
# 依赖检测失败：libncurses.so.5()(64bit) 被 ... 需要
# 这个可以先不执行，等安装报错在安装也可以
dnf install ncurses-compat-libs
~~~

~~~shell
# 检查系统是否自带了mariadb，如有就卸载，会影响安装
rpm -qa|grep mariadb
# 卸载命令
rpm -e --nodeps mariadb-libs-5.5.56-2.el7.x86_64
~~~


> 依赖安装完成后，在解压好的目录下，开始安装 rpm 包：

~~~shell
rpm -ivh mysql-community-common-5.7.30-1.el7.x86_64.rpm
rpm -ivh mysql-community-libs-5.7.30-1.el7.x86_64.rpm
rpm -ivh mysql-community-client-5.7.30-1.el7.x86_64.rpm
rpm -ivh mysql-community-server-5.7.30-1.el7.x86_64.rpm
~~~

依次安装完成后启动 mysql 服务，检测是否安装成功，如果提示 avive (running) 即为安装成功

~~~shell
# 启动mysql服务
service mysqld start
# 检查mysql启动状态
service mysqld status
# 如果提示 avive (running) 即为安装成功
[root@localhost mysql-cache]# service mysqld start
Redirecting to /bin/systemctl start mysqld.service
[root@localhost mysql-cache]# service mysqld status
Redirecting to /bin/systemctl status mysqld.service
● mysqld.service - MySQL Server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; enabled; vendor preset: disabled)
   Active: active (running) since Wed 2020-06-03 02:03:49 CST; 5s ago
     Docs: man:mysqld(8)
           http://dev.mysql.com/doc/refman/en/using-systemd.html
  Process: 14149 ExecStart=/usr/sbin/mysqld --daemonize --pid-file=/var/run/mysqld/mysqld.pid $M>
  Process: 14123 ExecStartPre=/usr/bin/mysqld_pre_systemd (code=exited, status=0/SUCCESS)
 Main PID: 14152 (mysqld)
    Tasks: 27 (limit: 11362)
   Memory: 248.5M
   CGroup: /system.slice/mysqld.service
           └─14152 /usr/sbin/mysqld --daemonize --pid-file=/var/run/mysqld/mysqld.pid
~~~

> centos 下对 mysql 服务的操作命令 ( 其实在 linux 中，服务不叫服务，叫做守护进程 )：

~~~shell
# 启动 mysql 服务
service mysqld start
# 关闭 mysql 服务
service mysqld stop
# 重启 mysql 服务
service mysqld restart
~~~



### 配置 MySQL

在上面我们已经成功的安装了 mysql 5.7.30，接下来只需要进行一些后续的处理，这个 mysql 数据库就可以正常使用了。

> 修改配置文件

由 rpm 命令安装的 mysql，他的配置文件位于 `/etc/my.cnf` 处，在尾部加上这样两句命令：

~~~shell
## 个人配置，可选择性跳过 ##

# 关闭密码安全策略验证
validate-password=OFF
# 关闭表名区分大小写 0为区分，1为不区分
lower_case_table_names=1
# 设置字符集
character-set-server=utf8
~~~

- 注：每次修改完配置文件后都要重启服务才能生效

> 设置 root 密码

想要设置 root 密码，首先要先登录 mysql 数据库，但是没有密码怎么登录？其实在我们安装 mysql 的时候已经为我们生成了一个临时的密码，查看密码的命令如下：

~~~shell
# 最后的一串像乱码一样的东西就是临时密码
# 或者使用 cat /var/log/mysqld.log 命令看前几行第一个 [Note] 的位置
grep password /var/log/mysqld.log

#2020-06-02T20:37:30.623479Z 1 [Note] A temporary password is generated for root@localhost: ,mhLlwzx>5g!
~~~

使用这个临时的密码登录 mysql 的 root 用户后，第一件事儿就是修改他的密码，命令如下：

~~~sql
-- 如果你之前没有取消密码安全策略，那么这里就要想一个绝妙的密码
mysql> set password = password("你的密码");
~~~

密码修改完成后，你就可以正常使用你的数据库啦，但是还有点收尾工作要做 ↓ ↓ ↓

> 开放防火墙 3306 端口，配置远程连接数据库

现在的数据库仅仅在本地能够正常使用，但是如果想要在自己的电脑上远程操作数据库，还需要进行一些配置

~~~shell
# 开放防火墙 3306 端口
firewall-cmd --add-port=3306/tcp --permanent
# 重启防火墙服务
firewall-cmd --reload
~~~

开放 3306 端口后，你会发现还是不能远程访问你的数据库，因为你还需要最后一步：

~~~sql
-- 进入mysql中执行以下命令 ( 在这里也是需要验证密码安全策略的 )
mysql> GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '你的密码' WITH GRANT OPTION;
~~~

至此！mysql 算是安装配置完成了，当然这个很简陋，真实服务器环境上配置的数据库比这个还要复杂，涉及到用户组和权限管理的问题，但是我这里只是练习用，就不写那么多了。



## 部署 Redis

> redis 的下载

首先要去 redis 的官网下载他的压缩包，官网 [ 中文 ] 直连地址如下：

~~~
http://www.redis.cn/
~~~

进入官网后直接下载即可，然后远程连接 服务器/虚拟机 将下载好的文件上传至 `/usr/local` 目录下

~~~shell
# 进入到usr/local目录
cd /usr/local
# 上传文件后，执行解压命令
tar -zxvf redis-5.0.5.tar.gz
~~~

> redis 的安装

在执行安装命令之前，首选需要安装 gcc 的依赖，如已安装请忽略

~~~shell
yum -y install gcc
~~~

然后切换到 redis 目录下开始执行安装命令

~~~shell
# 切换目录到redis下
cd redis-5.0.5
# 执行安装命令
make && make install
~~~

这样一来，安装就顺利结束了，如果提示 -bash: make: command not found 则代表 gcc 没有装，需要重新安装 gcc 环境

> redis 的配置

实际上这个时候 redis 已经可以正常运行了，但是直接执行运行的是默认的配置，我们需要有一套自己的配置，所以这个时候我们需要修改一下配置文件，这里建议复制一个作为备份，然后在修改

~~~shell
# 新建目录并进入
mkdir my_config
cd my_config
# 复制配置文件
cp ../redis.conf redis.conf
# 编辑配置文件信息
vim redis.conf
~~~

在配置文件中修改以下两行即可：

~~~shell
# 注释掉bind，取消访问redis的ip地址限制，否则只有本机才能访问
# bind 127.0.0.1
# 修改为 yes，可以后台运行redis，否则会锁定命令行
daemonize yes
~~~

> 运行 redis 并创建连接

好了，redis 的安装基本完成了，而且我们也有了属于自己的配置文件，接下来让我们来运行一下 redis，在运行 redis 之前，我们需要知道，redis 有两个可以启动的程序，一个是服务端，一个是客户端

首先我们来运行服务端 `redis-sever`

~~~bash
# 如果直接输入则使用默认配置
redis-server
# 可以在后面追加配置文件名称，让他按照指定的配置启动，这里就让他以咱自定义的配置启动
redis-server redis.conf
~~~

接下来让我们启动客户端 `redis-cli`

~~~shell
# 如果直接输入则默认连接本地的6379端口
redis-cli
# 也可以通过参数来指定目标IP地址或端口号
redis-cli -h 127.0.0.1 -p 6379
~~~

尝试输入一个 ping 命令，测试服务是否正常工作，如果返回 PONG 就证明一切正常

~~~shell
127.0.0.1:6379> ping
PONG
~~~

> 关闭 redis

如果不时用任何配置让他默认启动的话，直接 Ctrl + C 就可以关闭 redis，那么后台运行应该怎么关？

~~~bash
# 连接到指定的服务后，执行关闭命令即可
redis-cli
shutdown
# 也可以直接关闭，或者指定IP,端口关闭
redis-cli shutdown
~~~