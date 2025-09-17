# Json & Ajax 笔记

## Json 数据对象

### 1. 了解 Json

Json是基于JavaScript语言用来<font color="red">传输数据</font>的一种手段，相比曾经的xml传输数据的手段，Json更高效，更轻便，更灵活，他是以<font color="red">键值对</font>的形式出现的，<font color="red">一个key对应一个value，中间用 **:** 连接</font>，其中所有的数据与的key必须都是双引号的字符串形式，而value的值可以是：

【数值】【字符串】【布尔】【数组】【对象】【Json】【null】

Json的代码表现：

1. 使用大括号封装 { }  ( 代表 Json 对象 )

2. 使用中括号封装 [ ]（ 代表 Json 数组 ）

### 2. 声明 Json 对象

声明一个Json对象，其中 a 为 Object 类型的 Json 对象，通过 alert 语句可以访问到指定 key 的元素

~~~js
var a ={ "a":1 , "b":2 , "c":3 }
alert(a.a)；
~~~

Json 中的 value 中还可以套用 Json

~~~js
var a = {
	"aa" : { "bb":{ "cc":"一个嵌套的Json的值" } }
}
alert(a.aa.bb.cc)
~~~

使用 for-in 来遍历该 Json 对象

~~~js
var json = {
    "a": "字符串a", "b": "字符串b",
    "c": "字符串c", "d": "字符串d"
}
for( var a in json ){
    document.write(json.a + "<br />")
    /*
     * 使用这种遍历的方法是错误的
     * json.a这里的.a并没有当作变量来用，而是作为属性来用的
     * 他代表的是访问json下key为a的value
     * 想把a作为变量来用需要使用[]
     */
    document.write( json[a] + "<br />" )
}
~~~

### 3. Json 数组操作

使用 [ ] 声明的 Json 是 Object 类型的数组，里面可以存放 ≥1 数量的 Json，通过下标可以访问到 Json 以及 Json 中某个 key 具体的值

~~~js
var json[
    { "课程":"Java" , "价格":"21300.00￥" },
    { "课程":"PHP" , "价格" : "16300.00￥" },
    { "课程":"Python" , "价格" : "23100.00￥" }
]
~~~

> 在数组中追加元素

~~~js
json.push({"课程": "Webpack", "价格": "18000￥"})
~~~

> 查询，删除某个元素

~~~js
// indexOf 查询当前对象是否存在，如果存在返回该对象所在的下标，不存在则返回-1
if( json.indexOf(json[0])!=-1 )
    // 从当前位置开始，删除1个元素，也就是他本身
    json.splice(json.indexOf(json[0]), 1)
~~~

> 遍历该 Json 数组

~~~json
for( var a in json ){
    for( var b in json[a] )
    	document.write( b + "：" + json[a][b] + " ， " )
	document.write("<br />")
}
~~~



### 4.  Json的数据转换

#### js 中互相转换

> 在 js 中有一个 JSON 对象，里面封装了两个方法，针对于 Json 与 JS 的格式转换

##### Json → JS

使用 JSON 对象中提供的 stringify( json ) 方法将 Json 类型的对象装换为 js

~~~js
// 声明一个Json对象
var json1 = {"name": "张涵哲","age": "20","sex": "男"}
var json2 = JSON.stringify(json1);
console.log(json2);
~~~

##### JS → Json

使用 JSON 中提供的 parse ( str ) 方法将 Json 类型的对象装换为 js

> 字符串类型的Json必须时单引号扩着双引号

~~~js
// 声明一个Js对象
var js1 = '{"name":"张","age":"20" }';
// JS转换为JSON
var js2 = JSON.parse(js1);
console.log(js2)
~~~



#### Java 中相互转换

> 而如果想在 **Java** 中实现 Json 和对象之间的转换，需要借助一个依赖 jar 包，通过 ObjectMapper 的实例对象 om 进行操作

~~~xml
<dependency>
	<groupId>com.fasterxml.jackson.core</groupId>
	<artifactId>jackson-databind</artifactId>
	<version>2.9.8</version>
</dependency>
~~~

##### Java → Json

~~~java
User user = new User("张涵哲",20,"男");
ObjectMapper om = new ObjectMapper();
String msg = null;
try {  msg = om.writeValueAsString(user); } 
catch (JsonProcessingException e) {  System.out.println("解析失败！"); }
System.out.pringln( msg )
~~~

##### Json → Java 

~~~java
// 这里没有现成的Json对象，就用String拼接一个出来
String json2 = "{\"name\":\"张涵哲\",\"age\":20,\"sex\":\"男\"}";
User user2 = om.readValue(json2, User.class);
System.out.println(user2);
~~~

##### List → Json

~~~java
ArrayList<String> list = new ArrayList<String>();
list.add("啊啊");
list.add("嘿嘿");
String json3 = om.writeValueAsString(list);
System.out.println(json3);
~~~

##### Map → Json 

~~~java
HashMap<String,String> hm = new HashMap<String,String>();
hm.put("1", "21");
hm.put("2", "22");
String json4 = om.writeValueAsString(hm);
System.out.println(json4);
~~~

### 5. MVC 中 Json 中文乱码解决

在向客户端返回Json数据的时候，会产生中文乱码的情况，需要使用@RequestMapping中的produces属性解决

~~~java
@ResponseBody()
@RequestMapping(path = "/json1" , produces = "application/json;charset=utf-8")
public String json1() {
    User user = new User("张涵哲",20,"男");
    ObjectMapper om = new ObjectMapper();
    String msg = null;
    try {
        msg = om.writeValueAsString(user);
    } catch (JsonProcessingException e) {
        System.out.println("解析失败！");
        System.exit(0);
    }
    return msg;
}
~~~



## Ajax 异步处理

ajax 是基于JavaScript 语言，它实现在不刷新页面的情况下向服务器发出请求，达到异步交互，主要依靠的核心对象是 **XMLHttpRequest**

### ajax 对象常用属性

1. **onreadystatechange**

   设置回调函数，当发起请求的时候，服务器会处理请求，在处理结束后会返回一个信号，紧接着调用回调函数，他是在服务器处理完请求后执行的一个函数

2. **readyState**，代表着与服务器交互的过程的变化，通过 0-4 五个数字来表示

   | 数字 | 解释                                   |
   | :--: | -------------------------------------- |
   |  0   | 刚刚创建了XMLHttpRequest对象           |
   |  1   | 打开了与服务器的连接（调用了open方法） |
   |  2   | 向服务器发出了请求（调用了send方法）   |
   |  3   | 服务器将请求处理完毕                   |
   |  4   | 交互正常结束                           |

3. **status**，服务器相应的状态码，等同于http协议的状态码

   | 状态吗 | 解释                     |
   | ------ | ------------------------ |
   | 200    | 表示服务器正常工作       |
   | 303    | 表示服务器内部出现了错误 |
   | 404    | 找不到请求的目标资源     |
   | 500    | 发生了重定向             |

4. **responseText**，封装服务器给客户端响应的文本数据

5. **responseXML**，封装服务器给客户端相应的xml文件类型数据

### ajax 的方法函数

1. open( string str1 , string str2 , boolean b )，打开与服务器的连接，open方法中的三个属性

   | 参数        | 作用                                        |
   | ----------- | ------------------------------------------- |
   | string str1 | 请求的方式，get-post等                      |
   | string str2 | 请求的资源路径                              |
   | boolean b   | 是否开启异步处理，true为开启，false为不开启 |

2. send( string str )，向服务器发出请求，在执行open方法后运行，有一个属性

   str：如果请求方式为post，可以传入 key=value&key=value 的字符串作为参数

   如果为 get 请求，参数可以留空或 null，get 请求传参在打开连接时拼接字符串即可

3. setRequestHeader( str1 , str2 )

   ​	修改请求头信息，==只有post请求需要修改==，get可以忽略，应在打开连接后，发出请求前设置

   ​    str1：被修改的请求头【”Content-type”】

   ​    str2：修改后的值：【”application/x-www-form-urlencoded”】