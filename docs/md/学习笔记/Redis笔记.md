# Redis 笔记

redis 是一款 NoSQL 数据库，是最常见的一款非关系型数据库，主要使用 key - value 的形式存储数据，和 mysql 不同，redis 并不会直接把数据存储到硬盘中，而是存储在内存中，也正是这样的设定让 redis 的存取操作特别的快。

## Redis 的下载及安装

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

实际上这个时候 redis 已经可以正常运行了，运行 redis 的命令为 `redis-server`，但是当我们运行的时候会发现，redis 直接将窗口锁定了，我们不能进行任何的操作，一旦解锁也就意味着 redis 停止工作了

~~~bash
19196:C 15 Jun 2020 22:13:31.574 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
19196:C 15 Jun 2020 22:13:31.574 # Redis version=5.0.8, bits=64, commit=0000
0000, modified=0, pid=19196, just started
19196:C 15 Jun 2020 22:13:31.574 # Warning: no config file specified, using the default config. In order to specify a config file use redis-server /path/to/redis.conf
                _._                                                  
           _.-``__ ''-._                                             
      _.-``    `.  `_.  ''-._           Redis 5.0.8 (00000000/0) 64 bit
  .-`` .-```.  ```\/    _.,_ ''-._                                   
 (    '      ,       .-`  | `,    )     Running in standalone mode
 |`-._`-...-` __...-.``-._|'` _.-'|     Port: 6379
 |    `-._   `._    /     _.-'    |     PID: 19196
  `-._    `-._  `-./  _.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |           http://redis.io        
  `-._    `-._`-.__.-'_.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |                                  
  `-._    `-._`-.__.-'_.-'    _.-'                                   
      `-._    `-.__.-'    _.-'                                       
          `-._        _.-'                                           
              `-.__.-'                                               

19196:M 15 Jun 2020 22:13:31.575 # WARNING: The TCP backlog setting of 511 cannot be enforced because /proc/sys/net/core/somaxconn is set to the lower value of 128.
19196:M 15 Jun 2020 22:13:31.575 # Server initialized
..................
~~~

这时我们需要对配置文件做一些手脚

~~~shell
## 建议弄个备份，玩儿备份就好，redis 的配置文件还是很重要的
# 复制配置文件
cp redis.conf /root/redis.conf
cd /root
# 编辑配置文件信息
vim redis.conf
# 修改为daemonize为yes，可以后台运行 redis，否则会锁定命令行
daemonize yes
~~~

> 运行 redis 并创建连接

首先我们来运行服务端 `redis-sever`，需要注意的是这里要指定配置文件进行启动，否则还是会以默认配置执行，还是会锁定当前窗口

~~~bash
# 默认执行，会锁定窗口
redis-server
# 指定配置文件执行，咱们配置了后台运行，不会锁定窗口
redis-server redis.conf
## 出现下面这堆东西就代表执行成功了 ##
19203:C 15 Jun 2020 22:15:09.851 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
19203:C 15 Jun 2020 22:15:09.851 # Redis version=5.0.8, bits=64, commit=00000000, modified=0, pid=19203, just started
19203:C 15 Jun 2020 22:15:09.851 # Configuration loaded
~~~

接下来让我们启动客户端 `redis-cli`

~~~shell
# 如果直接输入则默认连接本地的6379端口
redis-cli
127.0.0.1:6379>
# 也可以通过参数来指定目标IP地址或端口号
redis-cli -h 127.0.0.1 -p 6379
127.0.0.1:6379>
~~~

尝试输入一个 ping 命令，测试服务是否正常工作，如果返回 PONG 就证明一切正常

~~~shell
127.0.0.1:6379> PING
PONG
~~~

> 关闭 redis

如果不时用任何配置让他默认启动的话，直接 Ctrl + C 就可以关闭 redis，那么后台运行应该怎么关？

~~~bash
# 连接到指定的服务后，执行关闭命令即可
127.0.0.1:6379> shutdown
# 也可以在创建连接之前直接关闭，支持远程关闭
redis-cli shutdown
~~~



## 设置访问密码

我们刚刚成功连接到了 redis 服务器，但是这仅仅是本地的，我们目前并不能够远程 ip 地址直接访问，因为我们的 redis 默认开启了保护模式，将来我们的项目是要跑在网络上要用 java 代码操作的，想要远程连接必须要先设置密码！

> 临时设置密码

为了可以远程操作，我们可以设置一个临时的密码，连接上 redis 客户端，命令如下：

~~~bash
# 设置密码
127.0.0.1:6379> config set requirepass 123456
OK
# 设置密码是实时的，需要登录才可以进行操作
127.0.0.1:6379> keys *
(error) NOAUTH Authentication required.
# 验证redis密码
127.0.0.1:6379> auth 123456
OK
# 获取密码
127.0.0.1:6379> config get requirepass
1) "requirepass"
2) "zhang"
# 取消之前设置的密码，留空即可
127.0.0.1:6379> config set requirepass ''
OK
~~~

这样一个临时的密码就设置成功了，只要 redis 始终保持正常运行，秘密是不会失效的

> 设置永久性密码

如果觉得临时密码并不能够满足你的安全感，那么可以通过修改配置文件来设置密码：

~~~bash
# 在redis.conf中找到requirepass然后在后面追加密码，重启redis即可
requirepass 你的密码
~~~



## 配置文件讲解

学习 redis 最好是跟着官方文档走，记笔记只是为了让自己更加熟练，推荐 redis 中文网：

~~~
https://www.redis.net.cn/order/
~~~

刚刚在安装 redis 的时候简单修改了一下 daemonize 属性的值，让他可以不锁定当前命令行且后台运行，redis 有很多需要了解的常规性配置，这里大概记个笔记：

redis 的配置文件中注释非常多，官方很友好的将模块划分开来，这里就记几个我个人觉得常用的配置

> ######################## NETWORK ######################## 网络

~~~bash
#### 绑定客户端IP
# 如果需要远程连接redis的话，要么在这里添加你的IP地址，要么将这句话注释掉
# 注释掉之后，所有的IP就都可以访问了
bind 127.0.0.1
~~~

~~~bash
#### 保护模式
# redis没有设置访问密码的情况下，如果开启了保护模式就不能远程连接了
protected-mode yes
~~~

~~~bash
#### 启动端口号，不多赘述
port 6379
~~~

~~~bash
#### 客户端超时时间/s
# 当客户端连接服务端的时候，超出 n 秒没有任何操作就自动切断连接
# 设置为 0 代表无超时时间
timeout 0
~~~

>######################## GENERAL ######################## 常用

~~~bash
#### 守护进程
# 这个就是之前设置的后台运行
# 守护进程就是Windows系统中的服务，将redis以服务的形式运行
daemonize yes
~~~

~~~bash
#### PID文件
# 如果开启了守护进程后台运行redis，那么这个就一定要有
pidfile /var/run/redis_6379.pid
~~~

~~~bash
#### 日志级别
# 记录执行日志时可选择的记录级别，选项分别有：
# debug，verbose，notice，warning，具体描述配置文件中有，一般不用设置这个
loglevel notice
~~~

~~~bash
#### 日志文件名称
logfile ""
~~~

~~~bash
#### 默认数据库个数
# 可以在这里手动对数据库数量进行设置，我就改成5个啦，闲的没事儿
databases 16
~~~

> ######################## SECURITY ######################## 安全

~~~bash
#### 密码
# 安全中最常用的就是密码设置了，访问数据库必须要密码，不然就乱套了
# 默认是注释的，也就是没有密码
requirepass foobared
~~~



## Redis 基础命令

redis 中也有库的概念，初始数量为 16 个，可以在配置文件中进行修改，他是按照从 0 开始的递增顺序命名的，和 mysql 不同，redis 不支持为某个数据库单独命名，也不支持为每个数据库设置单独的访问密码，默认我们启动 redis 时使用的是第 0 个数据库。

==切换数据库==应该怎么操作呢？只需要执行 select 命令

~~~bash
# 当我们使用select切换到其他数据库的时候，端口号后面会提示当前使用数据库 [1]，默认库就不会提示
127.0.0.1:6379> select 1
OK
127.0.0.1:6379[1]>
~~~

在我们学习 mysql 的时候，需要通过使用 sql 语句对数据进行 CRUD，而在 redis 我们需要记的是命令

> 验证登录密码

~~~bash
127.0.0.1:6379> auth 123456
OK
~~~

> 数据的简单 CRUD

~~~bash
# set命令，因为key是唯一的，所以set既是添加，也是修改，如果有空格需要用双引号引起来
127.0.0.1:6379> set user zhang
OK
# get命令，就是查询喽
127.0.0.1:6379> get user
"zhang"
# del命令，就是删除喽
127.0.0.1:6379> del user
(integer) 1
# 删除之后查不到了
127.0.0.1:6379> get user
(nil)
~~~


> 查看当前库数据总计数

~~~bash
127.0.0.1:6379[1]> dbsize
(integer) 4
~~~

> 查看当前库所有的 key，* 代表通配符

~~~bash
127.0.0.1:6379[1]> keys *
1) "user"
2) "sex"
3) "name"
4) "age"
~~~

> 清空当前数据库

~~~bash
127.0.0.1:6379[1]> flushdb
OK
~~~

> 清空所有数据库

~~~bash
127.0.0.1:6379> flushall
OK
~~~

> 查看当前库是否存在该 key，只要不返回 0 就代表存在，exists 是否存在

~~~bash
127.0.0.1:6379> exists name
(integer) 1
~~~

> 将当前库的数据移动到其他库 move 移动，name 为 key，1 为目标数据库

~~~bash
127.0.0.1:6379> move name 1
(integer) 1
~~~

> 设置消亡时间 ( 过期时间 )，expire 单位/秒，ttl 查询

~~~bash
# 设置user
127.0.0.1:6379> set user zhanghanzhe
OK
# 设置user的消亡时间为10秒
127.0.0.1:6379> expire user 10
(integer) 1
# 一开始的时候还是可以获取的 
127.0.0.1:6379> get user
"zhanghanzhe"
# 查询过期时间，还剩3秒
127.0.0.1:6379> tll user
(integer) 3
# 这会变-2了
127.0.0.1:6379> tll user
(integer) -2
# 获取不到了
127.0.0.1:6379> get user
(nil)
~~~

> 查看 key 的数据类型

~~~
127.0.0.1:6379> type name
string
~~~



## 五大基本类型

在上面我们介绍了最后一个命令，是一个 `type` 命令，使用它可以查看指定 key 的数据类型，这里接触了一个新的知识，就是数据类型，redis 中有有多少数据类型呢？

### String 字符串

string 就是字符串啦，我们使用简单的 set 命令设置的数据，如果没有指定，默认就是 string 类型的，就像 java 的 api 一样，string 类型有自己专属的命令

*string 类型的命令大多是都是以 str 开头的*

字符串操作就是之前学习的 get set 命令，就不多赘述了


>组合命令 返回并修改

~~~bash
# 组合命令，修改新的value同时返回修改前的value
getset name hanzhe
~~~

> 数据的批量操作

~~~bash
127.0.0.1:6379> mset user zhang name hanzhe age 21
OK
127.0.0.1:6379> mget user name age
1) "zhang"
2) "hanzhe"
3) "21"
~~~

> 带有验证的 setnx

~~~bash
# 同样是设置值，因为key是唯一的，所以他在设置之前会有一个效验，如果已存在就不修改
127.0.0.1:6379> set name zhang
(integer) 1
127.0.0.1:6379> setnx name hanzhe
(integer) 0
# 批量操作也是一样，因为原子性的原因，他们要么全都成功，要么全都失败。
127.0.0.1:6379> msetnx view 123 name hanzhe
(integer) 0
~~~

> 追加字符 append

~~~bash
127.0.0.1:6379> set name zhang
OK
127.0.0.1:6379> append name " "
(integer) 6
127.0.0.1:6379> append name hanzhe
(integer) 12
127.0.0.1:6379> get name
"zhang hanzhe"
~~~

> 返回字符串长度 strlen

~~~bash
127.0.0.1:6379> strlen name
(integer) 12
~~~

> 自增，自减 incr decr

在 java 中，如果想要对字符串 +1 需要转换类型，而在 redis 中他们自动为我们进行了处理

~~~bash
127.0.0.1:6379> set view 1
OK
# 自增 +1
127.0.0.1:6379> incr view
(integer) 2
# 自减 -1
127.0.0.1:6379> decr view
(integer) 1
# 自增，指定步长为3
127.0.0.1:6379> incrby view 3
(integer) 4
# 自减，指定步长为2
127.0.0.1:6379> decrby view 2
(integer) 2
~~~

> 截取字符串 getrange，==截取是将获取的结果进行截取，并不会对 key 本身造成改变==

~~~bash
127.0.0.1:6379> set name zhanghanzhe
OK
# 从下标0开始，截取到4，共截取了5位，包头包尾，如果是0到-1则代表获取全部的字符串
127.0.0.1:6379> getrange name 0 4
"zhang"
~~~

> 替换字符串 setrange

~~~bash
# 从下标5开始替换，直至替换结束，这个会对name进行修改。
127.0.0.1:6379> setrange name 5 chunde
(integer) 11
127.0.0.1:6379> get name
"zhangchunde"
~~~

> 设置消亡时间 ( 过期时间 ) setex 单位/秒

之前我们使用过一个叫 `expire` 的命令，也是用来设置消亡时间的，但是他执行设置已存在的 key，而这个命令可以在设置变量的同时设置消亡时间

~~~bash
127.0.0.1:6379> setex name 10 zhang
OK
~~~



### List 列表集合

list 是用来存储 string 的一个列表, ==redis 的列表是双向的==，list 默认从右向左延伸，也就是每次添加元素都会添加在左面，==list 列表允许重复元素的出现==

*list中的命令，大多数都是以小写字母 L 开头的*

> 创建-添加元素 lpush，rpush

lpush 默认从左侧添加，如需从右侧添加可以使用 `r ` 开头声明

~~~bash
127.0.0.1:6379> lpush name han
(integer) 1
127.0.0.1:6379> lpush name zhang
(integer) 2
127.0.0.1:6379> rpush name zhe
(integer) 3
~~~

> 查看列表 lrange

~~~bash
# 查看之前创建的list，仅支持从左侧查看
127.0.0.1:6379> lrange name 0 -1
1) "zhang"
2) "han"
3) "zhe"
~~~

> 添加，追加元素 2

之前介绍了 `push` 命令可以添加元素，通过 l 开头或者 r 开头可以控制左侧添加还是右侧添加，其实添加元素还可以使用 `linsert` 命令，和 `push` 不同的是， `push` 是在首位添加，而 `linsert` 是从 **左面开始在第一个目标 key 的前后添加**

~~~bash
127.0.0.1:6379> lpush name han
(integer) 1
# 在name中的han前面添加zhang
127.0.0.1:6379> linsert name before han zhang
(integer) 2
# 在name中的han后面添加zhe
127.0.0.1:6379> linsert name after han zhe
(integer) 3
127.0.0.1:6379> lrange name 0 -1
1) "zhang"
2) "han"
3) "zhe"
~~~

> 修改指定下标的 value

~~~bash
127.0.0.1:6379> lrange name 0 -1
1) "zhe"
2) "han"
3) "zhe"
# 修改下标0的值为zhang
127.0.0.1:6379> lset name 0 zhang
OK
127.0.0.1:6379> lrange name 0 -1
1) "zhang"
2) "han"
3) "zhe"
~~~

> 移除首尾 pop，移除多个 lrem

~~~bash
# 移除左侧第一个，返回被移除的数据
127.0.0.1:6379> lpop name
"zhang"
# 移除右侧第一个，返回被移除的数据
127.0.0.1:6379> rpop name
"zhe"
127.0.0.1:6379> lpush name one
(integer) 4
127.0.0.1:6379> rpush name one one
(integer) 6
# 移除多个元素，仅支持从左侧移除，2数量，one为具体要移除的值，精确匹配，不支持通配符
127.0.0.1:6379> lrem name 2 one
(integer) 2
~~~

> 返回长度 llen

~~~bash
127.0.0.1:6379> lpush name han zhang
(integer) 2
127.0.0.1:6379> rpush name zhe
(integer) 3
# 获取集合长度
127.0.0.1:6379> llen name
(integer) 3
~~~

> 获取指定下标的value

~~~bash
127.0.0.1:6379> lrange name 0 -1
1) "zhang"
2) "han"
3) "zhe"
127.0.0.1:6379> lindex name 0
"zhang"
~~~

> 截取列表 ltrim

~~~bash
127.0.0.1:6379> lrange list 0 -1
1) "five"
2) "four"
3) "three"
4) "two"
5) "one"
# 从下标1开始截取到2，会修改变量中的值
127.0.0.1:6379> ltrim list 1 2
OK
127.0.0.1:6379> lrange list 0 -1
1) "four"
2) "three"
~~~

> 获取排序结果 sort，不会影响本体，`字母排序/alpha`，`倒序排序/desc`

~~~bash
127.0.0.1:6379> lpush num 10 30 20 40
(integer) 4
# 默认从小到大
127.0.0.1:6379> sort num
1) "10"
2) "20"
3) "30"
4) "40"
# 可以从大到小
127.0.0.1:6379> sort num desc
1) "40"
2) "30"
3) "20"
4) "10"
~~~

~~~bash
# 字母排序
127.0.0.1:6379> lpush En python java switch
(integer) 3
127.0.0.1:6379> sort En alpha
1) "java"
2) "python"
3) "switch"
~~~

> 组合命令：移动元素

~~~bash
127.0.0.1:6379> lrange name 0 -1
1) "han"
2) "zhe"
3) "zhang"
# 移除目标元素并添加到目标位置
127.0.0.1:6379> rpoplpush name name
"zhang"
127.0.0.1:6379> lrange name 0 -1
1) "zhang"
2) "han"
3) "zhe"
~~~



### Set 无序集合

set 集合是 string 类型的 ==无序集合==，且==不允许存入重复数据==，如果重复存入相同的值会报错

*还是老规矩，set 集合的命令特点，就是以 s 开头*

> set 集合的 CRUD

~~~bash
# 添加 sadd
127.0.0.1:6379> sadd code java
(integer) 1
127.0.0.1:6379> sadd code python switch
(integer) 2
~~~

~~~bash
# 查看 smembers，这里就可以看出，set集合是无序的
127.0.0.1:6379> smembers code
1) "python"
2) "java"
3) "switch"
~~~

~~~bash
# 删除元素
127.0.0.1:6379> srem code switch
(integer) 1
~~~

> 查看目标 set 集合长度 scard

~~~bash
127.0.0.1:6379> scard code
(integer) 3
~~~

> 检查 set 集合中是否包含指定的值 sismember，存在返回 1，不存在返回 0

~~~bash
127.0.0.1:6379> sismember code java
(integer) 1
~~~

> 随机性的获取和移除

~~~bash
127.0.0.1:6379> sadd num 1 2 3 4 5 6 7 8 9
(integer) 9
# 随机获取一个值
127.0.0.1:6379> srandmember num 1
1) "7"
127.0.0.1:6379> srandmember num 1
1) "3"
# 随机移除一个值
127.0.0.1:6379> spop num 1
1) "2"
~~~

> 获取多个集合中的 ==差集==，==交集==，==并集==

~~~bash
## 前置条件--拥有三个set集合
127.0.0.1:6379> sadd key1 1 2 3 4
(integer) 4
127.0.0.1:6379> sadd key2 3 4 5 6
(integer) 4
127.0.0.1:6379> sadd key3 1 6 7 8
(integer) 4
~~~

差集 `sdiff`，取出两个集合中不同的元素


~~~bash
# 以第一个key为主，依次与每个key取差集
127.0.0.1:6379> sdiff key1 key2
1) "1"
2) "2"
127.0.0.1:6379> sdiff key1 key2 key3
1) "2"
127.0.0.1:6379> sdiff key2 key1 key3
1) "5"
~~~

交集 `sinter`，取出两个集合中相同的元素

~~~bash
# 以第一个key为主，依次与每个key取交集
127.0.0.1:6379> sinter key1 key2
1) "3"
2) "4"
127.0.0.1:6379> sinter key1 key3
1) "1"
127.0.0.1:6379> sinter key1 key2 key3
(empty list or set)
~~~

并集 `sunion`，取出两个集合中所有的元素


~~~bash
# 以第一个key为主，依次与每个key取并集
127.0.0.1:6379> sunion key1 key2
1) "1"
2) "2"
3) "3"
4) "4"
5) "5"
6) "6"
127.0.0.1:6379> sunion key1 key2 key3
1) "1"
2) "2"
3) "3"
4) "4"
5) "5"
6) "6"
7) "7"
8) "8"
~~~



### Hash 散列集合

hash 类型就像 map，是由一个个的 key-value 组成的对象，而且 ==key 不能重复==，**存入相同的 key 和 value 后，最后一个存入的会覆盖之前存入的结果**

*老规矩，几乎所有 hash 的指令都以 h 开头*

> 添加，批量添加，hash 没有修改，覆盖就是修改

~~~hash
127.0.0.1:6379> hset user name zhanghanzhe
(integer) 1
127.0.0.1:6379> hmset user sex nan age 21
OK
~~~

> 获取，批量获取

~~~bash
# 通过key获取value
127.0.0.1:6379> hget user name
"zhanghanzhe"
127.0.0.1:6379> hmget user name sex age
1) "zhanghanzhe"
2) "nan"
3) "21"
~~~

~~~bash
# 获取所有key
127.0.0.1:6379> hkeys user
1) "name"
2) "sex"
3) "age"
# 获取所有value
127.0.0.1:6379> hvals user
1) "zhanghanzhe"
2) "nan"
3) "21"
~~~

~~~bash
# 获取所有的key和value
127.0.0.1:6379> hgetall user
1) "name"
2) "zhanghanzhe"
3) "sex"
4) "nan"
5) "age"
6) "21"
~~~

> 删除指令

~~~bash
127.0.0.1:6379> hdel user name
(integer) 1
127.0.0.1:6379> hdel user sex age
(integer) 2
~~~

> 自增和自减

~~~bash
127.0.0.1:6379> hset map key1 5
(integer) 1
127.0.0.1:6379> hincrby map key1 2
(integer) 7
127.0.0.1:6379> hincrby map key1 -3
(integer) 4
~~~

>判断是否存在，存在返回 1，不存在返回 2

~~~bash
127.0.0.1:6379> hexists map key1
(integer) 1
~~~



### Zset 有序集合

zset 有序集合和 set 集合类似，都是不允许重复的值出现，只不过相比于 set 集合，zset 多了一个排序的功能，在添加值得时候需要给他一个 `分值`，<font color="red">`分值` 可以重复但 `value` 不允许重复</font>，默认按照分值从小到大排序

*老规矩，几乎所有 zset 的指令都以 z开头*

> 添加元素 zadd，第一个是分值，第二个是 value

~~~bash
127.0.0.1:6379> zadd user 1 zhang
(integer) 1
127.0.0.1:6379> zadd user 2 han 3 zhe
(integer) 2
~~~

> 删除元素

~~~bash
127.0.0.1:6379> zrem user zhang han zhe
(integer) 3
~~~

> 查看集合

~~~bash
# 正常查看集合
127.0.0.1:6379> zrange user 0 -1
1) "zhang"
2) "han"
3) "zhe"
# 倒序查看集合
127.0.0.1:6379> zrevrange user 0 -1
1) "zhe"
2) "han"
3) "zhang"
# 查看带有分值的集合
127.0.0.1:6379> zrange user 0 -1 withscores
1) "zhang"
2) "1"
3) "han"
4) "2"
5) "zhe"
6) "3"
~~~

> 获取集合内元素的数量 zcard zcount

这里需要注意：==- inf 代表无穷小，+ inf 代表无穷大==

~~~bash
127.0.0.1:6379> zadd user 10 zhang 12 wang 18 li 20 zhao 28 bai 30 guo
(integer) 6
# 获取当前集合数量
127.0.0.1:6379> zcard user
(integer) 6
# 获取当前集合分值符合区间内的数量
127.0.0.1:6379> zcount user -inf +inf
(integer) 6
127.0.0.1:6379> zcount user 10 20
(integer) 4
~~~



## 三大特殊类型

### 地理位置

`Geospatial` 类型用来存储有关经纬度的地理位置信息，默认经度第一位，维度第二位，redis 中针对经纬度的存储范围有一定的限制：

- 经度有效范围：-180 ~ 180
- 维度有效范围：-85.05112878 ~ 85.05112878

*老规矩，几乎所有指令都是以 geo开头的*

> 添加地理位置信息 geoadd

在添加经纬度的时候如果超出了范围会报错

~~~bash
127.0.0.1:6379> geoadd point 126.64 45.75 hei
(integer) 1
127.0.0.1:6379> geoadd point 125.32 43.88 ji 123.42 41.79 liao
(integer) 2
~~~

> 查看指定地区的经纬度 ( 已存入的 )，同理，添加也是修改

~~~bash
127.0.0.1:6379> geopos point ji
1) 1) "125.32000154256820679"
   2) "43.87999897829567431"
127.0.0.1:6379> geopos point hei ji liao
1) 1) "126.64000242948532104"
   2) "45.74999965248261447"
2) 1) "125.32000154256820679"
   2) "43.87999897829567431"
3) 1) "123.41999977827072144"
   2) "41.78999971580505246"
~~~

> 计算两地的距离 geodist

使用 `geodist` 获取距离是通过经纬度计算出来的 **直线距离**，并不是路途距离，默认获取单位是米，可以通过制定后缀来设置获取的单位： `m/米`，`km/千米`，`mi英里`，`ft英尺`

~~~bash
# 获取吉林到黑龙江的直线距离
127.0.0.1:6379> geodist point hei ji
"232604.0065"
127.0.0.1:6379> geodist point hei ji km
"232.6040"
~~~

> 雷达方式获取目标经纬度附近的地理位置 georadius

雷达方式，以经纬度为中心，距离为半径按照圆形扫描，类似微信附近的人功能

`withdist距离km`，`withdist经纬度`，`count 1 显示第一个符合要求的`

~~~bash
# 返回经度125维度43附近300km的位置信息
127.0.0.1:6379> georadius point 125 43 300 km
1) "ji"
2) "liao"
~~~

~~~bash
# 多要求获取
127.0.0.1:6379> georadius point 125 43 300 km withdist withcoord count 1
1) 1) "ji"
   2) "101.2331"
   3) 1) "125.32000154256820679"
      2) "43.87999897829567431"
~~~

~~~bash
# 使用已存在的地理位置进行获取
127.0.0.1:6379> georadiusbymember point ji 250 km
1) "ji"
2) "hei"
~~~

> 移除元素

`Geospatial` 类型比较特殊，他没有给咱们提供移除的指令，但是 `Geospatial` 的底层是基于 `zset` 实现的，我们可以通过 `zset` 来移除指定的 key 即可。

~~~bash
127.0.0.1:6379> zrange point 0 -1
1) "liao"
2) "ji"
3) "hei"
127.0.0.1:6379> zrem point hei
(integer) 1
127.0.0.1:6379> geopos point hei
1) (nil)
~~~



### 基数统计

`hyperloglog` 他是一种专门用来统计及基数的类型，当然其中的元素不允许重复，相比于 set 集合，例如计算网站访问量时，可以交给 `hyperloglog` 进行处理，他的内存占用是固定的 12KB。

但是因为他仅仅是计算基数的类型，所以并不能像 set 集合一样，获取到元素的具体的值，而且该类型有一定的误差，如果对精准度没有太大要求，那么推荐使用 `hyperloglog`

*老规矩，几乎所有指令都是以 pf开头的*

> 添加元素 pfadd

~~~bash
127.0.0.1:6379> pfadd num1 1 2 3 4 5
(integer) 1
127.0.0.1:6379> pfadd num2 3 4 5 6 7
(integer) 1
~~~

> 查看元素个数

~~~bash
127.0.0.1:6379> pfcount num1
(integer) 5
~~~

> 将两个集合合并为一个集合

~~~bash
127.0.0.1:6379> pfmerge num3 num1 num2
OK
127.0.0.1:6379> pfcount num3
(integer) 7
~~~



### 进制存储

`bitmap` 是基于二进制进行存储的，二进制只有 0 和 1 两个值，可以分别用来代表两种相对不同的状态，例如 打卡 <=> 未打卡，可以抽象的理解为 boolean 类型中的 true 和 false 的感觉。

*命令几乎都以 bit 结尾*

> 添加元素 [ 0 代表未打卡，1 代表打卡 ]

~~~bash
127.0.0.1:6379> setbit sign 0 1
(integer) 1
127.0.0.1:6379> setbit sign 1 1
(integer) 0
127.0.0.1:6379> setbit sign 2 0
(integer) 1
127.0.0.1:6379> setbit sign 3 1
(integer) 1
~~~

> 查看某个状态 -- 返回 1 代表打卡，0 代表未打卡

~~~bash
127.0.0.1:6379> getbit sign 1
(integer) 1
~~~

> 查看多少人符合条件

~~~bash
127.0.0.1:6379> bitcount sign
(integer) 3
~~~



## Redis 的事务

事务就是一组命令的集合，将平时多次执行的命令放在一起，然后按照命令顺序依次执行，而且执行过程中不会被干扰，事务执行结束后不会保留，也就意味着每次执行事务都需要重新创建，可得出 redis 事务的三个特点：<font color="red">顺序性</font>，<font color="red">排他性</font>，<font color="red">一次性</font>。

还有几点需要注意：==redis 的事务中，没有原子性和隔离性的概念，也不包含回滚==，所有命令在加入事务的时候，并没有直接执行，而是被放在了执行的队列中，也就不存在隔离性。

事务涉及到的关键字：`开启/multi`，`执行/exec`，`放弃/discard`，`监视/watch`，`关闭监视/unwatch`

### 使用事务

> 事务的执行

~~~bash
# 当输入multi的时候就表示事务开始了，当使用exec的时候，就表示要执行了
127.0.0.1:6379> multi
OK
127.0.0.1:6379> set k1 v1
QUEUED
127.0.0.1:6379> mset k2 v2 k3 v3
QUEUED
127.0.0.1:6379> exec
1) OK
2) OK
127.0.0.1:6379> mget k1 k2 k3
1) "v1"
2) "v2"
3) "v3"
~~~

~~~bash
# 当我事务添加中途，不想执行了，那么可以使用discard命令来放弃当前事务
127.0.0.1:6379> multi
OK
127.0.0.1:6379> set k1 zhang
QUEUED
127.0.0.1:6379> discard
OK
127.0.0.1:6379> get k1
"v1"
~~~



> 事务的异常处理机制

和 java 有点类似，redis 针对事务也分所谓的 `编译时异常` 和 `运行时异常`，只不过这里的 `编译时异常` 指的是命令是否正确，针对不同的异常，redis 事务处理的方式也不一致

- 命令错误的处理方式

~~~bash
# 当我在执行命令的时候，命令输入有误，这时整个事务都不会执行
127.0.0.1:6379> multi
OK
127.0.0.1:6379> set user zhang
QUEUED
127.0.0.1:6379> sett name hanzhe
(error) ERR unknown command `sett`, with args beginning with: `name`, `hanzhe`, 
127.0.0.1:6379> exec
(error) EXECABORT Transaction discarded because of previous errors.
# 因为事务报错，所以user并没有存进去，哪怕他是第一条命令
127.0.0.1:6379> get user
(nil)
~~~

- 逻辑错误的处理方式

~~~bash
# 自增的变量是字符而不是数字
127.0.0.1:6379> set money zhang
OK
# 然后我们再来执行事务
127.0.0.1:6379> multi
OK
127.0.0.1:6379> incrby money 3000
QUEUED
127.0.0.1:6379> decrby money 188
QUEUED
127.0.0.1:6379> set user zhang
QUEUED
127.0.0.1:6379> exec # 他会直接提示前两句执行失败，但是第三句执行成功
1) (error) ERR value is not an integer or out of range
2) (error) ERR value is not an integer or out of range
3) OK
# 这里也是可以获取到的，哪怕他是最后一条，不符合原子性
127.0.0.1:6379> get user
"zhang"
~~~

因为 redis 的事务管理并不严格，所以 redis 的事务又被人戏称 **伪事务**



### 乐观锁

在我们执行事务的时候，如果是处在多线程的环境下，我通过事务对某个数据进行改变，但是在我命令缓存完成还没有执行的时候，另一条线程进来对这个数据进行了修改，那么就会发生难以想象的改变。

> 模拟举例说明：

~~~bash
## 线程1 启动事务
127.0.0.1:6379> multi
OK
127.0.0.1:6379> incrby money 3000
QUEUED
127.0.0.1:6379> decrby money 188 
QUEUED
~~~

~~~bash
## 线程2 中途插入
127.0.0.1:6379> set money 200000
(integer) 200100
~~~

~~~bash
## 线程1 这时刚刚提交事务
127.0.0.1:6379> exec
1) (integer) 203000
2) (integer) 202812
~~~

可以发现，在事务执行的过程中数据被改变了，结果也造成影响了

> 什么是乐观锁？

关于锁，有两个概念，一个是 `悲观锁`，还有一个是 `乐观锁`，悲观锁类似 java 中的多线程锁 `synchronized`，将整个方法上锁，无论是否有多条线程访问都会工作，在安全的前提下影响了性能，而 `乐观锁` 是在指令添加前将被操作的那个 key 监视起来，如果在执行的时候发现目标 key 发生了改变，那么就将当前事务取消不执行。

~~~bash
## 线程1
# 在启动事务之前，监视目标key
127.0.0.1:6379> watch money
OK
# 启动事务
127.0.0.1:6379> multi
OK
127.0.0.1:6379> incrby money 3000
QUEUED
127.0.0.1:6379> decrby money 188
QUEUED
~~~

~~~bash
## 线程2 中途插入
127.0.0.1:6379> incrby money 200000
(integer) 200100
~~~

~~~bash
## 线程1 这时刚刚提交事务
127.0.0.1:6379> exec
(nil)
~~~

可以发现，被监视的 key 发生改变后，事务执行就被中断了，那么之后应该如何处理呢？

> 乐观锁善后

~~~bash
# 1.关闭当前事务
127.0.0.1:6379> discard
OK
# 关闭监控
127.0.0.1:6379> unwatch
OK
## 重新监控，再走一遍事务逻辑.....
## 在执行前在进行比对....
~~~



## 持久化保存策略

我们都是到，redis 是操作内存的数据库，正因为这样的特点才让他的存取速度特别快，但是在内存中存放的数据，当我们重新启动服务器的时候就会丢失，这个时候就需要接触到 `持久化` 这个技术了，持久化就是把当前进程数据生成快照保存到硬盘的过程。

redis 的持久化操作分为两种，分别为 `RDB` 和 `AOF`，两种方式只能同时使用一种，redis 使用的 **默认持久化方式为 RDB**，

### RDB 方式

RDB ( Redis DataBase ) 持久方式，会单起一条线程，在指定的时间间隔内将内存中的数据以二进制形式写入、临时文件中，写入成功后默认存放到 redis 的安装目录下的 `dump.rdb` 文件中，如果你使用自己的配置启动的 redis，那么 `dump.rdb` 会和你的配置文件同级。

RDB 的持久化有两种触发机制，一种是手动命令持久化，一种是自动持久化。

> 手动持久化 `save`，`bgsave`

~~~bash
127.0.0.1:6379> save
OK
127.0.0.1:6379> bgsave
Background saving started
~~~

- `save` 命令会阻塞当前 redis 服务器，期间不能正常提供服务，这一现象直至数据保存完毕后恢复正常。
- `bgsave` 会执行 fork 子进程负责持久化操作，在创建子进程的时候会有短暂的阻塞，时间很短。

除开这种主动的持久化之外，一些其他的命令也会完成持久化的操作，例如：`flushall`，`shutdown` 等等。



> 自动持久化

配置文件中的 SNAPSHOTTING 模块就是用来做 RDB 持久化的，里面有这样几句配置命令：

~~~bash
################################ SNAPSHOTTING  ################################ 快照
# save 时间/s 数据修改次数
# 例如 save 900 1，如果数据只修改了一次，那么就900秒持久化一次
save 900 1
save 300 10
save 60 10000
# 当RDB最后一次保存失败后，是否停止接受数据，默认yes (否则没人知道它坏了)
stop-writes-on-bgsave-error yes
# 是否以压缩形式保存，默认为yes
rdbcompression yes
# 是否效验数据完整性，默认为yes
rdbchecksum yes
# 持久化保存文件名
dbfilename dump.rdb
# 持久化文件保存路径
dir ./
~~~

一般我们不需要该他的配置文件，预设的就够用了。



### #####AOF 方式#####

同样还是在配置文件中，APPEND ONLY MODE 模块就是负责 AOF 持久化的，和 RDB 不同， AOF 的原理是将所有曾经使用过的存入操作的命令都记录下来，存放到 `appendonly.aof` 文件中，是可以看个模糊的大概的。

> AOF 持久化配置

AOF 也可以手动触发，只需要执行 `bgrewriteaof` 命令即可，但是一般都用配置文件管理，配置信息如下：

~~~bash
############################## APPEND ONLY MODE ############################### 仅附加模式
# 是否开启AOF，默认为no
appendonly no
# 指定更新条件，可以选择三个值：
	# no：每次修改都同步，数据完整性强，性能偏低
	# always：每秒同步一次，数据完整性较好
	# everysec：让操作系统自己同步数据，消耗资源最低
appendfsync everysec
# 百分比，如果数据文件大小占据了指定百分比，会触发重写。
auto-aof-rewrite-percentage 100
# 必须满足最小大小才可以重写
auto-aof-rewrite-min-size 64mb
~~~



> AOF 重写

- ##########################################################################

有关于持久化策略，以后再细学





### 比较RDB和AOF

`RDB`：RDB 是二进制文件，按照时间进行数据同步，每次同步都会执行 fork 操作，如果为了追求数据数据完整性不停的同步，会极大的影响 redis 工作效率，更==适合做定期备份，用于灾难恢复==

`AOF`：AOF 通过记录命令实现持久化，通过控制参数可以精确到秒级。

- ##########################################################################

有关于持久化策略，以后再细学



### 文件损坏修复

当我们的数据文件损坏导致 redis 无法启动的时候，我们可以尝试运行 redis 的修复工具

~~~bash
redis-check-aof --fix 配置文件
redis-check-rdb --fix 配置文件
~~~

- ##########################################################################

有关于持久化策略，以后再细学



## Jedis整合使用

所有程序均是以 maven 为基础搭建的

### Java整合

使用 java 项目整合 redis 进行操作，首先要添加 maven 依赖

> 正常操作 redis

~~~xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>3.3.0</version>
</dependency>
~~~

添加依赖完成后，便可以直接通过 java 代码创建连接并操作数据库了

~~~java
public class Demo1 {
    public static void main(String[] args) {
        // 创建连接
        Jedis redis = new Jedis("IP地址", 6379);
        // 验证连接密码
        redis.auth("你的密码");
        // 清空当前数据库
        redis.flushDB();
        // 正常的增删改查
        System.out.println(redis.ping());
        System.out.println(redis.set("user", "zhang"));
        System.out.println(redis.get("user"));
        // 关闭连接
        redis.close();
    }
}
~~~

直接创建 jedis 对象就可以创建远程连接，而且实例内的方法和 redis 的指令用法等等几乎一模一样，非常好用。

> redis 连接池

一般来说 jedis 已经可以很好的操作 redis 数据库了，但是在项目中如果频繁的创建和关闭连接，是很耗费服务器资源的，所以这里可以使用 jedis 的连接池进行操作

~~~java
// 使用默认的连接池操作
public class JedisPoolDemo {
    public static void main(String[] args) {
        // 创建jedis连接池对象
        JedisPool pool = new JedisPool("IP地址", 6379);
        //  从连接池中获取连接
        Jedis redis = pool.getResource();
        // 正常操作jedis
        redis.auth("密码");
        redis.set("name", "hanzhe");
        System.out.println(redis.get("name"));
        // 关闭连接
        redis.close();
    }
}
~~~

~~~java
// 使用自定义配置的连接池
public class JedisPoolDemo {
    public static void main(String[] args) {
        // 创建连接池配置对象
        JedisPoolConfig poolConfig = new JedisPoolConfig();
        // 设置最大连接数
        poolConfig.setMaxTotal(50);
        // 设置最大空闲连接数
        poolConfig.setMaxIdle(10);
        // 按照指定的配置创建连接
        JedisPool pool = new JedisPool(poolConfig, "IP地址", 6379);
        // 获取连接后面的操作就是一样的了
        Jedis redis = pool.getResource();
        // ........
        // 关闭连接
        redis.close();
    }
}
~~~

> 检查 redis 数据库

~~~bash
127.0.0.1:6379> keys *
1) "name"
2) "user"
127.0.0.1:6379> mget user name
1) "zhang"
2) "hanzhe"
127.0.0.1:6379> 
~~~

经过检查发现，java 操作 redis 不存在其他的问题，整合基本完成。

> 控制台打印警告问题

~~~bash
SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
SLF4J: Defaulting to no-operation (NOP) logger implementation
SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
~~~

如果控制台打印如上的警报信息，可以引入 slf4j 的 maven 依赖进行解决

~~~xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-log4j12</artifactId>
    <version>1.7.25</version>
</dependency>
~~~



### Springboot整合

springboot 整合同样需要引入对应的 maven 依赖，和 jedis 有些许的不同，springboot 中封装的类并不可以直接调用类似命令的函数，而是对他们进行了二次封装

~~~xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
~~~

> 修改配置文件

~~~properties
# IP地址
spring.redis.host=IP地址
# 端口
spring.redis.port=6379
# 访问密码
spring.redis.password=密码
# 最大连接数
spring.redis.pool.max-active=50
# 最大空闲连接数
spring.redis.pool.max-idle=10
~~~

> 简单操作数据库

操作数据库，需要注入 `RedisTemplate` 对象进行操作

~~~java
@SpringBootTest
class Redis2SpringbootApplicationTests {
    // 自动注入对象
    @Autowired
    private RedisTemplate redisTemplate;
    @Test
    void contextLoads() {
        redisTemplate.opsForValue().set("user", "zhang");
        // 可以正常读取存入的 user 信息
        System.out.println(redisTemplate.opsForValue().get("user"));
    }
}
~~~

`RedisTemplate` 将数据类型对应的指令函数分别命名为 `opsForValue()`，`opsForList()`，`opsForSet()`，`opsForHash()`，`opsForHyperLogLog()` ，`opsForZSet()`

> 高级操作数据库

上面的方法封装了各种数据类型的简单操作，接下来就是一些高级的操作了。

~~~java
@SpringBootTest
class Redis2SpringbootApplicationTests {
    @Autowired
    private RedisTemplate redisTemplate;
    @Test
    void contextLoads() {
        // 获取当前连接
        RedisConnectionFactory factory = redisTemplate.getConnectionFactory();
        RedisConnection connection = factory.getConnection();
        // ping测试，清空库，停止服务，关闭连接等等高级操作
        System.out.println(connection.ping());
        connection.flushDb();
        connection.flushAll();
        connection.shutdown();
        connection.close();
        // 开启事务等等相关设置也在这里
    }
}
~~~

> 乱码问题

~~~java
// Java 代码
redisTemplate.opsForValue().set("name", "zhang");
System.out.println(redisTemplate.opsForValue().get("name"));
~~~

~~~bash
# redis 数据库
127.0.0.1:6379> keys *
1) "\xac\xed\x00\x05t\x00\x04name"
~~~

我们通过 springboot 向 redis 中插入一个字符串，发现存进去的字符串存在乱码问题，这时候我们可以通过使用 `RedisTemplate` 的子类 `StringRedisTemplate` 进行操作

~~~java
@SpringBootTest
class Redis2SpringbootApplicationTests {
    @Autowired
    private StringRedisTemplate string;
    @Test
    void contextLoads() {
        string.opsForValue().set("name", "zhang");
        System.out.println(string.opsForValue().get("name"));
    }
}
~~~

~~~bash
# name 也可以正常存取
127.0.0.1:6379> keys *
1) "name"
2) "\xac\xed\x00\x05t\x00\x04name"
127.0.0.1:6379> get name
"zhang"
~~~

> 自定义 RedisTemplate

字符串可以通过 `StringRedisTemplate` 来解决问题，但是存入其他类型的还是会出现问题，这时可自己创建一个 `RedisTemplate` 来代替原本的类工作。*代码来自互联网*

1.首先要引入 maven 依赖

~~~xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.9.8</version>
</dependency>
~~~

2.创建配置类

~~~java
@Configuration
public class RedisUtil {
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate();
        template.setConnectionFactory(factory);
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        // key采用String的序列化方式
        template.setKeySerializer(stringRedisSerializer);
        // hash的key也采用String的序列化方式
        template.setHashKeySerializer(stringRedisSerializer);
        // value序列化方式采用jackson
        template.setValueSerializer(jackson2JsonRedisSerializer);
        // hash的value序列化方式采用jackson
        template.setHashValueSerializer(jackson2JsonRedisSerializer);
        template.afterPropertiesSet();
        return template;
    }
}
~~~

这个时候自定义的  就已经完成了，现在再来测试一遍是否乱码

~~~java
@SpringBootTest
class Redis2SpringbootApplicationTests {
    @Autowired
    private RedisTemplate redisTemplate;
    @Test
    void contextLoads() {
        redisTemplate.opsForValue().set("name", "zhang");
        System.out.println(redisTemplate.opsForValue().get("name"));
    }
}
~~~

~~~bash
# 乱码问题已经解决，这个特殊符号是字符串的转义
127.0.0.1:6379> keys *
1) "name"
127.0.0.1:6379> get name
"\"zhang\""
~~~

> 通过序列化将对象存储到 redis 中

~~~java
// implements Serializable 序列化接口一定要实现
public class Person implements Serializable {
    private String username;
    private String password;
    /* 省略get-set-toString方法 */
}
~~~

~~~java
@SpringBootTest
class Redis2SpringbootApplicationTests {
    @Autowired
    private RedisTemplate redisTemplate;
    @Test
    void contextLoads() {
        Person p = new Person();
        p.setUsername("张涵哲");
        p.setPassword("zhang");
        redisTemplate.opsForValue().set("user", p);
        System.out.println(redisTemplate.opsForValue().get("user"));
    }
}
/*
	可以正常读取
	Person{username='张涵哲', password='zhang'}
*/
~~~





## 订阅与发布

redis 的订阅发布是一种通讯模式，分别为 `发送者/sub` 和 `订阅者/pub` 两种身份，发布者负责发送一些信息，然后由订阅者接收，涉及到的命令也非常少

> 最常用：简单使用订阅和发布完成交互 `subscribe`，`publish`

~~~bash
# 订阅者 当我订阅s1频道的时候，命令行就会被锁定，静等s1频道发送信息
127.0.0.1:6379> subscribe s1
Reading messages... (press Ctrl-C to quit)
1) "subscribe"
2) "s1"
3) (integer) 1
~~~

~~~bash
# 发布者 只需要在固定的频道发送消息即可，不用考虑订阅者状态
127.0.0.1:6379> publish s1 haha
(integer) 1
~~~

~~~bash
# 订阅者 命令行状态发生改变：
1) "message"  # 提示接受到了消息
2) "s1"     # 如果订阅了多个，在这里区分发布者频道
3) "haha"    # 频道发送的消息
~~~





## 主从复制

在我们的项目越做越大的情况下，一个 redis 服务可能已经不支持我们的读写效率了，这个时候我们需要配置多个服务器，在每个服务器上都配置 redis 的环境，让他们分别为一个程序提供服务，这种工作方式被称之为集群

在多个服务器中选中一台服务器为主机 ( Master )，其他为从机 ( Slave )，主机负责写入数据 ( set.. )，而从机负责读取数据 ( get )，为了多个服务器之间数据同步的问题，所以有了主从复制的技术。

这里可以通过复制多个配置文件，修改端口号来实现 `伪集群`，设置 6379 为主机，6380 为从机，后面简称为 79 和 80

### 通过命令实现

选择 79 为主机，连接主机输入 `info replication` 命令即可查看当前机器配置状态

~~~bash
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:0
master_replid:49e04dfecc70d4b55f17798d80b1d77ac4289c12
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:0
second_repl_offset:-1
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
~~~

第二行位置显示 role:master，代表当前端口是主机，==redis 默认每台机器都是主机==，配置主从复制只需要配置从机就可以了。

配置从机 `slaveof` 认主，只需要找到目标 Redis 服务器作为自己的主人就可以了，这样一来从机就可以获取到主机的数据了。

~~~bash
# 80，81 端口
127.0.0.1:6380> slaveof localhost 6379
OK
127.0.0.1:6380> info replication
# Replication
role:slave
master_host:127.0.0.1
master_port:6379
master_link_status:up
master_last_io_seconds_ago:7
master_sync_in_progress:0
slave_repl_offset:434
slave_priority:100
slave_read_only:1
connected_slaves:0
master_replid:5ec4f58da9447b03e682d76edb61cbf5e4cf89a2
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:434
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:434
~~~

