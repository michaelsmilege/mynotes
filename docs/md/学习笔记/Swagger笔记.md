# Swagger笔记

现在市面上大多数公司都摒弃了传统 jsp 开发，采用前后端分离式的开发规则，前端使用 Vue，Angular，React 等等完成页面，后端省掉了视图跳转的过程，直接书写接口返回 json 数据供前端调用即可

这样一来就诞生了一个新的问题，后端程序员需要写一个接口文档来告诉前端开发人员都有那些接口，每个接口都是干什么的，需要那些参数等等。

书写接口文档是一件费时费力的活，而 Swagger 可以根据程序代码自动生成在线接口文档，==Swagger 是接口文档生成工具==



## 整合Swagger

### 导入依赖

想要整合使用 Swagger 生成接口文档，首先我们需要引用 Swagger 的 maven 依赖：

~~~xml
<!-- Swagger依赖 -->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
    <!-- 排除下面两个依赖，解决 For input string: "" 异常 -->
    <exclusions>
        <exclusion>
            <groupId>io.springfox</groupId>
            <artifactId>swagger-annotations</artifactId>
        </exclusion>
        <exclusion>
            <groupId>io.swagger</groupId>
            <artifactId>swagger-models</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<!-- 单独引用版本偏低的两个依赖 -->
<dependency>
    <groupId>io.swagger</groupId>
    <artifactId>swagger-annotations</artifactId>
    <version>1.5.21</version>
</dependency>
<dependency>
    <groupId>io.swagger</groupId>
    <artifactId>swagger-models</artifactId>
    <version>1.5.21</version>
</dependency>
<!-- UI页面展示 -->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.9.2</version>
</dependency>
~~~



### 启用Swagger

在引用 Swagger 的依赖后，我们还需要通过注解开启 Swagge 才可以实现接口文档

> 新建一个配置类，通过 `@EnableSwagger2` 注解启用 Swagger：

~~~java
@Configuration
@EnableSwagger2   // 开启Swagger
public class SwaggerConfig { }
~~~



### 了解接口文档

Swagger 接口文档主要有四部分组成：

【分组信息】，【分组描述信息】，【接口描述信息】，【实体类信息】

![](./img/swagger-01.jpg)

我们目前仅仅是引入了 Swagger 的依赖，开启 Swagger 功能之后如果没有配置的话，默认会使用 swagger 初始化的配置



## 初始化分组

我们想要使用自定义的分组信息，要在配置类提供一个 Docket 实例到 IOC 容器中，通过 Docket 实例设置分组名称，Swagger 会根据实例进行自定义设置。

> 创建一个分组

~~~java
// 还是之前的配置类
@Configuration
@EnableSwagger2
public class SwaggerConfig {
    @Bean
    public Docket docket() {
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("张涵哲的分组");
    }
}
~~~

上面使用 Swagger2 默认规则创建了一个 Docket 对象，定义分组名称为 `张涵哲的分组`，效果如图所示：

![](./img/swagger-02.jpg)



> 多分组配置

如果想要创建多个分组，那么就在 IOC 容器中多提供几个 docket 实例：

~~~java
@Configuration
@EnableSwagger2
public class SwaggerConfig {
    @Bean
    public Docket docket() {
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("张涵哲的分组");
    }
    @Bean
    public Docket docket1() {
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("***的分组");
    }
}
~~~

![](./img/swagger-03.jpg)



## 配置分组详情

> 配置分组描述

我们已经可以创建多个分组了，但是我们可以发现，每个分组中都有一段描述信息，我们可以在每个分组下显示不同的描述信息，需要调用 Docket 的 `apiInfo()` 函数传入自定义的配置。

~~~java
@Configuration
@EnableSwagger2
public class SwaggerConfig {
    @Bean
    public Docket docket() {
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("张涵哲的分组")
                .apiInfo(apiInfo());
    }
	// 创建一个函数用来返回 ApiInfo 实例
    // 这里我只显示了部分信息，填写null的都是不显示的，如果想要全部显示可以填写所有的信息
    public ApiInfo apiInfo() {
        Contact contact = new Contact("张涵哲", "http://blog.hanzhe.club", null);
        return new ApiInfo(
                "基于Swagger2.0练习",
                "基于程序中所有的接口提供帮助文档",
                "1.0.0",
                null,
                contact,
                null,
                null,
                new ArrayList());
    }
}
~~~

我们为 `张涵哲的分组` 配置了一段描述信息，接下来看看效果：

![image-20200812131813648](./img/swagger-04.png)

可以看到分组的描述信息已经显示出来了。



> 配置扫描范围

当我们多个人同时开发一个程序时，就会使用多个分组，每个人对应这一个分组，其中每个分组都有自己的接口文档，这里需要配置分组接口显示

例：张涵哲负责开发用户相关的接口 `包位置：club.hanzhe.controller.user.UserController.java`

~~~java
@Bean
public Docket docket() {
    return new Docket(DocumentationType.SWAGGER_2)
        .groupName("张涵哲的分组")
        .apiInfo(apiInfo())
        // select开始，build结束，apis用来过滤
        .select()
        .apis(RequestHandlerSelectors.basePackage("club.hanzhe.controller.user"))
        .build();
}
~~~

这样一来该分组下就只会显示固定的接口信息了，除开通过包扫描的方法之外还有其他的方法进行筛选：

`RequestHandlerSelectors` 类中其他的静态函数：

| 函数名                                 | 作用                       |
| -------------------------------------- | -------------------------- |
| any()                                  | 扫描全部接口               |
| none()                                 | 不扫描                     |
| basePackage(String package)            | 根据给定的包的位置进行扫描 |
| withClassAnnotation(Class annotation)  | 类上有对应注解会被扫描     |
| withMethodAnnotation(Class annotation) | 函数上有对应注解的会被扫描 |

还可以通过路径进行过滤：

~~~java
@Bean
public Docket docket() {
    return new Docket(DocumentationType.SWAGGER_2)
        .groupName("张涵哲的分组")
        .apiInfo(apiInfo())
        // select开始，build结束，paths用来过滤
        .select()
        .paths(PathSelectors.ant("/user/**"))
        .build();
}
~~~

`PathSelectors` 类中其他的静态函数：

| 函数名              | 作用               |
| ------------------- | ------------------ |
| any()               | 扫描全部接口       |
| none()              | 不扫描             |
| ant(String path)    | 扫描指定路径       |
| regex(String regex) | 根据正则表达式过滤 |



## 接口信息配置

> 简单接口显示

![](./img/swagger-05.jpg)

上面的图片是扫描到接口后默认生成的接口文档，Swagger 是以 `Controller` 为单位，对接口进行分组管理的，这个分组的元素在 Swagger 中称为 `Tag`，我们可以通过注解来修改一下接口文档，让他更人性化：

| 注解                                           | 作用                                                |
| ---------------------------------------------- | --------------------------------------------------- |
| @Api(tags = "")                                | **标注在类上** 用来表明接口组，tags=组名            |
| @ApiOperation(value = "", notes = "", tags="") | **标注在函数上** value=标题，notes=描述，tags=分组  |
| @ApiParam("")                                  | **标注在参数列表中** 表示当前参数代表的含义以及用法 |

例如下面我们编辑一下当前的 UserController：

```java
@Api(tags = "User接口文档")
@RestController
@RequestMapping("/user")
public class UserController {

    @GetMapping("/")
    @ApiOperation("查询所有user")
    public R getList(){ ... }

    @PostMapping("/")
    @ApiOperation(value = "添加新的user信息", notes = "传入用户信息进行封装user进行添加")
    public R addUser(@RequestBody UserBean user){ ... }
    
    @PutMapping("/{id}")
    @ApiOperation(value = "通过ID更新user信息", notes = "路径传入ID，json传输修改信息")
    public R updateUser(@PathVariable("id")Long id, @RequestBody UserBean user){
    	...
    }
    
    @DeleteMapping("/{id}")
    @ApiOperation(value = "通过ID删除user信息", notes = "路径传入ID进行删除")
    public R deleteUser(@ApiParam("删除的目标ID")@PathVariable("id") Long id){
        ...
    }
    
}
```

效果如下图所示：

![](./img/swagger-06.jpg)



> 跨组显示接口

之前有说过，Swagger 默认是按照每个 Controller 为一个分组显示接口的，那么如果我们其中一个 Controlle 执行时需要另个 Controller 的某个接口配合，这时我们当前分组就要支持显示其他分组信息。

**1. **员工的分组接口除了本身的增删改查之外还要查询携带查询所有部门信息：

~~~java
@Api(tags = "部门接口")
@RestController
@RequestMapping("/dept")
public class DeptController {

    @GetMapping("/")    // tags 是一个数组，可以制定多个分组同时显示
    @ApiOperation( value = "查询所有部门", tags = {"部门接口", "员工接口"})
    public void getList(){ }
    
    // .... 省略其他接口

}
~~~

如下图所示：

![](./img/swagger-07.jpg)



> 通过已有的接口新建一个分组

除了接口跨分组显示之外，还可以在多个不同的接口中指向同一个不存在的分组，Swagger 会新建一个分组来展示这些接口信息。

```java
@Api(tags = "员工接口")
@RestController
@RequestMapping("/user")
public class UserController {
    @DeleteMapping("/{id}")
    @ApiOperation(value = "通过ID删除user信息", 
                  notes = "路径传入ID进行删除", tags = "删除操作相关接口")
    public R deleteUser(@ApiParam("删除的目标ID")@PathVariable("id") Long id){
        ...
    }
}
```

```java
@Api(tags = "部门接口")
@RestController
@RequestMapping("/dept")
public class DeptController {
    @DeleteMapping("/{id}")
    @ApiOperation(value = "通过ID删除部门", tags = "删除操作相关接口")
    public void deleteUser(@ApiParam("删除的目标ID")@PathVariable("id") Long id){ }
}
```

![](./img/swagger-08.jpg)



## 实体类信息配置

我们在开始的时候就 Swagger 接口文档由 `分组`，`分组描述信息`，`接口信息`，`实体类信息` 四部分组成，前三种我们已经使用过了，接下来我们就要学习使用配置类信息

当我们需要完成类似添加操作的时候，如果需要的参数过多，使用 @ApiParam 注解就会太过臃肿，直接封装为实体类又要解释每个字段都是干什么的，是什么类型，接口显示也过于繁琐，所以我们可以将实体类直接显示在文档中，当时用到该实体类时在底部翻找属性对应参数即可，一个实体类可以对应 N 多个接口，一劳永逸

> 实体类的配置

配置实体类十分的简单，只需要使用两个注解就可以完成基本操作：

| 注解                | 作用                           |
| ------------------- | ------------------------------ |
| @ApiModel()         | 实体类名称                     |
| @ApiModelProperty() | 实体类中每个字段代表的含义解释 |

~~~java
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("员工实体类")
public class UserBean {

    @ApiModelProperty("员工ID，用来识别员工的唯一表示，不可重复。")
    private Long id;
    @ApiModelProperty("员工姓名")
    private String name;
    @ApiModelProperty("员工年龄")
    private Integer age;

}
~~~

效果如图所示：

![](./img/swagger-09.jpg)