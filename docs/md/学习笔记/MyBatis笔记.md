# MyBatis 笔记

MyBatis 是基于 Java 语言的开源的持久层框架，利用实体类和数据表之间产生了关联，通过映射文件中的 sql 语句对数据库进行操作

使用 maven 创建工程需要导入 `mybatis` 的依赖：

~~~xml
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.5</version>
</dependency>
~~~



## 简单实例演示

mybatis的持久层开发有两种方式，一种是原始的 dao 开发，比较繁琐，还有一种是基于接口的 JDK 动态代理开发，也是最普遍的一种开发模式

### 原始dao开发模式

**使用原始 dao 开发模式，首先第一步： 创建 mybatis 的核心配置文件，一般取名为** `mybatis-config.xml`

> 在dataSource标签中配置数据库连接，在mapper标签中配置xml映射文件目录，然后去书写xml映射文件

~~~xml
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql:///test"/>
                <property name="username" value="root"/>
                <property name="password" value="zhang"/>
            </dataSource>
        </environment>
    </environments>
    <mappers>
        <mapper resource="mapper/beanMapper.xml"/>
    </mappers>
</configuration>
~~~

**第二步：在上面的映射文件目录对应的位置创建文件**

> mapper 标签的 namespace 属性自定义书写，select 标签的 id 不能与其他 id 重复，resultType 是和数据库表对应的实体类的全限定路径名，实体类仅仅只有和表中字段对应的属性及 get set toString 方法而已

~~~xml
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="test1">
    <select id="findAll" resultType="club.hanzhe.bean.Bean">
        select * from test1
    </select>
</mapper>
~~~

**第三步：创建dao类，通过dao接口类来操作 mapper 文件中的增删改查**

> dao类想要操作mapper文件需要使用工厂对象，工厂对象暂时就不在这里创建了，由调用者给他对象让他使用就行
>
> 操作mapper文件需要使用mapper文件的 ==namespace.标签id==，例如 ==test1.findAll==

```java
public class BeanDao {
    private SqlSessionFactory factory ;
    public BeanDao( SqlSessionFactory factory ){
        this.factory = factory;
    }
    public List<Bean> findAll(){
        SqlSession sqlSession = factory.openSession();
        List<Bean> list = sqlSession.selectList("test1.findAll");
        return list;
    }
}
```

**第四步：创建测试类，对写好的代码进行测试**

> 因为调用一个dao都会使用一个工厂对象，所以这里就直接创建一个供所有dao使用，节省资源

```java
public class AppTest {
    private static InputStream is = null;
    private static SqlSessionFactory factory = null;
    @Before
    public void before(){
        try {
            is = Resources.getResourceAsStream("mybatis-config.xml");
        } catch (Exception e) {
            System.out.println("获取配置文件失败！");
        }
        factory = new SqlSessionFactoryBuilder().build(is);
    }
    @Test
    public void tes1(){
        BeanDao dao = new BeanDao(factory);
        List<Bean> list = dao.findAll();
        for (Bean bean : list)
            System.out.println(bean);
    }
}
```



### 基于接口的动态代理开发

**使用动态代理开发模式，首先第一步： 创建 mybatis 的核心配置文件，一般取名为 `mybatis-config.xml`**

> 这里和 dao 开发的配置文件一模一样，可以去上面 copy

**第二步：在上面的映射文件目录对应的位置创建映射文件**

> 这里和上面几乎一模一样，但是动态代理的 mapper 的 namespace 指向的必须是接口的全限定名称

~~~xml
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="club.hanzhe.dao.BeanDao">
    <select id="findAll" resultType="club.hanzhe.bean.Bean">
        select * from test1
    </select>
</mapper>
~~~

**第三步：按照上面映射文件目录创建接口**

> 这里和上面不同的是不需要太多繁琐的结构，只需要创建一个方法即可对应mapper中的增删改查，但是需要注意一点：==接口方法名必须和mapper的CRUD标签id一致，否则会报错==

~~~java
public interface BeanDao {
    List<Bean> findAll();
}
~~~

**第四步：创建测试类，对写好的代码进行测试**

~~~java
public class TestDemo {
    private SqlSessionFactory factory = null;
    @Before
    public void before(){
        InputStream is = null;
        try {
            is = Resources.getResourceAsStream("mybatis-config.xml");
        }catch (Exception e){
            System.out.println("加载核心配置文件失败");
            System.exit(0);
        }
        this.factory = new SqlSessionFactoryBuilder().build(is);
    }
    @Test
    public void test1(){
        SqlSession session = factory.openSession();
        BeanDao mapper = session.getMapper(BeanDao.class);
        List<Bean> list = mapper.findAll();
        for (Bean bean : list)
            System.out.println(bean);
    }
}
~~~

<font color="red">注意：</font>在 openSession 的时候是可以传入一个 boolean 参数的，如果不传参数默认为 false，如果要执行 DML 语句进行增删改的话，一定要传入 true 做为参数，否则他不会自动提交 ( 你可以手动提交 )，查询无需提交所以不需要设置

## Mybatis 的核心配置文件

mybatis 的核心配置文件，一般都起名为 `mybatis-config.xml` 或者是 `sqlMapConfig.xml` ，在核心配置文件中可以通过某些标签对 mybatis 进行一些配置

==注意：mybatis 的核心配置文件内不可以书写中文注释 (英文或数字可以)，否则报错==

mybatis 提供了很多标签进行配置，但是这些标签也有着先后顺序，如果标签不按顺序书写也是会报错的

- configuration（配置文件的根标签）
  + properties（属性)
  + settings（设置)
  + typeAliases（类型别名)
  + typeHandlers（类型处理器)
  + objectFactory（对象工厂)
  + plugins（插件)
  + environments（环境配置）
    + environment（环境变量）
      + transactionManager（事务管理器）
      + dataSource（数据源）
  + databaseIdProvider（数据库厂商标识)
  + mappers（映射器）

上面来自 mybatis 官方文档，这里会挑常用的标签进行笔记

### Environments 环境配置

#### 1. 环境的选择

在 mybatis 配置文件中使用 `environments` 标签配置环境，在他下面可以有一个或多个 `environment` 子标签，每个都代表一个环境，然后在 `environments` 标签中使用 default 属性对环境进行选择

>这里使用 default 对环境进行选择，目前选择的是MySQL的环境

```xml
<environments default="mysql">
    <environment id="mysql">
        这是MySQL的环境
    </environment>
    <environment id="oracle">
        这是oracle的环境
    </environment>
</environments>
```

除开配置文件内的默认环境，也可以在打开<font color="red">打开会话工厂的时候传入指定环境的id进行选择环境</font>

~~~java
SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(is, "mysql");
~~~

**注意： 尽管可以配置多个环境，但每个 SqlSessionFactory 实例只能选择一种环境。**

#### 2. 事务管理器

在每个 `environment` 子标签环境中有 `transactionManager` 标签的 type 属性可以对 SQL 进行事务控制管理，管理事务的管理器有两种：【 JDBC 】【 MANAGED 】

| 事务管理器 | 说明                                                         |
| ---------- | ------------------------------------------------------------ |
| JDBC       | 直接使用了 JDBC 的提交和回滚设置，它依赖于从数据源得到的连接来管理事务作用域。 |
| MANAGED    | 什么都不做，让容器来管理事务的整个生命周期，不建议使用       |

建议使用 JDBC 来管理事务

~~~xml
<environment id="mysql">
    <transactionManager type="JDBC"/>
</environment>
~~~

#### 3. 数据源

数据源是配置 mybatis 和数据库进行连接的相关配置，他由 `environment` 标签下的 `dataSource` 标签进行设置

通过 `dataSource` 标签的 type 属性可以选择数据源类型：

| 类型     | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| UNPOOLED | 只是每次被请求时打开和关闭连接，反应较慢，适用于简单小型项目 |
| POOLED   | 相对于UNPOOLED相比使用了 数据库连接池 的感念                 |
| JNDI     | 能在如 EJB 或应用服务器这类容器中使用                        |

数据源最基本的四个属性：

- 【driver】 数据库连接驱动类
- 【url】 数据库链接地址
- 【username】 用户名
- 【password】 密码



**最常见的 `environments` 标签配置**

~~~xml
<environments default="development">
    <environment id="development">
        <transactionManager type="JDBC"/>
        <dataSource type="POOLED">
            <property name="driver" value="com.mysql.jdbc.Driver"/>
            <property name="url" value="jdbc:mysql:///test"/>
            <property name="username" value="root"/>
            <property name="password" value="******"/>
        </dataSource>
    </environment>
</environments>
~~~



### Mappers 映射标签

书写的 mapper 文件需要被映射到核心配置文件中，映射的标签就是 `mappers` ，他下面有两个子标签，分别是 `mapper` 和 `package` 映射方法如下：

**1. 映射的文件在resources目录下**

~~~xml
<mappers>
    <!-- 映射单个文件 -->
    <mapper resource="beanMapper.xml"/>>
    <!-- 使用 * 通配符映射多个文件 -->
    <mapper resource="*Mapper.xml"/>
</mappers>
~~~

**2. 映射的文件在dao包下**

> 当 mapper 文件在 dao 包下的时，mapper 和接口必须是同名的，或者在 resources 目录下有着同级的目录

~~~xml
<mappers>
    <!-- 映射单个文件 -->
    <mapper class="club.hanzhe.dao.BeanDao" />
    <!-- 映射多个文件 -->
    <package name="club.hanzhe.dao"/>
</mappers>
~~~

**3. 接口注解开发**

~~~xml
<mappers>
    <package name="club.hanzhe.dao"/>
</mappers>
~~~

注意！当mapper文件在dao包下的时候，需要在maven的pom文件中添加如下代码，否则xml文件可能不会被打包发布

~~~xml
<build>
    <resources>
        <resource>
            <directory>src/main/resources</directory>
            <includes>
                <include>**/*.properties</include>
                <include>**/*.xml</include>
            </includes>
            <filtering>true</filtering>
        </resource>
        <resource>
            <directory>src/main/java</directory>
            <includes>
                <include>**/*.properties</include>
                <include>**/*.xml</include>
            </includes>
            <filtering>true</filtering>
        </resource>
    </resources>
</build>
~~~



### Properties 属性

我们在使用传统 JDBC 的时候都会把 driver，url 等等放在一个 propertis 后缀的文件中，这样可以降低代码的耦合性，方便环境切换，mybatis 中也支持这种做法，使用 `properties` 标签就可以实现

**1. 手写 properties 配置文件**

~~~properties
driver=com.mysql.jdbc.Driver
url=jdbc:mysql://127.0.0.1/库名
username=root
password=*****
~~~

**2. 使用 properties 标签将配置文件引入进来**

~~~xml
<!-- 使用该标签将配置文件引入进来，然后就可以使用 ${} 符号来调用配置文件内的值了 -->
<properties resource="db.properties" />
<!-- 例如： -->
<property name="driver" value="${driver}">
~~~



### TypeAliases 别名

在我们的 mapper 映射文件中，CRUD 标签中的参数，返回结果 resultType 通常都是全限定名，例如：

~~~xml
<select id="findAll" resultType="club.hanzhe.bean.Bean"></select>
~~~

这个时候我们就可以使用 `typeAliases` 标签下的 `typeAlias` 子标签==配置类别名==，可以简化全限定名书写格式

> abc就是这个类的类别名，就可以在映射文件中使用了

~~~xml
<typeAliases>
    <typeAlias type="club.hanzhe.bean.Bean" alias="abc" />
</typeAliases>

<select id="findAll" resultType="abc"></select>
~~~

>`typeAlias` 标签中的 alias 属性也可以忽略不写，默认已类名作为别名 (别名首字母小写即可)

~~~xml
<typeAliases>
    <typeAlias type="club.hanzhe.bean.Bean" />
</typeAliases>

<select id="findAll" resultType="bean"></select>
~~~

但如果是个较大的项目，表和实体类比较多，如果逐个实体类配置的话会很麻烦，这时可以使用 `package` 子标签

> 将指定包下的所有类全部配置别名，别名为类本身名字 (首字母小写)

~~~xml
<typeAliases>
    <package name="club.hanzhe.bean" />
</typeAliases>

<select id="findAll" resultType="bean"></select>
~~~



### Settings 全局设置

在 mybatis 中可以对全局进行一些设置，设置需要用 `settings` 下的 `setting` 子标签实现，格式体现为：

```xml
<settings>
  <setting name="设置名称" value="对应参数值"/>
</settings>
```

常用的设置有：

| 设置名                   | 作用描述                                       | 参数       |
| ------------------------ | ---------------------------------------------- | ---------- |
| cacheEnabled             | 设置全局缓存的开启和关闭                       | boolean    |
| defaultStatementTimeout  | 设置超时时间，它决定驱动等待数据库响应的秒数。 | 任意正整数 |
| mapUnderscoreToCamelCase | 是否开启驼峰命名规则                           | boolean    |
| logImpl                  | 配置日志信息，个人推荐使用 STDOUT_LOGGING 日志 | @官方文档  |



## Mapper 映射文件

mapper 映射文件，用来负责和数据库交互的 sql 代码，主要是增删改查四个标签为主：

### 增删改标签

增删改标签是用来书写插入 sql 的标签，比较常用的几个属性如下：

~~~xml
<insert
	id="addBean"
	parameterType="club.hanzhe.bean"
	flushCache="true"
	timeout="20">
~~~

| 属性          | 作用                                                         |
| ------------- | ------------------------------------------------------------ |
| id            | 用来作为标签的标识符，使用id可以直接找到当前标签调用         |
| parameterType | 接受的参数的类型，如果参数类型是集合，那么就填集合内元素的类型 |
| flushCache    | 增删改标签默认设置为true，只要语句被调用，就会清空本地和二级缓存 |
| timeout       | 抛出异常之前，驱动程序等待响应的时间，默认为空值             |



### 查询标签

select 标签是用来专门书写查询语句的标签，比较常用的几个属性如下：

~~~xml
<select
    id="selectPerson"
    parameterType="int"
    resultType="hashmap"
    resultMap="personResultMap"
    flushCache="false"
    useCache="true"
    timeout="10"
    fetchSize="256"
    statementType="PREPARED"
    resultSetType="FORWARD_ONLY">
~~~

除开增删改相同的属性之外，查询有着自己的属性

| 属性       | 作用                                                         |
| ---------- | ------------------------------------------------------------ |
| resultType | 用来设置查询返回的数据对应的实体类                           |
| resultMap  | 属于高级的parameterType，他可以手动配置实体类属性和数据库字段的映射 |
| useCache   | select 默认为 true，执行查询后将查询结果缓存在二级缓存中     |



### 添加时返回 ID

这里记一个十分好用的小功能，当我们执行 insert 之后，想要立刻操作这行记录，但是他的主键是自增的，我们想要操作他需要获取他的 ID，这个时候我们可以通过属性设置回显 ID

假设当前有一个 bean，属性为 userid，username，password

~~~xml
<!-- useGeneratedKeys="true" 取出数据库内自动生成的主键 -->
<!-- keyProperty="userid" 将主键设置在 bean 中的某个属性上 -->
<insert id="addUser" parameterType="user" useGeneratedKeys="true"keyProperty="userid">
	insert into t_user values(#{username}, #{password})
</insert>
~~~

~~~java
@Test
public void test(){
    User user = new User();
    user.setUsername("张");
    user.setPassword("123");
    userDao.addUser(user);
    // 当我们执行插入语句后，如果正常运行，那么userid就会成功赋值
    System.out.println(user.getUserid());
}
~~~



### SQL 代码片段

可以被用来定义可重用的 SQL 代码段，例如：

> 定义了 id 为 t_user 的 sql 代码片段，在下面的增删改查中就可以使用 `include` 来调用了

~~~xml
<sql id="t_user">userid, username, usersex, usertel</sql>

<select id="selectAll" resultType="user">
    SELECT <include refid="t_user" /> FROM t_user
</select>
~~~



### ${ } 和 #{ } 的区别

${ }和#{ }他们都是用来接收传入参数的，只不过有些细节需要留意，假设现在有一行SQL语句：

~~~sql
select * from t_user where userid = 1;
~~~

其中作为查询条件的 1 是需要接收传入参数的，那么获取到传入参数有两种方法：

- ${ }，拼接SQL字符串
- #{ }，作为SQL占位符

如果使用 ${} 的话，通过日志可以看到，它以拼接字符串的方式执行，这样的话就很容易收到SQL注入的攻击

~~~sql
select * from t_user where userid = 1;
~~~

但是如果使用 #{} 的话，他是将 SQL 代码预处理之后在执行之前进行参数替换，传入的参数都将作为普通参数对待，通过执行日志就可以看到：

~~~sql
select * from t_user where userid = ? ;
~~~

这是二者最明显的差距，通过占位符可以有效防止SQL注入攻击，推荐使用#{ }



### ResultMap 标签

一般使用 resultType 返回对象的时候，是数据库自动检测实体类中和字段匹配的属性进行封装，但是如果实体类中的属性和表中的字段截然不同的话，就需要手动配置他们之间的映射关系了

~~~xml
<!-- 
  id：为当前标签的命名，会在select标签中的返回类型中用到
  type：为返回的主类的类型，Student中包含Score类型的变量，所以Sutdent是主类
  extends：继承，将指定的resultMap的id作为值放在这里，会继承之前书写的映射
  autoMapper：为其他属性自动匹配的开关，默认为false关闭状态
   为false时，只有手动配置的映射会匹配成功，未设置的为null值
   为true时，将按照手动配置的进行匹配，没有手动配置的会自动按照变量名匹配
-->
<resultMap id="map1" type="club.hanzhe.pojo.U_T">
    <!--
       id标签为设置当前主类与数据表中对应表的主键的匹配
       column：数据表中的字段
       property：与该字段对应的本类中的属性
     -->
    <id column="rowNo" property="rowNo" />
    <!--
   result标签为设置当前主类与数据表中对应表的其他字段的匹配
   column：数据表中的字段
   property：与该字段对应的本类中的属性
  -->
    <result column="u_id" property="userid" />
    <!--
   association标签为设置当前主类中映射的其他类
   property：类中的属性
   javaType：属性所对应的那个类的全限定名，可以使用别名
   autoMapping：自动匹配表中的其他字段和类中的属性
  -->
    <association property="tel" javaType="club.hanzhe.pojo.Tel">
        <id column="t_id" property="telid" />
    </association>
    <!--
   collection用来映射集合，多用于一对多查询 
   与association的唯一差别就是javaType变成了ofType 
  -->
    <collection property="tel" ofType="club.hanzhe.pojo.Tel">
        <id column="t_id" property="telid" />
    </collection>
</resultMap>
~~~





### 动态 SQL

通过传入的参数对 sql 进行灵活化使用，类似 Java 一样，通过 判断循环 来控制 SQL 的最终执行

> if 判断标签

如果接收的username参数不为空的话，就追加当前标签内的sql语句

~~~xml
<select id="findBean" resultType="bean">
    select * from test
    <if test="id != null and id != ''">
        where id = #{id}
    </if>
</select>
~~~

> where 过滤标签

使用 where 标签之后，如果 where 内有符合 if 条件的会自动添加 where 关键字，如果没有符合的就不添加

如果有多个 if 符合条件，需要在前面加上 and 或者 or 等判断条件，如果是第一个成立的条件会默认省略前面的 and 或 or，后续的会添加

~~~xml
<select id="findUser" resultType="user">
    select * from t_user
    <where>
        <if test="userid != null">
            and userid = #{userid }
        </if>
        <if test="username != null">
            and username like #{username }
        </if>
        <if test="usersex != null">
            and usersex = #{usersex }
        </if>
        <if test="usertel!= null">
            and usertel = #{usertel }
        </if>
    </where>
</select>
~~~

> choose 标签

choose 标签有着和 switch 类似的功能，他要求当前判断至少成立一个才可以结束，如果没有成立的会执行otherwise

~~~xml
<choose>
    <when test=""></when>
    <when test=""></when>
    <otherwise></otherwise>
</choose>
~~~

> set 标签

使用 set 标签之后，如果 set 内有符合 if 条件的会自动添加 set 关键字，如果没有符合的就不添加，需要注意一点的是，==set → if 内的 sql 结尾一定要带上逗号==，系统会自动省略但不会自动追加。

~~~xml
<update id="updateUser" parameterType="user" >
    update t_user
    <set>
        <if test="username != null and username != ''">
            username = #{username },
        </if>
        <if test="usersex != null and usersex != ''">
            usersex = #{usersex },
        </if>
        <if test="usertel != null and usertel != ''">
            usertel = #{usertel },
        </if>
    </set>
    where userid = #{userid }
</update>
~~~

> foreach 标签

foreach 标签用来遍历传进来的集合或数组容器，多用于批量删除操作，里面的属性解释如下：

~~~xml
<delete id="find1">
	delete from bean where id in
	<foreach collection="list" open="(" close=")" separator=", " item="i">
		#{ i }
	</foreach>
</delete>
~~~

- collection：传进来被遍历的那个容器的名字，可以是数组或集合
- open：循环开始前需要添加的前缀
- close：循环结束后需要添加的后置
- separator：每循环一次时需要在中间添加的分隔符
- item：被循环出来的每个字段，在标签内直接使用即可



### cache 缓存标签

##### 一级缓存

在 mybatis 中<font color="red">一级缓存</font>是默认开启的，在进行 openSession 的时候就自动打开了一级缓存，且对于一级缓存的操作，只能清空，不能禁用，<font color="red">一级缓存的作用范围是当前的 SqlSession 实例</font>

> 在同一个 SqlSession 实例中，两次同样的查询返回的结果是一致的，但是如果是两个SqlSession那么进行相同的查询结果就会不同，这里就不写了

```java
public void test4(){
    SqlSession session = this.factory.openSession(true);
    BeanDao mapper = session.getMapper(BeanDao.class);
    Bean bean1 = mapper.findById(7844);
    Bean bean2 = mapper.findById(7844);
    System.out.println(bean1 == bean2);
}
```



##### 二级缓存

二级缓存的范围是基于当前的 mapper.xml 配置文件的 mapper 标签，也就是当前的 namespace 下，一个二级缓存可以横跨多个一级缓存，而二级缓存默认是关闭的，开启二级缓存的方法就是==使用 cache标签==

> 没错，只要在 mapper 下面加上这么一句代码，二级缓存就开启完成了，简单粗暴

~~~xml
<cache />
~~~

在开启二级缓存后还不能立刻使用，会报错，==需要让该 mapper 相关的所有 bean 实现 Serializable 序列化接口==



## Mybatis 注解开发

### CRUD 注解

在 mybatis 中也可以不使用 mapper 映射文件，改为使用注解开发，分别相对着增删改查四个注解

~~~java
@Insert("insert into t_user values(null,#{name},#{sex},#{address})")
public int saveUser(User user);

@Delete("DELETE FROM t_user WHERE u_id = #{abc}")
public int removeUser(Integer id);

@Update("update t_user set u_address=#{address} where u_name = #{name}")
public int updateUser(User user);

@Select("select * from t_user where u_id = #{abc}")
public User findUserById( Integer id );
~~~

注意！使用 mapper 文件的时候需要扫描 mapper 文件所在位置，然后才可以使用，使用注解开发也需要扫描：

> 将所有带有注解的接口都扫描

~~~xml
<mappers>
    <package name="club.hanzhe.dao"/>
</mappers>
~~~

### Result 注解

使用 xml 开发时，会遇到字段与实体类属性名不匹配造成封装失败的情况，起别名解决是一种方法，但是一般都使用 resultMap 结果映射，将字段与属性匹配，注解开发也可以使用 resultMap，对应的注解是 `@Results`

> 使用注解的方式匹配字段与属性查询

~~~java
@Results(
    id = "r1",	// id：给当前results起名字，像resultMap一样继承使用
    value = {	// value：配置多个映射
		/*
		 *  @Result中的属性：
		 *  	id：表中的id列是否为主键，是为true，不写默认为false
		 *  	column：表中的字段
		 *  	property：表中字段对应的pojo中的属性
		 *  	只需要将不匹配的字段属性配上即可，匹配的可以省略不写
		 */
        @Result( column = "u_id" , property = "id" ),
        @Result( column = "u_name" , property = "name" ),
        @Result( column = "u_sex" , property = "sex" ),
        @Result( column = "u_address" , property = "address" )
    }
)
public User findUserById( Integer id );
~~~

>如果有另一个查询与他的规则相同，那么可以引用之前写的Results的id属性

~~~java
@Select("select * from t_user where u_name = #{abc}")
@ResultMap("r1")
public User findUserByName( String name );
~~~



## 扩展功能

### Mybatis 逆向工程

逆向工程是根据数据库中表的信息进行自动创建实体类，接口，映射文件的技术

#### **1. 环境配置**

使用逆向工程必须引入他的依赖或jar包

~~~xml
<dependency>
    <groupId>org.mybatis.generator</groupId>
    <artifactId>mybatis-generator-core</artifactId>
    <version>1.3.5</version>
</dependency>
~~~

#### 2. 逆向工程配置文件

你可以<font color="red">在任意位置 ( 包括项目外 ) </font>创建逆向工程所需要的配置文件，需要手动配置的地方有以下几点：

- properties 标签中的配置文件需要自己书写，也可以书写该标签及文件
- jdbcConnection 标签需要修改，修改需参考上面的 properties 配置文件
- javaModelGenerator 标签需要修改，他是实体类生成的目标包路径
- sqlMapGenerator 标签需要修改，他是 mapper 映射文件生成的目标路径
- javaClientGenerator 标签需要修改，他是接口生成的目标包路径
- table 标签的 tableName 属性需要修改，他是逆向工程所参考的数据表
  - 如有多个表被参考就书写多个 table 标签，可以直接复制修改 tableName 属性 

~~~xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">
<generatorConfiguration>
    <properties resource="db.properties"></properties>
    <context id="testTables" targetRuntime="MyBatis3">
        <commentGenerator>
            <!--是否去除自动生成的注释 true是：false 否-->
            <property name="suppressAllComments" value="true"/>
        </commentGenerator>
        <!--数据库连接-->
        <jdbcConnection driverClass="${driver}" connectionURL="${url}" userId="${username}" password="${password}"></jdbcConnection>
        <!-- 默认false，把JDBC DECIMAL 和 NUMERIC 类型解析为 Integer，为 true时把JDBC DECIMAL和NUMERIC类型解析为java.math.BigDecimal -->
        <javaTypeResolver>
            <property name="forceBigDecimals" value="false"/>
        </javaTypeResolver>
        <!--生成的实体类存放的位置-->
        <javaModelGenerator targetProject="src/main/java" targetPackage="club.hanzhe.bean">
            <!--enableSubPackages,是否让schema作为包的后缀-->
            <property name="enableSubPackages" value="false"/>
            <!--从数据库返回的值被清除前后空格-->
            <property name="trimStrings" value="true"/>
        </javaModelGenerator>
        <!--mapper映射文件存放的位置-->
        <sqlMapGenerator targetProject="src/main/resources" targetPackage="mappers">
            <property name="enableSubPackages" value="false"></property>
        </sqlMapGenerator>
        <!--targetPackage:mapper接口生成的位置-->
        <javaClientGenerator type="XMLMAPPER" targetProject="src/main/java" targetPackage="club.hanzhe.dao">
            <property name="enableSubPackages" value="false"/>
        </javaClientGenerator>
        <!--tableName为逆向工程针对的表的表名，可以通配符匹配所有表，剩下的属性统统false-->
        <table tableName="%"
               enableCountByExample="false" enableUpdateByExample="false"
               enableDeleteByExample="false" enableSelectByExample="false"
               selectByExampleQueryId="false"></table>
    </context>
</generatorConfiguration>
~~~

#### 3. 使用逆向工程

在环境配置完成后使用下面这段模板代码，运行后就会将实体类，接口，mapper文件自动生成

> 需要在改代码中手动设置配置文件的文件名及位置

~~~java
import org.junit.Test;
import org.mybatis.generator.api.MyBatisGenerator;
import org.mybatis.generator.config.Configuration;
import org.mybatis.generator.config.xml.ConfigurationParser;
import org.mybatis.generator.internal.DefaultShellCallback;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class Generator {
    @Test
    public void create(){
        try {
            List<String> warnings = new ArrayList();
            boolean overWriter = true;
            // 这里加载刚刚创建的逆向工程配置文件
            File configFile = new File("文件位于磁盘的绝对路径");
            ConfigurationParser cp = new ConfigurationParser(warnings);
            Configuration config = cp.parseConfiguration(configFile);
            DefaultShellCallback callback = new DefaultShellCallback(overWriter);
            MyBatisGenerator myBatisGenerator = new MyBatisGenerator(config, callback, warnings);
            myBatisGenerator.generate(null);
        }catch (Exception e){
            System.out.println("操作失败！");
            System.out.println("==================================================");
            System.out.println(e);
            e.printStackTrace();
        }
    }
}
~~~

### PageHelper 分页插件

pageHelper 插件是针对 mybatis 设计的一款分页插件，通过拦截器对 sql 进行操作，使其拥有分页的能力

#### 1. 环境配置

使用 pageHelper 分页插件需要导入他的 maven 依赖或者导入他的 jar 包

~~~xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <!-- 可以官网查询最新版 -->
    <version>5.0.0</version>
</dependency>
~~~

在 maven 依赖添加完成后，还需要在 mybatis 的核心配置文件中使用 `plugins` 标签注册 pageHelper 插件

~~~xml
<plugins>
    <plugin interceptor="com.github.pagehelper.PageInterceptor"></plugin>
</plugins>
~~~

#### 2. 使用PageHelper

PageHelper 依赖引入后，在程序中就有了 PageHelper 类，调用它的 startPage 静态方法，后紧跟的第一条查询语句就是分页查询

> startPage 的静态方法需要两个参数，第一个是查询的页码，第二个是每页的查询数量

~~~java
public void test1(){
    // 查询第二页，每页5条记录
    PageHelper.startPage(2, 5);
    List<Bean> list = mapper.findAll();
    for (Bean bean : list)
        System.out.println(bean);
    System.out.println(list);
}
~~~

分页除了 PageHelper 类，还有一个 PageInfo 可以使用，将查询的结果封装到 PageInfo 中，可以查询一些和分页相关的信息

~~~java
public void test1(){
    SqlSession session = factory.openSession();
    BeanDao mapper = session.getMapper(BeanDao.class);
    PageHelper.startPage(2, 5, true);
    PageInfo info = new PageInfo(mapper.findAll());
    System.out.println("总页码：" + info.getPages());
    System.out.println("总记录数：" + info.getTotal());
    System.out.println("结果集：");
    List<Bean> list = info.getList();
    for (Bean bean : list)
        System.out.println(bean);
}
~~~

#### 3. PageInfo常用参数

在将结果集封装到 PageInfo 中的时候，可以可选性的传入一个导航页码的参数，可以获取到和当前页相邻的页码

~~~java
public void test1(){
    SqlSession session = factory.openSession();
    BeanDao mapper = session.getMapper(BeanDao.class);
    PageHelper.startPage(201, 5, true);
    // 在创建info对象的时候可以跟随一个int类型，这个值是当前页附近的页码的数量
    PageInfo info = new PageInfo(mapper.findAll(), 7);
    System.out.println("当前页：" + info.getPageNum());
    System.out.println("每页显示数量：" + info.getPageSize());
    System.out.println("当前页信息：");
    for (Object obj : info.getList())
        System.out.println(obj);
    System.out.println("总页码：" + info.getPages());
    System.out.println("总记录数：" + info.getTotal());
    System.out.println("上一页：" + info.getPrePage());
    System.out.println("下一页：" + info.getNextPage());
    System.out.println("是否首页：" + info.isIsFirstPage());
    System.out.println("是否尾页：" + info.isIsLastPage());
    System.out.println("导航条页码:");
    for (int page : info.getNavigatepageNums() )
        System.out.print( page + "  " );
    System.out.println("\n导航条中首页" + info.getNavigateFirstPage());
    System.out.println("导航条中尾页" + info.getNavigateLastPage());
}
~~~

* 这里需要注意！==每页显示数量是指分页是设置的数量==，例如设置每页只显示5条，获取到的就是5，而不是最后一页只显示三条就返回三，这是错误的

#### 合理化查询

在网页中往往有些人会钻空子乱改数据，例如只有20页数据，他修改了参数请求到了第50页，这种情况经常会发生，所以在注册 pageHelper 的时候可以添加一个参数使数据变得合理化

```xml
<plugin interceptor="com.github.pagehelper.PageInterceptor">
    <property name="reasonable" value="true" />
</plugin>
```



### Lombok 插件

在我们进行查询的时候，需要将查询的结果封装到指定的实体类中，而对应的实例类需要书写响应的 get set 方法，构造方法及 toString 方法，这样比较麻烦，这是可以使用 lombok 插件进行自动生成功能

#### 1. 环境配置

使用 lombok 需要引入他的 maven 依赖

~~~xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.8</version>
</dependency>
~~~

在依赖引入后还需要在编辑器中安装 lombok 的插件 ( IDEA 编辑器为例 ) `File → settings → plugins → install JetBrains plugin... ` 在里面搜索 lombok 下载安装，而后在 `file → settings → build,Exe.. → Compiler → Annotation Pro... ` 里面选中当前项目，在右面的 `Enable annotation processing` 选项打勾 

#### 2. 使用 Lombok 插件

在目标实体类上，只需要书写好属性即可，无需书写其他多余方法，使用 lombok 提供的注解用来一键生成：

| 注解                | 作用                             |
| ------------------- | -------------------------------- |
| @Get                | 一键生成所有 get 方法            |
| @Set                | 一键生成所有 set 方法            |
| @ToString           | 一键生成 toString 方法           |
| @Data               | 一键生成 get set toString 等方法 |
| @NoArgsConstructor  | 生成无参构造方法                 |
| @AllArgsConstructor | 生成有参构造方法                 |

