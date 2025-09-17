# MySQL笔记

mysql 由行和列之间建立某种关系存储数据信息，是最常见的关系型数据库，也是当下最流行的，开源的，免费的数据库

## 安装及配置

我习惯下载软件都会去官网进行下载，直接百度搜索 mysql 即可，mysql 的官网地址如下：

~~~
https://www.mysql.com/
~~~

当然也可以直接去他的下载地址：

~~~
https://dev.mysql.com/downloads/mysql/
~~~

> MySQL的下载页面如下所示：

<img src="./img/mysql-01.png">

这里我选择下载的是 Windows x64 环境下的 MySQL 5.7.30，下载完成后是一个压缩包文件，将他解压到平时安装软件的位置就行了，解压就相当于是一种安装



### MySQL 配置文件

在 mysql 解压完成后，进入 mysql 目录下，新建一个 mysql 的配置文件，命名要求及格式为 `my.ini`，注意，这里的 ini 是文件的格式扩展名，而不是文件名的一部分

然后右键用记事本打开，在配置文件中添加如下的代码

~~~shell
[mysqld]
# 设置MySQL端口为3306
port=3306
# 设置mysql的安装目录
basedir=D:\Program Files\MySQL_5.7.30
# 设置mysql数据库的数据的存放位置目录
datadir=D:\Program Files\MySQL_5.7.30\database
# 设置数据库字符集
character-set-server=utf8
# 设置表名区分大小写，1为不区分，2为区分
# lower_case_table_names=2
# 设置无需密码登录
skip-grant-tables
~~~

第三步的设置数据存放位置目录是自己随便写的位置，最后的目录名称也是自定义的，可以自行修改，但是最后一个目录最好是不存在的目录，这样在初始化的时候会为你自动创建该目录，如果是一个已存在的目录可能会出错

因为我们不是通过 MSI 进行安装的，并不能通过安装就设置 root 的访问密码，所以在没有密码的状况下需要进设置他无需密码登录，等所有设置都完成之后就可以删除掉最后一行了

这样一来配置文件就搞定了，这个是最简单的配置文件信息，mysql 配置文件信息远远不止这点，如果想要配置多去百度查询 `my.ini` 具体配置即可



### 配置环境变量

配置环境变量应该都很熟悉了

- 右键 `计算机` ，点击 `属性`
- 找到左侧的 `高级系统设置`，点击进入
- 在 `高级` 选项卡下，点击下方的 `环境变量`
- 在下面的 `系统变量` 区域中找到 `PATH`，双击进入
- 添加新的环境变量到 mysql 安装目录下的 `bin` 目录中
- 至此，环境变量配置完成



### 初始化服务

这一步很简单，需要执行的只有两行代码，但是执行这两行代码需要你的环境配置没有任何问题，如果提示 不是内部或外部命令，也不是可运行的程序，那么你的环境变量配置就有问题，需要重新走一遍上述流程

开始初始化服务

~~~shell
# 初始化MySQL服务
mysqld -install
~~~

这一步执行完成后，控制台会提示 `Service successfully installed`，表示服务创建成功了，如果没有提示这个可能程序出现了问题，或者之前安装过 mysql 没有卸载干净，请自行百度解决

~~~shell
# 初始化本地数据库
mysqld --initialize-insecure --user=mysql
~~~

初始化本地数据库后，会在你之前设置的那个目录的位置创建一个你指定名称的目录，目录下会存放着数据库存储的文件，初始化命令执行会有几秒钟的延迟，请耐心等待，如果没有任何提示就证明初始化成功了



### 设置 ROOT 密码

如果你已经完成了上述操作，那么你就可以进入 mysql 了，之前你创建了 mysql 的服务，那么现在我们启动 mysql 服务，打开控制台输入以下命令

~~~cmd
# 启动MySQL服务
net start mysql
# 对应的关闭
net stop mysql
~~~

服务开启成功后，进入mysql：

~~~shell
mysql -u root -p
~~~

输入以上命令后，会提示让你输入密码，因为我们设置了无需密码登录，所以这里不输入任何字符直接回车，就可以进入 mysql（日后若忘记了密码也可以这么找回哦），进入 mysql 后开始修改密码，流程如下：

~~~sql
# 选择数据库
use mysql;
# 执行修改操作
update user set authentication_string=password('密码') where user='root' and Host='localhost';
# 刷新权限
flush privileges;
# 退出MySQL
exit;
~~~

这样一套行云流水下来，root 的密码也设置好了，接下来去配置文件删掉最后一项，然后重启服务即可

~~~cmd
C:\Windows\system32>net stop mysql
MySQL 服务正在停止.
MySQL 服务已成功停止。
~~~



<font color="red">**注：**</font>上面涉及到修改密码的 update 语句，是按照 `mysql5.7.30` 版本使用的，如果版本低一些，请使用下面这行代码替换：

~~~cmd
update user set password=password('abc') WHERE User='root';
~~~

这样一来你的 mysql 就已经配置完成啦！可以正常使用了



### MIS 安装版忘记密码

之前在上面我们提过，如果我们忘记了密码可以回溯到最开始，在 `my.ini` 配置文件中使用 `skip-grant-tables` 即可无需密码登录，然后在重置密码

但是如果是通过 MIS 安装的 mysql，它的目录下是没有 `my.ini` 配置文件的，所以想要重置密码需要进行以下步骤：

1. 关闭 mysql 的服务
2. 在 cmd 下输入 `mysqld --skip-grant-tables` 启动服务器 光标不动 （不要关闭该窗口）
3. 重新打开一个新的 cmd，键入命令 `mysql -u root -p` ，输入密码的时候直接回车，没有校验
4. 到这里就已经可以进入数据库了，在修改自己的密码即可：
   - `use mysql;`
   - `update user set authentication_string=password('密码') where user='root' and Host='localhost';`

5. 密码修改完成后，关闭两个 cmd 窗口 在任务管理器结束 mysqld 进程，重启 mysql 进程就可以正常使用了



## 结构化语言

我们学习 mysql 关系型数据库，其实大多数都是在学习 sql 这门语言，sql 语言中划分了命令的类型，称之为结构化查询语言，他们主要分为：

| 命令             | 作用                                                         |
| ---------------- | ------------------------------------------------------------ |
| DDL 数据定义语言 | 操作的是表结构相关，例如 `CREATE` `ALTER` `MODIFY` `DROP`    |
| DML 数据操纵语言 | 操作表中具体的数据，例如 `INSER` `DELETE` `UPDATE` `TRUNCATE` |
| DQL 数据查询语言 | 负责查询相关的操作，例如 `SELECT` `SHOW`                     |
| DPL 事务处理语言 | 操作事务相关命令，例如 `BIGIN` `ROLLBACK` `COMMIT`           |
| DCL 数据控制语言 | 用于为用户设置权限的命令，例如 `GRANT` `REVOKE`              |



## 库级相关命令

命令不用死记硬背，用时过来找，随时作补充，熟能生巧

```mysql
-- 创建数据库，可选择的指定字符集
CREATE DATABASE [IF NOT EXISTS] `TEST` [CHARACTER SET utf8];

-- 删除数据库
DROP DATABASE [IF EXISTS] `TEST`;

-- 查询所有已创建的数据库
SHOW DATABASES;

-- 查看指定数据库创建命令
SHOW CREATE DATABASE `TEST`;

-- 修改数据库信息 ( 库名不可修改 )
ALTER DATABASE `TEST` [CHARACTER SET utf8];

-- 选择数据库
USE 库名; 
```

`TEST` 代表库名称，\` 被叫做 "飘号"，它适用于我们书写的标识符防止被识别为关键字

[ ] 中括号内的关键字为可选项：

- `CREATE DATABASE` 中的 `IF NOT EXISTS` 的作用是创建已存在的库时会防止报错
- `DROP DATABASE` 中的 `IF EXISTS` 的作用是删除不存在的库时会防止报错
- `CHARACTER SET` 表示的就是字符集了



## 表级相关命令

关于表的几个简单命令这里记一下：

~~~mysql
-- 创建表
CREATE TABLE 表名称(...);

-- 删除表
DROP TABLE 表名称;

-- 查询表结构
SHOW CREATE TABLE 表名称;

-- 复制一张表（仅数据）
CREATE TABLE 源表 SELECT * FROM 新表

-- 复制一张表（连同表结构，包括主键，约束等等）
CREATE TABLE 源表 LIKE 新表

-- 清空表中的数据
TRUNCATE TABLE `USER_COPY`;
~~~



> 创建简单表 

~~~mysql
CREATE TABLE `EMP` (
  `ID` INT(5),
  `NAME` VARCHAR(20)
);
~~~



### 各种数据类型

上面就是创建一张简单的数据表的 SQL 语句，`ID` 和 `NAME` 都是列的名称，后面跟着的 `INT` `VARCHAR` 就是数据类型，数据类型后面的括号代表的是长度，数据类型主要分为 **数值** **字符串** **日期时间** **枚举** 三种

> 数值类型

| 类型           | 大小   | 最大数量 / 长度      | 使用场景 / 描述 |
| :------------- | ------ | :------------------- | :-------------- |
| BIT            | 位数据 | 1~64                  | 小整数值        |
| TINYINT        | 1 字节 | 255                  | 小整数值        |
| SMALLINT       | 2 字节 | 65535                | 大整数值        |
| MEDIUMINT      | 3 字节 | 16777215             | 大整数值        |
| INT 或 INTEGER | 4 字节 | 2147483647           | 大整数值        |
| BIGINT         | 8 字节 | 18446744073709551615 | 极大整数值      |
| FLOAT          | 4 字节 |                      | 单精度 浮点数值 |
| DOUBLE         | 8 字节 |                      | 双精度 浮点数值 |
| DECIMAL        | (M, D) | 依赖于 M 和 D 的值   | 小数，适合金融计算 |


>字符串类型

| 类型       | 大小            | 用途                            |
| :--------- | :-------------- | :------------------------------ |
| CHAR       | 255 字节        | 定长字符串                      |
| VARCHAR    | 65535 字节      | 变长字符串                      |
| TINYBLOB   | 255 字节        | 不超过 255 个字符的二进制字符串 |
| TINYTEXT   | 255 字节        | 短文本字符串                    |
| BLOB       | 65535 字节      | 二进制形式的长文本数据          |
| TEXT       | 65535 字节      | 长文本数据                      |
| MEDIUMBLOB | 16777215 字节   | 二进制形式的中等长度文本数据    |
| MEDIUMTEXT | 16777215 字节   | 中等长度文本数据                |
| LONGBLOB   | 4294967295 字节 | 二进制形式的极大文本数据        |
| LONGTEXT   | 4294967295 字节 | 极大文本数据                    |

>日期时间类型

| 类型      | 大小   | 格式                | 用途                     |
| :-------- | :----- | :------------------ | :----------------------- |
| DATE      | 3 字节 | YYYY-MM-DD          | 日期值                   |
| TIME      | 3 字节 | HH:MM:SS            | 时间值或持续时间         |
| YEAR      | 1 字节 | YYYY                | 年份值                   |
| DATETIME  | 8 字节 | YYYY-MM-DD HH:MM:SS | 混合日期和时间值         |
| TIMESTAMP | 4 字节 | YYYYMMDD HHMMSS     | 混合日期和时间值，时间戳 |

> 选择类型

| 类型 | 用途                                        |
| ---- | ------------------------------------------- |
| ENUM | 只能使用一些特定的值，例如 ENUM('男', '女') |
| SET  | 如果说 ENUM 是单选，那么 SET 就是多选       |



> 根据了解到的数据类型完善一下表的结构

```mysql
CREATE TABLE `EMP`(
  `ID` INT(5),
  `DEPT_ID` INT(3),
  `NAME` VARCHAR(20),
  `AGE` INT(3),
  `IDENTITY` VARCHAR(18),
  `GENDER` ENUM('男', '女'),
  `CREATE_DATE` DATETIME,
  `MODIFY_DATE` DATETIME,
  `MONEY` DECIMAL(14, 2),
  `DESCRIPTION` TEXT
)
```



### 约束 Constraint

表的数据肯定不是想些什么就写什么，不然数据乱了表就没有存在的意义了，要让表变得有意义，我们需要在向表中添加数据的时候设计一些规则，例如不能留空，或者不能重复之类的，这个叫做 **约束**

> 约束大致分为五种

- 主键约束 `PRIMARY KEY`
  - 在表中是唯一的标识，通过主键列可以找到任何一行记录，**自带唯一和非空**
- 外键约束 `FOREIGN KEY`
  - 指本表中的某一列关联其他表中的某一列，所取的值必须在被约束的列中存在，约束与被约束的列的类型以及长度必须相同 ( 本人不推荐使用，因为阿里手册禁用外键约束 )

- 唯一约束 `  UNIQUE`
  - 该列不允许出现重复的数据，允许 NULL 值得存在，且允许多个 NULL
- 非空 `NOT NULL`
  - 该列不允许出现空值 NULL，但是空字符串 "" 可以
- 检查 `  CHECK`
  - 通过表达式判断来检查当前列是否符合要求的规则，该约束目前在 MySQL 中无效

> 约束的添加与查看

约束可以直接书写在类型的后面，叫做 **行级约束**，例如：

~~~mysql
CREATE TABLE `EMP`(
  `USER_ID` INT(5) PRIMARY KEY
)
~~~

也可以在表创建完成之后书写在最后面，叫做 **表级约束**，例如：

```mysql
CREATE TABLE `EMP`(
  `USER_ID` INT(5),
   PRIMARY KEY(`USER_ID`)
)
```

表结构创建完成后，我们想知道自己究竟创建了那些约束，这时候就可以用命令进行查看了

~~~mysql
SHOW INDEX FROM `EMP`
~~~



**注意：**

- 约束共有五种类型，分为表级约束和列级约束两种书写方式
- 表级约束不支持 `NOT NULL`，列级约束不支持 `FOREIGN KEY` 和 `CHECK`
- 个人建议使用 *表级约束*，使用表级约束的情况下查看所有关于约束的列可以直接看最后几行就一目了然了



> 有了这几个约束，我们在重新设计一下表结构

```mysql
-- 新建一张表用来测试外键约束（行级约束）
CREATE TABLE `DEPT`(
  `ID` INT(3) PRIMARY KEY,
  `NAME` VARCHAR(10) NOT NULL,
  `CREATE_TIME` DATETIME,
  `PHONE` VARCHAR(20) NOT NULL
)

-- 重新设置表添加约束（表级约束）
CREATE TABLE `EMP`(
  `ID` INT(5),
  `DEPT_ID` INT(3),
  `NAME` VARCHAR(20) NOT NULL,
  `AGE` INT(3) NOT NULL,
  `IDENTITY` VARCHAR(18),
  `GENDER` ENUM('男', '女'),
  `CREATE_DATE` DATETIME,
  `MODIFY_DATE` DATETIME,
  `MONEY` DECIMAL(14, 2),
  `DESCRIPTION` TEXT,
  PRIMARY KEY(`ID`),
  UNIQUE(`IDENTITY`),
  FOREIGN KEY(`DEPT_ID`) REFERENCES `DEPT`(`ID`)
)
```



### 列的各种属性

我们在创建表的时候，先是写列名称，然后是数据类型，然后是行级约束，最后写表级约束，列中除开这些之外，还有他本身自带的属性：

- 默认 `DEFAULT`
  - 向数据库中插入数据的时候，如果没有提供该列的数据，那么就是用这个默认值
- 注释 `COMMENT`
  - 注释是面向开发人员的，用来告诉开发人员这列代表什么意思，取值等等，表和列都可以使用
- 自增 `AUTO_INCREMENT`
  - 我们表中的主键列，当表中数据不多的时候可以选择使用自增，他会自动生成 1, 2, 3.... 的递增主键
- 更新 `ON UPDATE`
  - 表中最常见的两个字段就是创建时间以及修改时间，其中修改时间是随着每次修改都更新的，这里就可以使用该属性来完成这个操作
- 填充 `ZEROFILL`
  - 如果当前字段长度为10，但是值得长度并不够10位，想要补全10为就可以用该属性
- 无符号 `UNSIGNED`
  - 适用于数值类型，只能存储大于等于 0 的值，简单理解 无符号 ≈ 无负号



**关于自增的描述：**

1. *自增适用于数值类型且必须是主键的列，且一张表中只能有一个自增列*
2. 在 mysql 5.7 以及之前的版本，自增数据是暂存在内存中的，当重启 mysql 打开表后他会找到当前自增列的最大值开始继续自增，而 mysql 8 之后这个自增做了持久化
3. 当我们向数据库中插入数据时，只有在未指定自增列的值或者传的值为 NULL 值得时候，才会触发自增
4. 我们插入数据时为自增列 ( y ) 传了值 ( x ) 的情况下，如果 x > y 那么 x 就会作为新的自增值，否则不会变化
5. 当前自增值为 1，执行了一次插入失败之后，在执行一次会发现值是 3，在失败的时候自增列还是会变化的
6. 自增关于值得操作会在后面提到




> 根据掌握的属性在重新设计一次表结构

~~~mysql
-- 添加上一些属性用来测试
CREATE TABLE `DEPT`(
  `ID` INT(3) UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '部门ID',
  `NAME` VARCHAR(10) NOT NULL COMMENT '部门名称',
  `CREATE_TIME` DATETIME DEFAULT NOW() COMMENT '部门成立时间',
  `PHONE` VARCHAR(20) NOT NULL COMMENT '部门联系电话'
) COMMENT '部门表'

-- 添加上一些属性用来测试
CREATE TABLE `EMP`(
  `ID` INT(5) UNSIGNED AUTO_INCREMENT COMMENT '员工ID',
  `DEPT_ID` INT(3) UNSIGNED COMMENT '所在的部门ID',
  `NAME` VARCHAR(20) NOT NULL COMMENT '姓名',
  `AGE` INT(3) NOT NULL COMMENT '员工年龄',
  `IDENTITY` VARCHAR(18) COMMENT '身份证号码',
  `GENDER` ENUM('男', '女') DEFAULT '男' COMMENT '性别',
  `CREATE_DATE` DATETIME DEFAULT NOW() COMMENT '创建时间',
  `MODIFY_DATE` DATETIME DEFAULT NOW() ON UPDATE NOW() COMMENT '修改时间',
  `MONEY` DECIMAL(14, 2) COMMENT '月薪',
  `DESCRIPTION` TEXT COMMENT '个人描述',
  PRIMARY KEY(`ID`),
  UNIQUE(`IDENTITY`),
  FOREIGN KEY(`DEPT_ID`) REFERENCES `DEPT`(`ID`)
) COMMENT '员工表'
~~~



### 修改已创建的表

上面每次做一写更新都会重新撰写建表语句，如果在项目已经上线的情况下，表中会有大量的数据，频繁的重建很浪费事件，所以我们需要学习修改已创建的表

重新创建一个测试表用来练习：

~~~mysql
CREATE TABLE `USER`(
  `ID` INT(3) AUTO_INCREMENT COMMENT '用户ID',
  `NAME` VARCHAR(10) NOT NULL COMMENT '昵称',
  `USER_ID` VARCHAR(20) COMMENT '账号',
  `PASSWORD` VARCHAR(20) COMMENT '密码'
) COMMENT '用户表'
~~~

> 表级修改

~~~mysql
-- 修改表的名称
rename table `USER` TO `T_USER`;
~~~

> 列级修改

~~~mysql
-- ADD：新增一个列
ALTER TABLE `T_USER` ADD `SEX` ENUM ('男', '女');

-- MODIFY：修改列的信息，新的列会直接覆盖旧的列，所以请将属性写全不然会丢失
ALTER TABLE `T_USER` MODIFY `SEX` ENUM ('男', '女') DEFAULT '男';

-- CHANGE：修改列以及列名，新的列会直接覆盖旧的列，所以请将属性写全不然会丢失
ALTER TABLE `T_USER` CHANGE `SEX` `GENDER` ENUM ('男', '女') COMMENT '性别';

-- 删除某个列
ALTER TABLE `T_USER` DROP `GENDER`;
~~~

>约束修改

~~~mysql
-- 新建表用来测试约束
CREATE TABLE `TEST` (
  `ID` INT(5),
  `UUID` INT(3) UNSIGNED,
  `NAME` VARCHAR(10)
) COMMENT '测试约束'

-- 在列上添加约束
ALTER TABLE `TEST` ADD PRIMARY KEY(`ID`)
ALTER TABLE `TEST` ADD FOREIGN KEY(`UUID`) REFERENCES `DEPT`(`ID`)  -- 无意义 为了测试
ALTER TABLE `TEST` ADD UNIQUE(`NAME`)

# 在列上移除某个约束
#   想要删除约束，首先我们需要知道约束名称，查看一下表结构：SHOW CREATE TABLE `TEST`
#   在表结构中可以看到约束对应的名称，然后通过名称完成删除约束

-- 删除外键约束，FOREIGN KEY 后面跟上约束名称
ALTER TABLE `TEST` DROP FOREIGN KEY `test_ibfk_1`

-- 删除唯一约束，INDEX 后面跟上约束名称
ALTER TABLE `TEST` DROP INDEX `NAME`;

-- 删除主键约束，会删除表中所有主键(必须)，无需名称
ALTER TABLE `TEST` DROP PRIMARY KEY;
~~~

> 自增修改

~~~mysql
-- 重置自增值：要求当前表中数据为空或者当前表的自增列的最大值小于你要设置的值
ALTER TABLE `123` AUTO_INCREMENT = 1;
-- 修改自增的步长，属于全局修改，会在所有库所有表中生效
SET @@auto_increment_increment=2;
~~~



### 扩展：三大范式

我们在书写一个程序的时候，设计数据库往往是最重要的一个环节，一个程序中的所有业务逻辑都是围绕着数据进行操作的，表结构设计的好程序写起来就省力一些，相反表结构设计的不好，程序写起来就比较麻烦，所以建议我们在设计数据库的时候参照一下数据库设计**三大范式**

> 第一范式：原子性

|   员工ID   | 员工姓名 |  部门职位  | 员工薪资 |
| :--------: | :------: | :--------: | :------: |
| 4163545354 |  王富贵  | 技术部开发 |   8000   |

第一范式通俗来说就是表中的*每列都不可再分*，类似上面这张员工表，其中的 `部门职位` 可以进行拆分为 `部门` 和 `职位` 两列，违反了第一范式，应该按照下面的格式进行设计：

|   员工ID ( 主键 )   | 员工姓名 |  部门  | 职位 | 员工薪资 |
| :--------: | :-----: | :--: | :--: | :----: |
| 4163545354 |  王富贵  | 技术部 | 开发 |   8000   |



> 第二范式：完整性

一张表一般只有一个主键列用来区分每一行，但是有的表会使用到联合主键，第二范式就是要求*所有列都要与主键列相关而不是和部分主键相关*，例如下面张成绩表：

| 学生 ID ( 主键1 ) | 课程 ID ( 主键2 ) |         课程名称         | 分数 |
| :---------------: | :---------------: | :----------------------: | :--: |
|    31718040101    |       82001       | 《Java高级从入门到入坟》 |  82  |

课程名称仅仅和课程 ID 有关系，与学生 ID 没有关系，这就违反了第二范式，应该将课程名称放到课程表中。



> 第三范式：直接关系

第三范式可以理解为*表中的每个字段都应该与主键有直接关系，而不是间接关系，*例如这张博客表中的分类名称就违反了第三范式，他应该是通过分类 ID 查出来的信息，不应该直接写到博客表中，应该写到分类表中

| 博客 ID ( 主键 ) | 分类 ID | 分类名称 |   博客标题   | 博客内容                     |
| :--------------: | :-----: | :------: | :----------: | :--------------------------- |
|    B348500012    |    2    |   知识   | Java入门教程 | Java是面向对象的高级语言.... |



- 第三范式和第二范式很相像，第二范式是针对联合主键的，而第三范式是针对当前表和唯一主键的。
- 三大范式仅仅是一个规范，起到参考作用，但是在真实项目中要按照实际业务进行设计



## 数据的增删改查

### 简单练习CRUD

创建一张新的表用来进行测试：

~~~mysql
CREATE TABLE `USER`(
  `ID` INT(3) AUTO_INCREMENT COMMENT '主键列',
  `USERID` VARCHAR(15) NOT NULL COMMENT '用户账号',
  `USERNAME` VARCHAR(15) NOT NULL COMMENT '用户昵称',
  `PASSWORD` VARCHAR(15) NOT NULL COMMENT '用户密码',
  `ADDRESS` VARCHAR(128) COMMENT '家庭住址',
  `PHONE` CHAR(11) COMMENT '联系电话',
  PRIMARY KEY(`ID`),
  UNIQUE(`USERID`),
  UNIQUE(`PHONE`)
) COMMENT '用户表'
~~~



表肯定是要来记性数据存储的，那么肯定就要有对数据的操作了，这里简单联系一下增删改查：

> 插入：INSERT

`INSERT` 代表插入，`INTO ` 插入到 `USER` 表，`VALUES` 代表插入的具体的值

~~~mysql
-- 全字段插入 INSERT INTO 表名 VALUES(值1，值2...)
INSERT INTO `USER` VALUES(NULL, 'zhang', '张三', 'san', '中国大陆广西省', '18888888888');

-- 按需插入 INSERT INTO 表名(字段1，字段2) VALUES(值1，值2)
INSERT INTO `USER`(`USERID`, `USERNAME`, `PASSWORD`, `PHONE`)
  VALUES('wang', '王富贵', 'fugui', '13344445555')
  
-- 批量插入  ...VALUES(值1，值2), (值1，值2), (值1，值2)...
INSERT INTO `USER`(`USERID`, `USERNAME`, `PASSWORD`, `PHONE`) VALUES
  ('123', '123', '123', '13000000001'),
  ('456', '456', '456', '13000000002'),
  ('789', '789', '789', '13000000003')
~~~

> 查询：SELECT

`SELECT` 代表查询 `*` 所有字段的值，`FROM` 从 `USER` 表中进行查询，`AS` 代表别名，`WHERE` 代表过滤

~~~mysql
-- 查询所有数据
SELECT * FROM `USER`

-- 查询昵称和手机号
SELECT `USERNAME`, `PHONE` FROM `USER`

-- 查询当前表的昵称和手机号且显示中文表头
SELECT `USERNAME` AS '昵称', `PHONE` AS '联系电话' FROM `USER`

-- 查询ID为1的昵称和手机号
SELECT `USERNAME` AS '昵称', `PHONE` AS '联系电话' FROM `USER` WHERE ID = 1
~~~

> 更新：UPDATE

`UPDATE` 修改 `USER` 表中的 `set` 账号为 zhao，昵称为赵处长，`WHERE` 要求修改制定的行

~~~mysql
-- 修改数据，如果不加后面的 WHERE 就会将所有行都修改
UPDATE `USER` SET `USERID` = 'zhao', `USERNAME` = '赵处长' WHERE `ID` = 3
~~~

> 删除：DELETE

`DELETE` 删除数据 `FROM` 在 `USER` 表中，要求删除制定的行

~~~mysql
-- 删除数据，如果不加后面的 WHERE 就会全部删除，谨慎使用
DELETE FROM `USER` WHERE `ID` = 5
~~~



### WHERE条件与运算符

> 运算符

1. 基本运算符：
   - 【大于 >】【小于 <】【等于 =】【大于等于 >=】【小于等于 <=】【不等于【<> 或者 != 】】

2. 逻辑运算符：
   - 【与 AND】【或 OR】【非 NOT】

3. 特殊运算符
   - 是否为空：【IS NULL】【IS NOT NULL】
   - 包含以下任意一个值：IN ( 值，值，值 )
     - 在 `IN` 的括号中不仅可以书写特定的值，也可以查询列作为参数，被称为子表查询
   - 满足在指定的区间内：`BETWEEN 最小值 AND 最大值`;



> WHERE 条件语句

之前在简单 CRUD 练习中使用到了 WHERE 说是过滤关键字，严格来说叫做条件语句，通过他来筛选出符合条件的数据记性操作，可以配合运算符进行操作

~~~mysql
-- 查询ID为1的用户
SELECT * FROM USER WHERE `ID` = 1

-- 查询ID小于等于3的用户
SELECT * FROM USER WHERE `ID` <= 3

-- 查询昵称不等于赵处长的用户
SELECT * FROM USER WHERE `USERNAME` != '赵处长'

-- 查询ID小于3并且地址不为空的人
SELECT * FROM USER WHERE `ID` < 3 AND `ADDRESS` IS NOT NULL

-- 查询ID为1,3,4的用户
SELECT * FROM USER WHERE `ID` = 1 OR `ID` = 3 OR `ID` = 4
SELECT * FROM USER WHERE `ID` IN (1, 3, 4)

-- 查询ID大于1且小于4的用户
SELECT * FROM USER WHERE `ID` > 1 AND `ID` < 4
SELECT * FROM USER WHERE `ID` BETWEEN 2 AND 3

-- 查询住址为空的所有用户
SELECT * FROM USER WHERE `ADDRESS` IS NULL
~~~



### 排序与分页

为了更好的测试，我们需要重构一下表结构

~~~mysql
ALTER TABLE `USER` DROP COLUMN `USERID`;
ALTER TABLE `USER` ADD `AGE` INT(3) COMMENT '年龄';
ALTER TABLE `USER` ADD `SALARY` INT(6) COMMENT '薪水';
ALTER TABLE `USER` ADD `LOGIN_TIME` DATETIME COMMENT '最后一次登录时间';

INSERT INTO `USER` VALUES
  (NULL, '丁聪华', 'flsajawei', '桂林路', '13000000001', 23, 4500, '2020-09-16 17:21:04'),
  (NULL, '孙蝶妃', 'svckpwok', '桂林西街', '13000000002', 23, 4500, '2020-10-16 17:21:04'),
  (NULL, '许娇翔', 's;lvkowi', '徐汇区', '13000000003', 23, 4500, '2020-10-13 17:21:04'),
  (NULL, '崔子希', 'x;clkgow', '浦东区', '13000000004', 23, 4500, '2020-08-14 17:21:04'),
  (NULL, '樊瑶芳', 'vmlawmrg', '虹鹰大厦', '13000000005', 23, 4500, '2020-05-30 17:21:04'),
  (NULL, '阮恭琴', 'm[xmvoerw', '万泰国际', '13000000006', 23, 4500, '2018-06-12 17:21:04'),
  (NULL, '姚道益', 'xbmeragb', '徐汇区', '13000000007', 23, 4500, '2020-01-10 17:21:04'),
  (NULL, '朱咏娴', 'breyhdh', '桂林西街', '13000000008', 23, 4500, '2020-03-08 17:21:04'),
  (NULL, '郭秀晶', 'Zbagewhbv', '桂林西街', '13000000009', 23, 4500, '2019-04-21 17:21:04'),
  (NULL, '戴敏', 'ahbwerhb', '万泰国际', '13000000010', 23, 4500, '2019-12-21 17:21:04'),
  (NULL, '马庆炳', 'xczber', '桂林路', '13000000011', 23, 4500, '2020-06-29 17:21:04'),
  (NULL, '伍兆斌', 'ryehrz', '桂林西街', '13000000012', 23, 4500, '2019-12-25 17:21:04'),
  (NULL, '张滕龙', 'surtjfg', '虹鹰大厦', '13000000013', 23, 4500, '2019-09-21 17:21:04')
~~~





### 分组与分组函数





## 常用函数记录





## 多表链接查询





## MySQL的事务







## 视图与索引





## 用户权限管理

