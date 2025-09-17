# SpringMVC 笔记

SpringMVC是基于MVC处理模式的web框架，分离了 控制器 - 模型对象 - 过滤器 以及处理程序对象

SpringMVC的工作流程:

1. 客户端通过浏览器发出请求，通过web.xml的配置调用DispatcherServlet ( 核心处理器 ) 接收请求，并将请求交给处理器映射器处理
2. 映射器 ( BeanNameUrlHandlerMapping ) 通过请求的url地址解析出映射关系，查找是否有符合规则的Bean，然后将映射关系返还给核心处理器，由核心处理器将映射关系交给映射器
   3. 适配器 ( SimpleControllerHandlerAdapter ) 核心处理器，底层使用了instanceOf技术，主要是判断对应映射关系的Bean是否继承了Controller接口，符合则调用对应的Bean执行对应逻辑，并将结果返还给适配器，然后返还给核心处理器
3. 核心处理器调用视图解析器（ViewResolver）适配器返还的结果进行解析，解析为View返还给处理器
4. 核心处理器调用View将模型数据渲染为视图
5. 核心处理器向客户端做出响应

> 在使用 springmvc 之前需要在 maven 中引入目标依赖：

~~~xml
<dependency>
	<groupId>org.springframework</groupId>
	<artifactId>spring-webmvc</artifactId>
	<version>5.1.5.RELEASE</version>
</dependency>
~~~

笔记将基于 springmvc 5.1.5 记录

## MVC的两种实现方式

### XML配置MVC

> 配置 web.xml 

在 web.xml 中配置 mvc 的 DispatcherServlet 的映射路径为 **/** ( 所有请求 )，让所有请求都交给 mvc 核心控制器进行处理

~~~xml
<servlet>
    <servlet-name>springmvc</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
	<!-- init-param标签用来指定mvc所需要的配置文件 -->
    <init-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:springmvc.xml</param-value>
    </init-param>
</servlet>
<servlet-mapping>
    <servlet-name>springmvc</servlet-name>
    <url-pattern>/</url-pattern>
</servlet-mapping>
~~~

在配置 web.xml 的时候可以不用配置 init-param ，他会默认的去 WEB-INF 目录下找配置文件，这时候文件名必须是 `servlet-name` 标签内的值，且后面必须加上-servlet，例如 springmvc-servlet.xml



>配置 springmvc

定义了映射器及适配器，将自己书写的实现了Controller的控制器类装配在Bean中，映射器和适配器是可以省略不写的，他有自己的默认配置，如果写了其中的一个，那么建议另一个一定要写上

~~~xml
<!--处理映射关系-->
<bean class="org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping" />
<!--适配器-->
<bean class="org.springframework.web.servlet.mvc.SimpleControllerHandlerAdapter" />
~~~

 

> 编写控制器类

控制器就是 mvc 为我们封装好的 web 中的 servlet 类，他可以接收客户端发来的请求，省去了我们在 web 开发中较为麻烦的 web.xml 配置等等。

~~~java
@Override
public ModelAndView handleRequest(HttpServletRequest request,                                   HttpServletResponse response) throws Exception {
    ModelAndView model = new ModelAndView();
    System.out.println("控制器被成功执行");
    model.addObject("message", "con1 goto index.jsp");
    model.setViewName("index.jsp");
    return model;
}
~~~

- ModelAndView 类：
  - 用来负责 mvc 中主要的逻辑，其中 setViewName 方法经过视图解析器后就是转发的目标路径
  - addObject 方法就类似 request 中的 setAttribute 方法



### 注解配置MVC

注解配置 springmvc 相比配置文件来说更为简单，建议重新开个项目来写

> 重写配置文件

~~~xml
<!-- 开启注解配置mvc -->
<mvc:annotation-driven></mvc:annotation-driven>
<!-- scan扫描注解所在的包 -->
<context:component-scan base-package="club.hanzhe.web" />
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
	<property name="prefix" value="/" />
	<property name="suffix" value=".jsp" />
</bean>
~~~

> 控制器类代码：

~~~java
@Controller
public class Con1 {
    @RequestMapping("/main")
    public String method01() throws Exception {
        System.out.println("mvc function run");
        return "index";
    }
}
~~~

1. 使用了 `@Controller` 注解，表明当前类是控制器类。
2. 每个方法上都可以使用 `@RequestMapping` 来指定目标访问路径

 

## MVC 的视图解析器

在每个控制器中会返回 ModelAndView 的实例，这些返回的实例会被视图解析器接受并解析处理，setViewName 会被解析为路径拼接到视图解析器中，addObject 中的数据会被封装到目标路径的 request 域中

视图解析器配置中的配置及最常用的两个属性

- prefix：是解析视图名称后拼接在前面的前缀，**/** 代表目标视图在根目录
- suffix：是解析视图名称后拼接在后面的后缀，.jsp 代表解析后为 jsp 视图

~~~xml
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/" />
    <property name="suffix" value=".jsp" />
</bean>
~~~



## 请求参数绑定

### 简单类型绑定

想要什么名字，什么类型的参数，直接写在处理请求的方法的参数列表中即可，需要注意的是，变量名要与请求参数表单的 name 值相同

例如：localhost:8080/Day01/1.action?user=abc

这时表单传来的数据中 name 为 user，代码如下：

~~~java
@RequestMapping("1") // 简单参数绑定，变量名需要与表单的name相同
public void test1( String user ) {
    // 打印测试
    System.out.println("user = " + user);
}   
~~~

如果参数列表和提交的表单的 name 不同，需要使用注解获取指定 name 的值

~~~java
// 请求地址： localhost:8080/username=zhang
@ResponseBody
@RequestMapping("/test")
public String test( @RequestParam("username")String name ){
    return "获取到的值：" + name;
}
~~~



### pojo类型绑定

同简单类型绑定一致，直接写在参数列表中即可，请求参数中会对应指定pojo中属性的变量名，但是如果想要赋值成功，需要pojo对其中每个变量提供正确的Set方法

例如：localhost:8080/Day01/1.action?name=zhang&pwd=hanzhe&age=123

表单中传来的数据，其中name和pwd是pojo中的属性，而age是参数列表中的属性，代码如下：

~~~java
@RequestMapping("1") // pojo类型参数绑定，需要pojo中有对应的属性，且有set方法
public void test2( User user , Integer age ) {
    System.out.println(user);
    System.out.println("测试数据 = " + age);
}
~~~



### Date类型绑定

Date时间类型在绑定的时候需要添加一个注解：【@DateTimeFromat( pattren = “” ) Date d】，这样就可以让字符串类型的时间按照指定的类型转换为Date对象

例如：localhost:8080/Day01/1.action?date=2012-12-25

~~~java
@RequestMapping("1") // date类型数据绑定
public void test( @DateTimeFormat(pattern = "yyyy-MM-dd") Date date ) {
    System.out.println(new SimpleDateFormat().format(date));
}
~~~



## @RequestMapping

用来定义映射路径，可以定义在方法上，让请求仅对当前方法有效，也可以定义在类上，做为方法的上级路径

@RequestMapping有很多属性，可以筛选高级请求：

1. value属性：代表访问的路径地址，在没有第二个属性存在的情况下，可省略不写
2. paht属性：作用等同于value，value和path属性不允许同时出现同一个RequestMapping中
3. method属性：是个字符串数组，可以对请求方法进行拦截，例如只允许 get post 请求才可以访问
4. params属性：是个字符串数组，可以对请求参数进行约束，例如访问该请求必须携带 name pwd 参数，

 

#### 常见的三种请求方法

1. 含有占位符【?】访问路径

   ​	书写方式：paht = “**?**o”

   ​	访问方式：localhost:8080/Day01/**?**o.action

   ​	注意：？代表的是单个占位符，o.action前面不能留空，必须有一个字符

2. 含有通配符【*】访问路径

   ​    书写方式：path = “*****o”

   ​    访问方式：localhost:8080/Day01/*****o.action

   ​    注意：* 代表0个或多个任意字符，o.action或15416516o.action都可以访问的到

3. 参数访问路径：{ }

   ​    以参数列表做为路径，每个参数需要用{ }括起来

   ​    书写方式：path = “{name}/{pwd}/{age}”

   ​	访问方式：localhost:8080/Day01/zhang/hanzhe/20.action

   1. 想要获取到传入的值需要在参数列表中添加注解@PathVariable**，**例如：public void	test(**@PathVariable**(“name”)String name , ……)
2. 在使用参数访问路径的同时也可以获取表单的值，使用**@RequestParam**注解就可以获取，且该注解可以省略不写

### 转发与重定向

在 SpringMVC 中通过视图解析器拼接的字符串可以做为路径访问实现网页跳转功能，基于视图解析器的网页跳转使用的是转发的机制，想要实现重定向的方法有两种方法

**1. 通过请求与响应**

可以在处理器方法的参数列表中自行添加 HttpServletRequest 和 HttpServletResponse 参数进行操作

~~~java
@RequestMapping("/user")
public void test(HttpServletRequest req, HttpServletResponse resp, Model model) 
    			throws Exception {
    // 携带参数
    model.addAttribute("msg","携带的转发参数");
    // 转发到指定页面
    req.getRequestDispatcher("list.jsp").forward(req, resp);
    // 重定向到指定页面
    resp.sendRedirect("list.jsp");
}
~~~

**2. 通过 MVC 的 String 返回值**

在当处理器方法为 String 类型的时候，可以控制页面跳转

~~~java
@RequestMapping("/tiao2")
public String test2() {
    // 返回list字符串，经过视图解析器后拼接路径，为转发效果
    return "list";
    // 加上forward前缀，指定页面跳转为转发形式
    return "forward:list.jsp";
    // 加上redirect前缀，指定页面跳转为重定向形式
    return "redirect:list.jsp";
}
~~~



## 响应数据的方法

**1. 请求参数的响应路径设置：**

在通过注解进行处理请求，我们自定义的方法的时候可以指定返回值类型为String类型，通过视图解析器将字符串拼接为资源名

**2. 请求参数的默认默认路径：**

但是在并没有指定他跳转到某一个资源的时候，通过配置视图解析器会默认指定一个资源，就是以当前路径为基础的jsp文件

例如请求：`localhost:8080/Day02/demo2/1.do`时，他会默认跳转到`localhost:8080/Day02/demo2/1.jsp`资源下，且利用的时转发的技术

在他转发进行转发的时候，就可以携带一些参数

### 绑定Web参数

可以在处理请求的方法上直接书写请求和相应对应的对象，就像doGet和doPost一样

1. 要使用Request或Response对象，直接在参数列表中书写即可，类似doGet或者doPost

2. 使用Cookie的话，可以在参数列表中使用@CookieValue的注解，后面跟上Object o用来存储他对应的Value，他有三个主要的属性：
   1. name：cookie的name值，通过name可以获取到对应的value值
   2. required：是个boolean值，如果为true，则代表当前name是必备条件，false则是可有可无的条件
   3. defaultValue：没有获取到当前Cookie的情况下设置的默认值，可以避免因为required所产生的异常

3. Cookie同时也可以通过request对象获取，config，context，session等都是如此



### 响应数据对象

**1. Map集合方式响应数据**

~~~java
@RequestMapping("1") // Map集合
public void test1( Map<String , String> map ) {
    map.put("username","Map响应的数据");
}
~~~

**2. Model模型响应数据**

~~~java
@RequestMapping("2") // Model模型
public String test2( Model model ) {
    model.addAttribute("username", "Model响应的数据");
    return "demo3/1";
} 
~~~

**3. ModelMap响应数据**

~~~java
@RequestMapping("3") // Map集合
public String test3( ModelMap mm ) {
    mm.addAttribute("username","ModelMap响应的数据");
    return "demo3/1";
}
~~~

**4. ModelAndView响应数据**

~~~java
@RequestMapping("4") // Map集合
public ModelAndView test4() {
    ModelAndView mod = new ModelAndView("demo3/1");
    mod.addObject("username", "ModelAndView响应的数据");
    // mod.setViewName("demo3/1");
    return mod;
}
~~~

小细节：

1. 之前三个响应数据的方式都是通过返回String类型来指定路径
2. ModelAndView使用他本身设置跳转资源路径，设置的方式有两种
   1. 通过构造方法：**new** ModelAndView("demo3/1");
   2. 调用set方法：mod.setViewName("demo3/1");



## SpringMVC 拦截器

springmvc 中的拦截器和过滤器有些类似，他的作用是扫描指定的请求并对其进行拦截，可以在拦截前和拦截后对请求进行一些操作，符合请求要求的会被放行，不符合的则会被拦截

拦截的目标仅限于请求，不包含 JSP 等。

> 1.编写拦截器

springmvc 中为我们提供的拦截器接口为 `HandlerInterceptor`，我们需要实现这个接口并复写其中的函数，复写的函数包括：

`preHandle`：返回一个 boolean 值，==true 为通过，false 为拦截==

`postHandle`：拦截请求后需要执行的逻辑在这里书写。

`afterCompletion`：拦截器工作完成后的善后逻辑写在这里。

实现接口有一个特点，就是强制要求复写其中全部的方法，有时候我可能只需要一个方法，这时就被强迫实现三个方法，所以 mvc 中提供了一个 **拦截器适配器** `HandlerInterceptorAdapter` 来做这个过渡

```java
public class MyInterceptor extends HandlerInterceptorAdapter {
    private static int count = 1;
    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse resp, Object handler) throws Exception {
        System.out.println("拦截器执行第" + count + " 次，拦截请求目标为");
        System.out.println(req.getRequestURL().toString());
        return true;
    }
}
```

> 2.注册拦截器

在拦截器类书写完毕之后去 SpringMVC 的配置文件中进行配置拦截器

```xml
<!-- s 结尾是复数，代表着可以配置多个拦截器 -->
<mvc:interceptors>
    <mvc:interceptor>
        <!-- 制定拦截的路径和处理拦截逻辑的拦截器 -->
        <!-- 需要注意的是 mvc:mapping标签要在上面，否则可能会报错 -->
        <mvc:mapping path="/*"/>
        <bean class="club.hanzhe.config.MyInterceptor" />
    </mvc:interceptor>
</mvc:interceptors>
```



## 上传和下载

> 添加maven依赖

~~~xml
<!-- jstl核心标签库 -->
<dependency>
	<groupId>javax.servlet</groupId>
	<artifactId>jstl</artifactId>
	<version>1.2</version>
</dependency>
<!-- Apache的上传组件 -->
<dependency>
	<groupId>commons-fileupload</groupId>
	<artifactId>commons-fileupload</artifactId>
	<version>1.4</version>
</dependency>
~~~

> 单文件上传

在开始之前我们需要知道，文件上传是需要依靠 file 类型表单完成的，并且 **表单的提交方式必须是post，且需要修改属性`enctype="multipart/form-data"`**

~~~html
<form action="${pageContext.servletContext.contextPath}/uploadFile" method="post" 
		enctype="multipart/form-data">
	<input type="file" name="file">
	<input type="submit" value="点击上传">
</form>
~~~

当提交表单后，会访问后端 uploadFile 控制器负责处理文件上传的，代码如下：

~~~java
@PostMapping("/uploadFile")     // 单文件上传
public ModelAndView upload(MultipartFile file, ModelAndView mv) {
	mv.setViewName(this.upload(file));
	return mv;
}
~~~

- 参数列表中的MultipartFile就代表被接收的文件，file变量要对应表单中input的name属性



> 该函数为上面代码中调用的函数，封装改代码用于等下多文件上传时复用

~~~java
// file 代表需要上传的文件
public String upload( MultipartFile file ) {
    if (!file.isEmpty()) {
        // 获取上传文件的名称
        String filename = file.getOriginalFilename();
        try {
			// 将当前文件保存到指定的路径
            file.transferTo(new File("E:\\Download" + File.separator + System.currentTimeMillis() + filename ));
        } catch (IOException e) {
            System.out.println("代码发生异常了");
            return "error.jsp";
        }
    }
    return "success.jsp";
}
~~~

- File.separator 代表文件分隔符，即为Windows系统中`E:\Download`中的斜杠，因为Windows于Linux的文件分隔符不同，所以这里我就使用了File类中的分隔符

- System.currentTimeMillis( ) 时间戳

## 文件下载

文件上传在之前已经书写完毕，打开之前设置好的目录可以发现文件已经可以正常上传了，接下来就需要实现文件的下载功能。

想要实现文件的下载功能，首先需要知道有多少可以被下载的文件，所以这里需要让用户优先访问控制器，经过处理后在跳转到下载页面中

~~~java
@RequestMapping("/downFile")    // 文件遍历及下载
public ModelAndView downFile(ModelAndView mv) {
	// 将上传目录封装为对象
	File file = new File("E:\\Download");
	String[] list = file.list();
	// 将携带着文件名的集合存到request域中发送到jsp页面上
	mv.addObject("list", list);
	mv.setViewName("download.jsp");
	return mv;
}
~~~

跳转到下载页面后，此时的request域中已经封装了所有文件的信息，这里就使用jstl标签库的each进行循环遍历即可：

~~~html
<table class="tab" border="1px dashed black" cellpadding="5px" cellspacing="0px">
    <c:forEach items="${list}" var="file" varStatus="status">
        <tr>
            <td>${status.index+3}</td>
            <td>${file}</td>
            <td>
                <a target="_blank" href="${pageContext.servletContext.contextPath}/down?name=${file}">下载</a>
            </td>
        </tr>
    </c:forEach>
</table>
~~~

当点击下载的时候会访问指定的控制器，并携带想要下载的文件的文件名，这时就可以通过Java来进行下载了
~~~java
@GetMapping("/down")
public void down(String name, HttpServletResponse resp) {
    // 获取下载的文件对象
    File file = new File("E:\\Download" + File.separator + name);
    // 修改请求头
    resp.setHeader("content-type", "application/octet-stream");
    // 设置下载的文件名
    resp.setHeader("Content-Disposition", "attachment;filename="+name );
    // 创建缓存区，大小为8192字节
    byte[] buffer = new byte[8192];
    try {
        // 创建输入流，读取到指定文件的信息
        BufferedInputStream bis = new BufferedInputStream(new FileInputStream(file));
        // 创建输出流，用于下载文件
        OutputStream os = resp.getOutputStream();
        // 当 i 为 -1 的时候，就代表文件输出完毕了，可以停止循环代码了
        for ( int i = bis.read(buffer); i != -1; ) {
            os.write(buffer, 0, i);
            i = bis.read(buffer);
        }
    } catch (Exception e) {
        System.out.println("出错了");
    }
}
~~~

这里由于之前下载的 a 标签使用了 target="_blank"，所以这里的浏览器会新建页面进行下载，发起下载后当前页面也会自动关闭，不会影响你的正常操作 ( 这里我还没不为什么页面会自动关闭，应该是请求头设置的问题吧 )，这样一来文件的下载也就完成了！

## 多文件上传

多文件上传这里，前端页面并没有什么改变，只不过input从一个变成了两个 ( 注意name属性不要重名)，Java代码如下所示：
> 这里的参数列表由 `Multipart` 改为了 `MultipartHttpServletRequest`，这样一来就可以获取多个文件的信息了

~~~java
@PostMapping("/uploadFiles")     // 多文件上传
public ModelAndView uploads(MultipartHttpServletRequest files, ModelAndView mv) {
	// 获取所有上传的文件名
    Iterator<String> names = files.getFileNames();
	// 循环保存每一个文件
    while (names.hasNext())
        this.upload( files.getFile(names.next()) );
    mv.setViewName("success.jsp");
    return mv;
}
~~~





## RestFul 风格

RestFul 只是一种风格，基于这个风格设计的程序可以更简洁，有层次，更易于实现缓存等机制,  他实现了请求相同的路径而产生不同的逻辑的效果,  实现了 URL 复用

一般基于数据增删改查发出的请求，是通过==区分不同的路径==达到 CRUD 的效果，例如：

~~~
localhost:8080/dropUser?id=1		删除用户
localhost:8080/finduser?id=1		查询用户
~~~

而 RestFul 是通过==区分请求的方法==达到 CRUD 的效果，例如

~~~
localhost:8080/user?id=1	删除用户	发出DELETE请求
localhost:8080/user?id=1	查询用户	发出GET请求
~~~

在 RestFul 中针对增删改查分别对应着四种请求方法

**［ 添加: POST ］［ 删除: DELETE ］［ 修改: PUT ］［ 查询: GET ］**

针对区分四种请求的方法有两种手段：

1. 通过 RequestMapping 中的 method 属性进行区分请求

   ~~~java
   // 仅接收以post方法发出的请求
   @RequestMapping(value="/user", method = RequestMethod.POST)
   ~~~

2. 通过每个方法对应的注解进行区分

   ~~~
   @PostMapping
   @DeleteMapping
   @PutMapping
   @GetMapping
   ~~~



## 导出Excel表格

