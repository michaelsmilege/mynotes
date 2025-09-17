# JavaWeb 笔记

温故而知新！javaweb 笔记。

## HttpServlet 类

### 简单使用 Servlet

在传统的 javaweb 无框架开发的时候，所谓的控制机就是 servlet，创建一个普通的 java 类之后，继承 HttpServlet 类之后，这个类就是一个 servlet 类了，在创建好一个 servlet 之后，只需要配置他的访问路径，那么他就可以正常工作了。

> 创建一个 servlet 类

~~~java
public class Servlet1 extends HttpServlet {
    /*
     * 在客户端发起请求的时候，最常用的就是 get 和 post 两种请求方式
     * 在 servlet 中分别对着两种方式进行解析，但无论是什么请求，他们的最终处理过程都是一样的
     * 所以这里只需要写一个处理逻辑即可。
     */
    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
        	throws ServletException, IOException {
        System.out.println("经过了Servlet1控制器");
    }
    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp)
        	throws ServletException, IOException {
        this.doGet(req, resp);
    }
}
~~~

在上面我们已经书写好了一个 servlet 类，但是这个 servlet 还不能正常工作，想要正常工作，需要接收到客户端发来的请求，这样一来就需要配置他的访问路径

> 在 web.xml 中装载 servlet 并配置访问路径

~~~xml
<!-- 配置一个简单的Servlet控制器 -->
<servlet>
    <servlet-name>servlet1</servlet-name>
    <servlet-class>club.hanzhe.web.Servlet1</servlet-class>
</servlet>
<servlet-mapping>
    <servlet-name>servlet1</servlet-name>
    <url-pattern>/servlet1</url-pattern>
</servlet-mapping>
~~~



### Servlet 的生命周期

什么是 servlet 的生命周期？servlet 的生命周期，就是 servlet 从初始化工作到最终销毁的过程，我们可以控制 servlet 在某个指定的过程中处理一些逻辑。

就像上面说的一样，servlet 共有三个声明周期，分别是 `初始化`，`工作`，`销毁`，他们分别对应的函数被称之为生命周期函数，使用方法如下所示：

> servlet 的声明周期函数

~~~java
public class Servlet2 extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
        	throws ServletException, IOException {
        System.out.println("访问了Servlet2");
    }

    @Override
    public void init() throws ServletException {
        System.out.println("servlet2 init");
        super.init();
    }

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp)
        	throws ServletException, IOException {
        System.out.println("servlet2 service");
        super.service(req, resp);
    }

    @Override
    public void destroy() {
        System.out.println("servlet2 destroy");
        super.destroy();
    }
}
~~~

- [ init ] 为初始化方法，当该 servlet 首次被访问的时候会执行一次，之后就不在执行。
- [ service ] 为当前 servlet 提供服务，每当请求访问到 servlet 时，会首先经过 service，然后由 service 判断请求类型，最终调用合适的 doGet 或者 doPost 等等，，，，每次访问都会执行，且优先级在 doGet doPost 之前。
- [ destroy ] 为销毁方法，当 servlet 销毁时执行的善后方法，在我们关闭服务器的时候会看到这个函数执行，多数用来释放资源。在 servlet 销毁之前执行，且只执行一次。



## HttpServletRequest

request 代表请求，那么这个类代表的就是基于 HTTP 协议的 servlet 请求封装类，关于客户端请求的所有信息都封装在这个对象中，我们可以使用这个类获得到很多具体信息。

### 获取请求参数

之前我们已经实现了 servlet 接受请求，并且处理一些逻辑，但是仅仅是这些是不够的，如果我们写一个带有登录功能的 servlet，应该要获取前端发来的参数，然后在进行逻辑处理。

例如想要获取前端表单提交的参数，需要使用 `HttpServletRequest` 对象中的 `getParameter` 方法

> 简单的参数表单提交以及获取参数

~~~html
<!-- 前端代码from表单提交 -->
<div>
    <form action="login" method="get" style="margin: 0px auto;">
        账户：<input type="text" name="username">
        <br />
        密码：<input type="password" name="password">
        <br />
        <input type="submit" value="提交">
    </form>
</div>
~~~

~~~java
// servlet来处理逻辑
public class LoginServlet extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
        	throws ServletException, IOException {
        // 获取参数，对应 form 表单中的 name 属性
        String username = req.getParameter("username");
        String password = req.getParameter("password");
        // 因为这里是练习，我就用打印代替了一切逻辑处理
        System.out.println("username: " + username);
        System.out.println("password: " + password);
    }
}
~~~

- 配置 web.xml 的代码我就不写了，，，，

> 效果如图所示：

<img src="../img/JavaWeb1.png">

前端发起请求，已经被 servlet 完全接收，参数已经处理完成。这里暂时先不考虑乱码的问题，后面会提到。



### 其他获取方法

我们已经简单的通过 servlet 获取到了请求中包含的参数，其实真实的请求中包含的信息非常多，而其中获取请求携带的表单参数最为常用，那么除开这个方法之外，还可以获取到很多的信息

> 获取请求携带参数信息

| 方法名                     | 作用                                                   |
| -------------------------- | ------------------------------------------------------ |
| getParameter( String name) | 请求中 name 属性对应的值。                             |
| getParameterNames()        | 获取请求中所有携带的参数的 name，返回 Enumeration 集合 |

> 获取更多请求信息

| 方法名           | 作用                                                         |
| ---------------- | ------------------------------------------------------------ |
| getRequestURL()  | 完整的请求URL                                                |
| getRequestURI()  | 请求相对路径地址，是在URL的域名与参数之间的路径信息。        |
| getQueryString() | URL后面的参数信息，截止 ? 后面的都会获取 ( post下获取不到 )。 |
| getRemoteHost()  | 客户端请求时的 IP 地址                                       |
| getRemoteAddr()  | 客户端请求时的 IP 地址                                       |
| getRemotePort()  | 客户端请求时使用的端口号                                     |
| getLocalAddr()   | 服务端 IP 地址                                               |
| getLocalName()   | 服务端主机名                                                 |

> 获取请求头的信息

| 方法名                  | 作用                                                         |
| ----------------------- | ------------------------------------------------------------ |
| getHeader(String name)  | 获取目标请求头信息，如果不包含头则为 null，包含多个则返回第一个 |
| getHeaders(String name) | 返回目标请求头的所有信息。                                   |
| getHeaderNames()        | 返回所有请求头信息，返回值是一个枚举类型                     |

更多关于 HttpServletRequest 的函数说明，直连

~~~
https://blog.csdn.net/wwq0813/article/details/90256058
~~~



## HttpServletResponse

服务端与客户端交互，客户端发送请求，请求数据被封装到 `HttpServletRequest` 对象中，那么服务器接收请求后，向客户端返回的信息也被封装到一个对象中，就是 `HttpServletResponse`。

### 设置响应数据

> 响应数据对应的方法

| 方法名            | 作用                                       |
| ----------------- | ------------------------------------------ |
| getOutputStream() | 获取字节输出流，以字节形式向客户端响应数据 |
| getWriter()       | 获取字符输出流，以字符形式向客户端响应数据 |

- 如果字节输出流输出字符的话，会爆出异常
- 在同一次响应的过程中，字节流和字符流只能使用一种，二者相互排斥

像之前的例子，后端成功接收到了前端发送的请求，并且成功打印在了控制台中，但是这仅仅是后台知道，要给前端一个提示才行，这里要实现一个功能，如果请求成功了，在页面上给一个成功的提示。

~~~java
public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    ServletOutputStream outputStream = resp.getOutputStream();
    outputStream.println("success !");
    Enumeration<String> names = req.getParameterNames();
    while ( names.hasMoreElements() ){
        String str = names.nextElement();
        System.out.println(str + ": " + req.getParameter(str));
        outputStream.println(str + ": " + req.getParameter(str));
    }
}
~~~



### 设置响应头

> 设置响应头对应的方法

| 方法名                                 | 作用                             |
| -------------------------------------- | -------------------------------- |
| addHeader(String name, String value)   | 在目标请求头中追加字符串值       |
| addIntHeader(String name, int value)   | 在目标请求头中追加整数类型的值   |
| addDateHeader(String name, long value) | 在目标请求头中追加长整形类型的值 |
| setHeader(String name, String value)   | 修改目标请求头中字符串值         |
| setIntHeader(String name, int value)   | 修改目标请求头中整数类型的值     |
| setDateHeader(String name, long value) | 修改在目标请求头中长整形类型的值 |
| setStatus(int value)                   | 设置响应结果状态码               |

- add 开头的是在原基础上追加，适合有多个值得请求头
- set 开头的是修改，对应的是只有一个值的请求头

可以修改请求头之后，我们就可以针对相应的数据进行一些设置了，例如之前的中文乱码，现在就可以解决了。

~~~java
// 设置响应类型字符集为utf-8
resp.setHeader("Content-Type", "text/html;charset=utf-8");
~~~



更多关于 HttpServletResponse 的函数说明，直连

~~~
https://www.jianshu.com/p/8bc6b82403c5
~~~



## 转发与重定向

我们已经学习了 `请求` 和 `响应`，可以通过 html  或者 jsp 页面发送请求，后台接受请求后进行处理，然后响应给前端页面返回值，那么我们可以不可以在后端就控制页面的跳转呢？

> 转发和重定向实现代码

~~~java
// 转发实现页面跳转
@WebServlet("/servlet3")
public class Servlet3 extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
        		throws ServletException, IOException {
        req.getRequestDispatcher("login.html").forward(req, resp);
    }
}
~~~

~~~java
// 重定向实现页面跳转
@WebServlet("/servlet4")
public class Servlet4 extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
        		throws ServletException, IOException {
        resp.sendRedirect("login.html");
    }
}
~~~

二者都可以实现页面的跳转，但是有着本质的区别

1. 通过代码可以看出来，转发是通过 request 操作的，但是重定向是通过 response 操作的
2. 在转发之后，还需要调用 forward 方法，将当前的请求，响应对象传递下去，也就意味着即使目标变了，但是请求和相应还是原本的请求和相应，地址栏也不会有任何的变化
3. 重定向则是抛弃了当前的请求过程，另外发起了一个新的请求去访问目标地址，浏览器地址栏会发生变化，且状态码会变成 304



## 会话跟踪技术



## 请求处理技术

### 过滤器



### 监听器

