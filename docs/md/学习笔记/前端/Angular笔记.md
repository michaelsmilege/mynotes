# Angular 脚手架

Angular 环境搭建

安装  angular8 需要 node 版本最低是 `10.13`，我的 node 是 `8.17.0`，那么就指定版本安装

~~~shell
# 查看版本，低于要求请跟新版本
node -v
npm -v
~~~

~~~shell
# 安装typescript，可跳过
npm install -g typescript
# 安装 angular
npm install @angular/cli@7.3.6 -g
~~~

~~~shell
# 可以使用当前命令查看是否安装成功
ng v
~~~



## 创建一个程序

安装完成后创建一个angular 程序，使用 `ng new 项目名称`，创建项目时有两个步骤需要操作：

~~~shell
# 是否安装Angular的路由组件
? Would you like to add Angular routing? (y/N)
# 选择需要使用的样式表文件
Which stylesheet format would you like to use? (Use arrow keys)
~~~

项目创建完成后，在控制台输入 `ng serve` 便可以运行 angular 程序，也可以使用 `npm start`，效果是一样的，angular 的默认端口号为 4200



## 目录结构讲解

在 angular 生成的目录结构中，有一些是比较重要的，一定要了解：

- `e2e` 前端测试模块
- `node_modules` 类似 java 中的 lib，添加的所有组件都会存放在该文件夹下
- `src` 编写 angular 项目都在当前目录下进行操作
  - `app` 为组件目录，angular 中的所有组件都是放在 app 目录下进行存放的
    - `app.module.ts`  根模块，用来注册组件
    - `app-routing.module.ts` 路由组件
  - `assets` 资源目录，需要引用的图片或字体文件等等可以放在该目录下
  - `environments` 环境配置，可以针对各种环境编写不一样的配置文件
  - `browserslist` 配置浏览器支持
  - `index.html` Angular 依靠组件进行单页面开发，最终会挂在到 index.html 文件中
  - `main.ts` 项目的入口文件
  - `polyfills.ts` 填充库文件
  - `styles.css` 引用全局性质的样式文件 ( 例如 bootstrap 的样式文件 )



## 组件的创建及使用

在 vue 中，组件有三部分组成，分别是 html 部分，js 部分，css 部分，angular 中的组件也是同理，不过 vue 中的三种类型代码在同一个文件中编写，而 angular 的组件是分开编写的

>组件内部的html代码及css样式都是单独的文件进行组合而成的

~~~typescript
// 引入angular核心功能
import { Component, OnInit } from '@angular/core';
// 组合当前组件的html及css代码
@Component({
  selector: 'app-login',	// 使用组件的组件名称
  templateUrl: './login.component.html',  // 引用的html代码
  styleUrls: ['../app.component.css']     // 引用的css代码
})
// 将对象暴露出去
export class LoginComponent implements OnInit{
  constructor() {}  // 构造方法，执行优先级最高
  ngOnInit() {}     // 生命周期函数，是OnInit中实现的接口方法
}
~~~

组件创建完成后需要在 `app.module.ts` 文件中使用 import 引用并在 declarations 中注册：

~~~ts
import { LoginComponent } from './login/login.component';
@NgModule({
  省略...
  declarations: [
    LoginComponent
  ],
  省略...
})
export class AppModule { }
~~~

<hr />
创建组件其实可以不需要引用多个文件，完全可以一个文件来书写组件，只不过有些麻烦：

> 将外部的代码集成到该文件中，降低了可读性且不方便，不推荐使用

~~~ts
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-login',
  template: `<h1>这里写html代码</h1>`,
  style: `这里写css代码`
})
export class LoginComponent implements OnInit{
  constructor() {}
  ngOnInit() {}
}
~~~

<hr />
这是最方便的创建组件的方法，在当前项目目录下，使用命令 `ng g component 组件名` 即可在 app 目录下创建一个以组件名命名的文件夹，里面的文件关联及 `app.module.ts` 的注册都自动配置成功，直接去使用即可！~

~~~shell
# 在app目录下创建一个user组件
ng g component user
# 在user组件下创建一个login组件
ng g component user/login
~~~



## app.module.ts 配置文件

正常在我们创建组件的时候会在该配置文件下进行注册以便使用，但是 `app.module.ts` 的功能远不止注册组件

~~~ts
// 引入浏览器的解析模块，用来解析组件
import { BrowserModule } from '@angular/platform-browser';
// angular的核心组件，必须引用
import { NgModule } from '@angular/core';

// 注册组件之前需要将被注册的组件引用到当前文件中
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GetComponent } from './get/get.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  // 注册组件-自己创建的组件
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    GetComponent,
  ],
  // 注册模块-Angular提供的功能模块，默认是不使用的，需要引用后在这里注册
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  // 配置项目中需要开启的服务
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
~~~



## 组件模板的书写

angular 的组件主要是一个 typescript 组件，在组件内可以定义变量及函数，定义变量时需要携带修饰符及类型：

修饰符：【public】【private】【protected】

类型分为以下几种：

- 布尔类型 boolean
- 数字类型 number
- 字符串类型 string
- 对象类型 object
- 数组类型 array
- 元祖类型 tuple
- 枚举类型： enum
- 任意类型 any
- 空类型 null undefined void never

定义一个标准的变量：

~~~ts
export class LoginComponent {
    public name:string = '张涵哲';
    public list:any[] = [1,2,3];
}
~~~



### 数据绑定指令

一般在 html 中会使用一些在 ts 中定义好的变量，可以直接使用 `{{}}` 来进行调用，针对标签中的属性也可以使用花括号传值，但是除开这个方法之外还可以使用 **[ 属性 ] 数据绑定** 来实现目标效果

> 例如有一个变量为 msg='我是一个title'

~~~html
<!-- 数据调用 -->
<div>{{msg}}</div>
<!-- 绑定数据到属性中 -->
<div [title]="msg" >这是一个div标签</div>
<!-- 将数据解析为html标记语言 -->
<div [innerHTML]="msg" ></div>
~~~



### 流程控制指令

**流程控制指令分为循环和判断**

> *ngFor 循环指令

~~~html
<ul *ngFor="let item of list; let key=index">
    <li>{{key}}--{{item}}</li>
</ul>
~~~

>*ngIf 判断指令

~~~html
<ul *ngFor="let item of list; let key=index">
    <li *ngIf="key%2==1" style="color: red;">{{key}}--{{item}}</li>
    <li *ngIf="key%2==0" style="color: blue;">{{key}}--{{item}}</li>
</ul>
~~~

> ngSwitch 分支语句

~~~html
<div [ngSwitch]="state">
    <div *ngSwitchCase="'1'" style="color: blueviolet">星期1</div>
    <div *ngSwitchCase="2" style="color: blueviolet">星期2</div>
    <div *ngSwitchCase="'3'" style="color: blueviolet">星期3</div>
    <div *ngSwitchCase="'4'" style="color: blueviolet">星期4</div>
    <div *ngSwitchCase="'5'" style="color: blueviolet">星期5</div>
    <div *ngSwitchDefault style="color: blueviolet">今天放假！</div>
</div>
~~~



### 动态改变样式

**动态操作class**

> 这里定义了 boolean 类型的 flag，可以通过操作 flag 属性动态修改 class 属性，class 属性需要单引号

~~~html
<div [ngClass]="{'color-red': flag, 'color-blue': !flag}">这是一个div标签</div>
~~~

**动态操作 style**

> 和 class 类似，在 ngStyle 中可以直接为属性赋值，也可以使用变量赋值实现动态效果

~~~html
<div [ngStyle]="{'color': 'red', 'background-color': cor}">这是一个div标签</div>
~~~



### Angular 管道

管道，就相当于 vue 中的过滤器，当使用管道后原本输出的内容会被管道进行处理，显示的是处理后的内容

**常用管道：**

| 管道                       | 作用                                                 |
| -------------------------- | ---------------------------------------------------- |
| uppercase                  | 将所有字母转换为大写字母                             |
| lowercase                  | 将所有字母转换为小写字母                             |
| date:'yyyy-MM-dd HH:mm:ss' | 将data时间进行格式化，后面跟上格式化的样式           |
| number:'1.2-4'             | 小数格式化，最小有一个整数位，小数位至少2个，最多4个 |
| json                       | 将 object 对象解析为 json 字符串                     |

**使用管道：**

~~~html
<p>管道处理打印的date对象：{{time | date:'yyyy-MM-dd HH:mm:ss'}}</p>
~~~

**自定义管道：**





### 表单事件

在使用表单事件之前需要先掌握普通事件如何调用：

> ==使用括号 ( ) 将事件名称括起来==，然后在指定事件触发后执行的代码即可

~~~ts
func1(){  console.log("这是点击事件")   }
func2(){  console.log("这是滑过事件")   }
~~~

~~~html
<button (click)="func1()">点击事件</button>
<button (mousemove)="func2()">滑过事件</button>
~~~

**表单事件**

> 在键盘按下时传入了一个 $event 参数，通过这个参数可以获取到表单相关的信息

~~~typescript
down( e ){  console.log( e );  }
~~~

~~~html
监听键盘按下事件<input type="text" (keydown)="down($event)">
~~~



### 双向数据绑定

<font color="red">在 angular 中想要使用双向绑定，必须要在 `app.module.ts` 中引用模块：</font>

~~~ts
import {FormsModule} from "@angular/forms";
imports: [ FormsModule ]
~~~

在引入了双向绑定的模块之后就可以进行使用了：

~~~html
<h2>Angular 的双向绑定</h2>
单向绑定测试 <input type="text" [value]="msg1"> {{msg1}}
<br />
双向绑定测试 <input type="text" [(ngModel)]="msg2"> {{msg2}}
~~~

<hr />
**表单双向绑定实例：**

~~~ts
public model:object = {
    username: "",
    sex: "",
    likes: [false, false, false],
    address: "",
    birthday: ""
}
~~~

~~~html
<div class="content">
    <h2>表单&angular交互联系</h2>
    姓名:
    <input type="text" [(ngModel)]="model.username"> 
    {{model.username}}<br> <br>
    性别：
    <input type="radio" [(ngModel)]="model.sex" id="sex1" value="男"> 
    <label for="sex1">男</label>
    <input type="radio" [(ngModel)]="model.sex" id="sex2" value="女"> 
    <label for="sex2">女</label> --- {{model.sex}}
    <br> <br>
    爱好：
    <input type="checkbox" [(ngModel)]="model.likes[0]" value="运动" id="like1"> 
    <label for="like1">运动</label>
    <input type="checkbox" [(ngModel)]="model.likes[1]" value="游戏" id="like2"> 
    <label for="like2">游戏</label>
    <input type="checkbox" [(ngModel)]="model.likes[2]" value="编程" id="like3"> 
    <label for="like3">编程</label>
    {{model.likes | json}}<br> <br>
    住址：
    <select [(ngModel)]="model.address" name="address">
        <option value="沈阳">沈阳</option>
        <option value="青岛">青岛</option>
        <option value="大连">大连</option>
    </select>
    --- {{model.address}}<br> <br>
    生日：<input type="date" [(ngModel)]="model.birthday" >
    -- {{model.birthday}}
</div>
~~~

<font color="red">双向绑定在 form 表单内无效</font>



### 静态资源调用问题

在 angular 的组件模板中调用静态资源文件，例如图片字体等等，首先要知道静态资源存放目录是 `assets` 目录下，引用也无需使用 `./ 或者 ../` 之类，直接访问该目录即可：

~~~html
<!-- 无视目录，直接使用assetc即可访问目标文件夹  -->
<../img src="assets/google.jpg" title="这是一张图片">
~~~



## 服务的创建和使用

在 angular 有服务这样一个概念，可以在服务中存放属性或方法，可以在各个组件对其进行调用，我姑且把它理解为 angular 版的 vuex

服务同组件一样，需要先创建他，创建服务的方法：

~~~shell
ng g service 服务名
~~~

这样在 app 目录下就会生成两个服务文件，创建完成后还不能立即使用，需要到 `app.module.ts` 文件中 import 引用并在 providers 处注册服务，这样才可以使用该服务

~~~ts
import {GetService} from './service/get/get.service';
providers: [GetService],
~~~



**使用服务**

在组件中使用服务，同样也要使用 import 引用该服务，然后可以直接 new 将服务实例化使用

> 实例化要再和 import 同级位置进行实例化

~~~ts
import {Component, OnInit} from '@angular/core';
import {GetService} from "../service/get/get.service";

var get = new GetService();

@Component({
    selector: 'app-model02',
    templateUrl: './model02.component.html',
    styleUrls: ['./model02.component.css']
})
export class Model02Component {
    constructor() {
        console.log(get.msg);
    }
}
~~~

这样就通过实例化对象的方法使用了服务，但是 angular 并不推荐这么使用，所以正常应该这样：

> 在方法内使用 get 属性来代替 GetService 实例化的过程

~~~ts
constructor(public get:GetService) {
    console.log(get.msg);
}
~~~

- 在构造方法中声明的属性，在当前实例中任何位置都可以调用
- get 服务可以在多个组件同时生效，在第一个组件对服务内的属性进行修改，那么第二个组件会看到第一个组件修改后的参数，可以当成 vue 中的状态管理进行使用

**服务的调用问题：**

- 组件于服务之间是单向通信，也就是组件可以调用服务的方法及属性，但是服务不能调用组件

- 但是服务和服务之间是双向通信，也就是服务于服务之间可以互相调用



## DOM操作及生命周期函数

### OnInit 函数

在使用命令创建一个 angular 组件的时候，ts 文件中的 class 会默认的实现一个接口：`OnInit`，且复写了其中的ngOnInit 做为生命周期方法

> ngOninit 方法的执行时机是在原生 dom 加载完毕后：

~~~html
<div>
    <p id="p1">这是第一个p标签</p>
    <p id="p2" [innerText]="str">这是第二个p标签</p>
</div>
~~~

~~~ts
public str:string = "我是angular中的值";
ngOnInit() {
    // 使用dom操作p1
    let p1:any = document.getElementById("p1");
    console.log(p1.innerText)

    // 使用dom操作p2
    let p2:any = document.getElementById("p2");
    console.log(p2.innerText)
}
~~~

可以发现，在 ngOnInit 方法中获取的两个 dom 节点的内容，都是原生的内容，使用 angular 对 p2 进行的赋值并没有被 dom 获取到，所以一般不建议在 ngOnInit 方法中操作 dom

### ngAfterViewInit 函数

那么除开 ngOnInit 函数之外，还有一个生命周期函数就是 `ngAfterViewInit `，他并不是从接口中复写而来的，而是当前 class 默认自带的生命周期函数

> ngAfterViewInit 执行时机是当前dom加载完毕且于angular结合后

~~~html
<div>
    <p id="p1">这是第一个p标签</p>
    <p id="p2" [innerText]="str">这是第二个p标签</p>
</div>
~~~

~~~ts
public str:string = "我是angular中的值";
ngAfterViewInit () {
    // 使用dom操作p1
    let p1:any = document.getElementById("p1");
    console.log(p1.innerText)

    // 使用dom操作p2
    let p2:any = document.getElementById("p2");
    console.log(p2.innerText)
}
~~~

可以发现，如果在当前生命周期函数下操作 dom，获取到的 p2 的值是经过 angular 处理过的值，所以如果在程序中要对 dom 进行操作的话建议在当前方法下进行操作

### ViewChild 操作 DOM

在 angular 中操作 dom，除开使用原生的 js 代码之外，还可以使用 angular 提供的 `ViewChild` 进行操作

> angular 的组件中默认时不支持使用 ViewChild 的，需要先添加他的引用才可以使用，添加引用的方法是：

~~~ts
import {Component, OnInit, ViewChild} from '@angular/core';
~~~

> 引用添加完成后，对要获取 dom 对象的标签使用 # 进行标识

~~~html
<p #ps id="p2" [innerText]="str">我是一个p标签</p>
~~~

> 而后在组件中获取当前节点的 dom 对象，获取到之后就可以对他进行正常的 dom 操作了

~~~ts
public flag:string = "我是angular中的值";
@ViewChild("ps") ps:any;

ngAfterViewInit(){
    console.log(this.ps.nativeElement.innerText)
}
~~~

需要注意的是：

1. ViewChild 将 dom 对象封装在了自身的 nativeElement 属性中，操作 dom 需要先调用他
2. <font color="red">无论是原生 js 操作 dom 还是 ViewChild 操作dom，都要在 ngAfterViewInit 函数中，原因是一样的</font>

### 所有生命周期函数

上面只介绍了 ngOnInit 和 ngAfterViewInit 两个生命周期函数，也是最为常用的生命周期函数，在 Angular 中的生命周期函数远不止这两个，这里就要详细演示一下所有的生命周期函数

~~~ts
export class LifeComponent {

    public msg:string = "组件中的msg"

    constructor() {
        console.log('1-构造函数---除了使用简单的值对局部变量进行初始化之外，什么都不应该做')
    }
    
    ngOnChanges() {
        console.log('2-ngOnChages--- 当父组件向子组件传值 或被传入到子组件的值发生变化时执行');
    }
    ngOnInit() {
        console.log('3-ngOnInit--- 一般将初始化时的Ajax写在这里');
    }
    ngDoCheck() {
        console.log('4-ngDoCheck--- 检测作用，当前实例中的某个属性被改变时执行');
    }
    ngAfterContentInit() {
        console.log('5-ngAfterContentInit--- 当把内容投影进组件之后调用');
    }
    ngAfterContentChecked() {
        console.log('6-ngAfterContentChecked执行了--- 每次完成被投影组件内容的变更检测之后调用');
    }
    ngAfterViewInit(): void {
        console.log('7-ngAfterViewInit---- 组件，视图及子视图加载完毕执行，一般在这里操作DOM');
    }
    ngAfterViewChecked() {
        console.log('8-ngAfterViewChecked---- 每次做完组件视图和子视图的变更检测之后调用');
    }
    ngOnDestroy() {
        console.log('9-ngOnDestroy执行了····');
    }

    //自定义方法
    changeMsg() {
        this.msg = "数据改变了";
    }

}
~~~





## Angular 组件通信

组件通信，因为 angular 属于单页面开发，页面中的每个功能都是使用组件进行显示的，但是每个组件之间的数据不同，有时候又难免需要其他组件传来数据来执行本组件的逻辑，这个时候就需要用到组件通信了

所谓的父子组件，假如当前程序中有三个组件，分别是 Home，Header，Main，负责显示的组件是 Home，在Home 组件中分别引用并显示了 Header，Main，这时 Home 就是 Header，Main 的父组件， Header，Main 也是 Home 的子组件



### 父组件获取子组件数据

在父组件中获取子组件中的属性或者函数，需要用到一个之前就学习过的知识：`ViewChild` 模块，他可以在父组件中主动的去获取子组件中的属性及函数

> 获取子组件中的属性及函数

~~~html
<!-- 父组件在引用子组件的时候，为他添加一个ViewChild标识 -->
<app-header #son></app-header>
~~~

~~~ts
// son代表的就是子组件的实例，然后在父组件中就可以使用子组件中的内容了
// 其中的good，logA都是在子组件中事先定义好的属性及方法

public title: string = "父组件的参数";
@ViewChild("son") son:any;
getGood() {
    console.log(this.son.good)
}
getLogA() {
    this.son.logA();
}
~~~



### 子组件获取父组件中的数据

子组件获取父组件需要在子组件中引用一个 `Input` 模块，这样就可以接受父组件传来的参数了

> 获取父组件中的属性及函数

~~~html
<!-- 在父组件中使用单向绑定将自己传入给子组件 -->
<app-header [super]="this"></app-header>
~~~

~~~ts
// 在子组件中使用Input获取到父组件传入的对象并使用
public title:string="undefined";
@Input() super:any;

// 获取父组件信息的方法
getTitle(){
    this.title = this.super.title;
}
getLogB(){
    this.super.logB();
}
~~~

~~~html
<!-- 子组件的HTML代码 -->
我是Header组件: {{title}}
<br />
<button (click)="getTitle()">获取父组件的title属性</button>
<button (click)="getLogB()">获取父组件的logB函数</button>
~~~



## HTTP 服务

在 angular 中内置了 HTTP 服务可以发起请求，想要使用它必须要在 `app.module.ts` 文件中引用并注册

~~~ts
import { HttpClientModule } from '@angular/common/http';
imports: [ ... HttpClientModule ... ],
~~~

> 发起请求示例：

~~~ts
import {HttpClient} from "@angular/common/http";

constructor(public http: HttpClient) { }
ngOnInit() {
    this.getRequest();
    this.postRequest();
}
// 发起Get请求
getRequest(){
    let url = "请求的目标地址";
    this.http.get(url).toPromise().then( res=>{
        console.log(res)
    }).catch( err=>{
        console.log("[Error] 请求失败！ 异常信息如下：")
        console.log(err)
    })
}
// 发起Post请求
postRequest(){
    let url = "请求的目标地址";
    this.http.post(url).toPromise().then( res=>{
        console.log(res)
    }).catch( err=>{
        console.log("[Error] 请求失败！ 异常信息如下：")
        console.log(err)
    })
}
~~~



> 封装HTTP服务

关于 HTTP 请求这里就不详细记笔记了，封装一个通用服务来简化传值，cookie 等设置：

```js
// 封装好的HTTP服务
export class HttpService {

    public baseUrl: string = "http://localhost:8080";

    constructor(private http: HttpClient) { }

	// path为请求的路径，和baseUrl拼接后形成完成的请求URL
    get(path: string, data: any = null){
        // withCredentials：允许携带Cookie，保持sessionid一致
        // params：请求时需要携带的参数
        let param = {withCredentials: true, params: data};
        return this.http.get(this.baseUrl + path, param).toPromise();
    }

    post(path: string, data: any = null){
        // withCredentials：允许携带Cookie，保持sessionid一致
        // params：请求时需要携带的参数
        let param = {withCredentials: true, params: data};
        return this.http.post(this.baseUrl + path, null, param).toPromise();
    }

}
```

```js
// 使用方法：
export class HomePage {

    constructor(private http: HttpService) { }

    login(){
        this.http.post("/login").then(res=>{
            console.log("res", res);
        }).catch(err=>{
            console.log("err", err);
        })
    }
    
    logout(){
        this.http.get("/logout").then(res=>{
            console.log("res", res);
        }).catch(err=>{
            console.log("err", err);
        })
    }

}
```





## Angular 的路由