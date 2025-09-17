# Node.JS简单了解

node.js 是基于Chrome JavaScript 运行时建立的一个平台，简单说就是不需要浏览器就可以执行 javascript 代码

## 安装及配置

### 下载安装 Node.js

访问官网下载安装合适的 node.js：https://nodejs.org/zh-cn/，下载好后双击安装，全程下一步即可

~~~shell
# 使用cmd检测node是否安装成功
C:\Users\Administrator>node -v   # 查看node版本
v10.16.3
C:\Users\Administrator>npm -v    # 查看npm版本
6.9.0
~~~



### 修改安装及缓存路径

默认情况下，当我们安装了某个全局包的时候，是存放在C盘的，具体存放路径可在控制台输入`npm root -g`查看，但是我们想要将目录修改为自己的，需要进行以下操作：

**1. **在 node 的安装目录新建两个文件夹   全局包下载 `node_global`，node缓存 `node_cache`

![](../img/node-01.jpg)

**2. **执行命令修改两个目录：

~~~shell
npm config set prefix "node_global目录"
npm config set cache "node_cache目录"
~~~



### 修改环境变量

当我们修改了全局安装路径及缓存后，环境变量还是没有修改的，需要去修改环境变量

**1. **在用户变量 `path` 中添加自己创建的 `node_global` 目录

**2. **系统变量中新建 `NODE_PATH` 为 node 安装目录下的 `modules` 目录

**3. **在系统变量中的 `path` 中添加 node 的安装目录，这个一般在安装的时候就会自动添加，如果没有就手动添加



## NPM 简单介绍

### NPM 简单了解

npm 是用来辅助 node.js 的包管理工具，类似 maven 一样可以下载各种包/依赖，目前的 node 基本在安装的时候就将 npm 一并安装好了

> npm 的简单命令

| 命令语法                        | 解释                              |
| ------------------------------- | --------------------------------- |
| npm -v                          | 查看当前安装的 npm 的版本         |
| npm install npm -g              | 升级 npm 版本号                   |
| npm config set proxy [location] | 设置代理服务器，null 代表关闭代理 |

> 全局安装与本地安装

**本地安装** 是安装在当前目录下的 `node_modules` 目录中，如果目标目录不存在的话会自动生成，语法为：

~~~shell
npm install @vue/cli
~~~

**全局安装** 是安装在之前配置的两个目录中，`-g` 代表 global 全局的意思

~~~shell
npm install -g @vue/cli
~~~

> 更多命令

| 命令语法                | 解释                                                       |
| ----------------------- | ---------------------------------------------------------- |
| npm init                | 初始化简单的 package.json 文件                             |
| npm init --yes\|-y      | 初始化简单的 package.json 文件，偷懒不用一直按enter        |
| npm inistall 包名       | 本地安装，安装到项目目录下，不在 package.json 中写入依赖   |
| npm inistall 包名 -g    | 全局安装，安装在 Node 安装目录下的 node_modules 下         |
| npm inistall 包名 -s    | 本地安装，并在 package.json 文件的 dependencies 中写入依赖 |
| npm inistall 包名 -D    | 本地安装，等价于--save -dev                                |
| npm uninstall 包名      | 本地卸载                                                   |
| npm uninstall 包名 -g   | 全局卸载                                                   |
| npm info 包名           | 可以查看指定包的历史版本                                   |
| npm inistall 包名@x.x.x | 在安装指定包的时候使用@可以指定安装的版本                  |

### 安装淘宝镜像

我们在使用 npm 安装某些依赖的时候，会发现安装非常的慢，因为 npm 默认的国外的下载地址，这个时候我们就可以通过安装淘宝镜像来解决这个问题，淘宝镜像对应的是 `cnpm`

~~~shell
# 全局安装淘宝镜像
npm install -g cnpm --registry=https://registry.npm.taobao.org
~~~

安装完成之后简单使用一下：

~~~shell
# 一般安装vue
npm install -g @vue/cli
# 淘宝镜像安装vue
cnpm install -g @vue/cli
~~~



### 安装 NRM 源管理器

除了安装 cnpm 淘宝镜像之外还有一种方法可以安装淘宝镜像，那就是 nrm 源管理器，首先我们来安装 nrm 源管理器：

> 全局安装 nrm 源管理器

~~~shell
npm i nrm -g    # 这里也可以使用cnpm安装，当前前提得安装淘宝镜像
~~~

等待安装完成之后我们可以通过查看版本号来检测是否安装成功：

~~~shell
# 看到版本号，安装成功
C:\Users\Administrator>nrm -V
1.2.1
~~~

接下来我们通过源管理器来更管 npm 的源设置 `nrm use taobao`：

~~~shell
# use代表选择，选择使用淘宝的镜像
C:\Users\Administrator>nrm use taobao
   Registry has been set to: https://registry.npm.taobao.org/
~~~

这样一来我们继续使用 npm 进行下载的时候，使用的就是淘宝的源了，除开淘宝之外还可以切换一些其他的源：

~~~shell
# taobao 前面带有*就表示当前选择是淘宝镜像，第一个npm就是默认的国外镜像
C:\Users\Administrator>nrm ls

  npm -------- https://registry.npmjs.org/
  yarn ------- https://registry.yarnpkg.com/
  cnpm ------- http://r.cnpmjs.org/
* taobao ----- https://registry.npm.taobao.org/
  nj --------- https://registry.nodejitsu.com/
  npmMirror -- https://skimdb.npmjs.com/registry/
  edunpm ----- http://registry.enpmjs.org/
~~~





## Node.JS 体验

> 写一个 helloword 程序

我们新建一个  `hello.js` 文件，在里面书写 js 的代码：

~~~js
console.log("Hello Node.js!");
~~~

让我们来运行刚刚创建好的程序：

~~~shell
# 程序成功执行了！
PS D:\Workspase\VScode\Node> node hello.js
Hello Node.js!
~~~



> 写一个 helloword 的接口

还是和刚才一样创建一个 `http1.js` 文件，书写以下代码：

~~~js
let http = require('http');  // 引入HTTP模块
let port = 8000;   // 设置启动端口

// 创建一个HTTP服务
http.createServer( (req, resp)=>{
    // 设置响应头【状态码，响应类型等等】
    resp.writeHead(200, {'Content-Type': 'text/plain'});
    // 发送响应数据 "HelloWorld, Http"
    resp.end('HelloWorld, Http');
}).listen(port); // 在目标端口启动

// 打印一个启动成功的提示，不然什么提示都没有很尴尬
console.log("Http server runing! at port " + port);
~~~

让我们来执行并访问一下：

~~~shell
PS D:\Workspase\VScode\Node> node http1.js
Http server runing! at port 8000
~~~

![](../img/node-02.jpg)