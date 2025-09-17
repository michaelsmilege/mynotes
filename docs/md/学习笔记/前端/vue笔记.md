# Vue 笔记

## 基本 vue 页面

基本的 vue 页面，需要引用 vue.js 才可以运行，引用地址如下，也可以下载后引用本地文件

~~~
https://cdn.staticfile.org/vue/2.2.2/vue.min.js
~~~

### EL挂载点

el 挂载点，是 ELement（元素）单词的缩写，在new Vue对象的时候需要指定一个标签为挂载点，基于这个挂载点展开操作

挂载点有三种：

1. id 挂载点
2. class 挂载点
3. 元素挂载点

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<script type="text/javascript" src="../js/vue.min.js"></script>
	</head>
	<body>
		<div id="one" class="two"> 这个标签已经被vue接管 </div>
	</body>
	<script type="text/javascript">
		new Vue({
			el: "#one" // id挂载点
			// el: ".two" // class挂载点
			// el: "div" ,  // 元素挂载点
		})
	</script>
</html>
~~~

挂载点也可以理解为作用域，被挂载的标签连同他的子标签都是作用域内有效，挂载点之外Vue不起作用

挂载点可以书写在HTML任何标签上，但唯独**不可以写在 html 和 body 标签上**



### data 数据对象

在绑定挂载点之后，就可以使用 data 数据对象，需要在 vue 实例中声明 data 数据对象，然后在 data 中声明变量名及对应的值，声明规则以 JSON 为基准

~~~js
new Vue({
    el: "#good" ,// id挂载点
    data: {
        message: "vue中的数据"
    }
})
~~~

想要调用并使用 data 数据需要使用 **差值表达式 { {  } }** ，他的效果类似 java 中的 print 方法，负责打印

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<script type="text/javascript" src="../js/vue.min.js"></script>
	</head>
	<body>
		<div id="good"> {{ message }} </div>
	</body>
	<script type="text/javascript">
		new Vue({
			el: "#good" ,// id挂载点
			data: {
				message: "vue中的数据"
			}
		})
	</script>
</html>
~~~

data 数据对象中可以封装简单类型及复杂类型的对象，但是要遵守 JS 的语法规则

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<script type="text/javascript" src="../js/vue.min.js"></script>
	</head>
	<body>
		<font id="fon">
			<!-- 普通数据对象可以直接用双大括号取值 -->
			1.&nbsp;&nbsp;{{ name }}<br />
			<!-- 嵌套Json对象需要使用.来指定某个属性 -->
			2.&nbsp;&nbsp;{{ person.name}} , {{ person.age }}<br />
			<!-- 如果时数组的话需要使用 [ ] 来指定要取指定下标上对应的值 -->
			3.&nbsp;&nbsp;{{ tel[0] }}-{{ tel[1] }}-{{ tel[2] }}<br />
			<!-- 对象中也可以嵌套数组 -->	
			4.&nbsp;&nbsp;{{ test.demo1.arr[0] }}{{ test.demo1.arr[1] }}，
				{{ test.demo2.arr[0] }}{{ test.demo2.arr[1] }}<br />
			<!-- 数组内也可以嵌套Json对象 -->
			5.&nbsp;&nbsp;{{ test.demo3.arr[0].name }}，{{ test.demo3.arr[1].name }}
		</font>
	</body>
	<script type="text/javascript">
		new Vue({
			el: "#fon",
			data: {
				name: "李云龙",
				person: { name: "爱新觉罗·溥仪" , age: 88 },
				tel: [ 155 , 8555 , 7724 ],
				test: {
					name: "测试对象",
					demo1: { arr: ["中国","男足"] },
					demo2: { arr: ["中国","女乒"] },
					demo3: { arr: [ {name:"第一个元素"},{name:"第二个元素"} ] }
				}
			}
		})
	</script>
</html>
~~~



### methods 方法

Vue 实例中可以写 el 挂载点，也可以写 data 数据对象，同时也可以写 methods，等同于 js 的函数，定义方法的格式为：`name: function(){}`，也可以使用缩写 `name(){}`，效果是一致的

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<script type="text/javascript" src="../js/vue.min.js"></script>
	</head>
	<body>
		<div>
			{{ func1() }}  <br />
			{{ func1 }}
		</div>
	</body>
	<script type="text/javascript">
		new Vue({
			el: "div",
		    methods: {
		        func1 : function(){
		     	   return "函数的返回值";
		        }
                // 等同于 func1(){ return "函数的返回值"; }
		    }
		})
	</script>
</html>
~~~

* 在页面调用 func1() 的时候，会调用并执行指定的函数，而调用 func1 的时候，仅仅调用的是他的内存地址

### Vue 基础注意事项

#### data 与 methods 之间的调用问题

在 vue 中，data 就相当于 java 中的一个变量，变量有自己的值，且能够在函数中被使用，在 vue 中也要留意调用问题

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<script type="text/javascript" src="../js/vue.min.js"></script>
	</head>
	<body>
		<div id="roor">
			<button @click="func1()">弹窗测试1</button>
			<button @click="func2()">弹窗测试2</button>
			<br />
			{{ text }} , {{ value1 }} , {{ value2 }}
		</div>
	</body>
	<script type="text/javascript">
		new Vue({
			el: "#roor",
			methods: {
				func1: function(){
					alert("func1: " + this.func2())
				},
				func2: function(){
					alert("func2: " + this.text)
					return "方法2的返回值";
				}
			},
			data: {
				text: "data数据",
				value1: this.text,
				value2: this.func1
			}
		})
	</script>
</html>
~~~

经测试可以得出结论

* data 中声明的变量可以在函数中使用 `this.变量名` 调用
* data 中不可以调用函数获得返回值
* data 中后声明的变量并不能调用先声明的变量
* methods 中声明的函数可以互相调用，不分声明的顺序
* data 和 methds 的调用之前不分声明的顺序



## Vue 指令学习

### 一般指令

#### v-text 指令

设置标签内容的指令，使用方法如下

~~~html
<ul id="ul">
	<li v-text="message"></li>
	<li>{{ zuoyong }}</li>
	<li>{{  "插值表达式中字符串的拼接：" + date }}</li>
	<li v-text="text1">原有内容</li>
	<li>{{ text2 }}原有内容</li>
	<li v-text="text3"></li>
	<li>{{ text3 }}</li>
<li v-text="text4 + text5"></li>
</ul>
~~~

~~~js
new Vue({
	el: "#ul",
	data: {
		message: "通过v-text指令",
		zuoyong: "通过差值表达式",
		date: "2019-11-27",
		text1: "v-text覆盖原有内容",
		text2: "差值表达式不会覆盖",
		text3: "<font color='red'>我会变红嘛</font>",
		text4: "两个v-text",
		text5: "的字符串拼接"
	}
})
~~~

#### v-html 指令

无论是差值表达式还是v-text，输出解析的都只是普通文本，如果想让文本可以解析为html标签，就需要v-html指令

~~~html
<ul id="ul1">
	<li v-text="message"></li>
	<li v-html="message"></li>
</ul>
~~~

~~~js
new Vue({
	el: "#ul1",
	data: {
		message: "<font color='red'>font标签的红色字体</font>"
	}
})
~~~

#### v-on 指令

v-on为事件指令，像绑定JS事件一样来绑定Vue的事件，例如【单击事件】【双击事件】【鼠标滑过】等等

1. 被绑定的事件关键字删除前置的on字母，使用v-on:代替，例如：onclick → v-on:click

2. 还有一种简化的写法，同样删除事件关键字前置的on关键字，用@符号代替

~~~html
<div>
	<button v-on:click="func1">一般v-on单击事件</button>
	<button @click="func1">简化v-on单击事件</button>
	<button @dblclick="func1">简化v-on双击事件</button>
</div>
~~~

~~~js
new Vue({
	el: "div",
	data: {
		text1: "v-on事件"
	},
	methods: {
		func1 : function(){
			alert(this.text1);
		}
	}
})
~~~

#### v-show 指令

v-show通过操作样式来控制元素是否显示的指令，里面可以写boolean值，true为显示，false为不显示，也可以写表达式，最终会计算为boolean

未满十八周岁禁止注册的小例子：

~~~html
<div id="d1">
	<h3>未满十八周岁禁止注册</h3>
	您当前的年龄：
	<button @click="sub()">-</button>
	<span v-text="age">123</span>
	<button @click="add()">+</button>
	<button v-show="age>=18">点击注册</button>
</div>
~~~

~~~js
new Vue({
	el: "#d1" ,
	data: {
		age: 15
	},
	methods: {
		add: function() { this.age++;	},
		sub: function() { this.age--; }
	}
})
~~~

通过操作元素的display属性来控制元素是否显示

<../img src="./../img/vue-03.png" style="float: left" />

#### v-if 指令

v-if通过操作Dom来控制元素是否存在达到显示和隐藏的效果，效果类似与v-show，但是本质上有着区别，v-show是操作元素的display属性，而v-if操作的是当前标签是否存在

还是未满18周岁禁止注册的例子

~~~html
new Vue({
	el: "#d1" ,
	data: {
		age: 15
	},
	methods: {
		add: function() { this.age++;	},
		sub: function() { this.age--; }
	}
})
-------------------------------------------------------------
<div id="d1">
	<h3>未满十八周岁禁止注册</h3>
	您当前的年龄：
	<button @click="sub()">-</button>
	<span v-text="age">123</span>
	<button @click="add()">+</button>
	<button v-if="age>=18">点击注册</button>
</div>

~~~

通过操作Dom控制元素是否存在来达到显示效果，如果某一个元素需要频繁的隐藏或切换的话，那么请使用v-show，相对v-if来说，频繁切换的情况下v-show的效率更高一些

<../img src="./../img/vue-04.png" />

#### v-bind 指令

元素绑定属性，可以控制某个元素的属性的值，当数据发生改变时视图对应的也会发生改变，但视图发生改变时数据不会发生改变

使用方法：

​    1. 直接绑定元素 v-bind:width=""

​    2. 简单绑定元素 :width=""

代码演示：为div填色

~~~css
#div {
	width: 100px;
	height: 60px;
	border: 1px solid black;
}
.d1 {
	background-color: bisque;
}
~~~

~~~html
<!-- 通过三元表达式来控制class属性是否显示 -->
<div v-bind:class=" bool ? 'd1' : ' ' " id="div" v-on:click="setClass()"></div>
<!-- 也可以使用：的缩写进行绑定 -->
<div :class=" bool ? 'd1' : ' ' " id="div" v-on:click="setClass()"></div>
~~~

~~~js
new Vue({
	el: "#div",
	data: {
		bool : false
	},
	methods: {
		setClass: function(){
			this.bool = !this.bool;
		}
	}
})
~~~

#### v-model 指令

- **双向绑定更新数据**

双向绑定，主要用于表单数据和 vue 数据互相绑定，更改 data 的值的时候，data 所对应的视图也会更改，而视图进行更改时，对应的 data 也会发生更改

代码演示-动态验证密码

~~~html
<div id="div">
	<input type="text" v-model:value="message" />
	<br />
	<font size="1">{{ message == password ? '输入正确' : '输入错误' }}</font>
</div>
~~~

~~~js
new Vue({
	el: "#div",
	data: {
		password: "11223344",
		message: ""
	}
})
~~~

- <font color="red">**# 监听表单状态**</font>

v-model 指令最强大的功能是可以监听页面中表单的数据状态

> 分别监听 文本框 单选框 复选框 下拉框 日期 时间 的小案例

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<script type="text/javascript" src="../js/vue.min.js"></script>
		<style type="text/css">
			.color {  color: red;  }
			.size {  font-size: 50px;  }
			.italic {  font-style: italic;  }
		</style>
	</head>
	<body>
		<div id="app">
			<input type="text" v-model="text" /> <br />
			<font color="red">vue监听: {{ text }}</font> <br /> <br />
			
			<input type="radio" name="gender" value="男" v-model="gender" />男
			<input type="radio" name="gender" value="女" v-model="gender" />女
			<br /> <font color="red">vue监听: {{ gender }}</font> <br /> <br />
			
			<input type="checkbox" value="游泳" name="likes" v-model="likes" />游泳
			<input type="checkbox" value="健身" name="likes" v-model="likes" />健身
			<input type="checkbox" value="音乐" name="likes" v-model="likes" />音乐
			<input type="checkbox" value="打游戏" name="likes" v-model="likes" />打游戏
			<br /> <font color="red">vue监听: {{ likes }}</font> <br /> <br />
			
			<select v-model="address">
				<option>北京</option>
				<option>上海</option>
				<option>广东</option>
				<option>深圳</option>
			</select>
			<br /> <font color="red">vue监听: {{ address }}</font> <br /> <br />
			
			<input type="date" v-model="data" />
			<br /> <font color="red">vue监听: {{ data }}</font> <br /> <br />
			
			<input type="time" v-model="time" />
			<br /> <font color="red">vue监听: {{ time }}</font> <br /> <br />
		</div>
	</body>
	<script type="text/javascript">
		new Vue({
			el: "#app",
			data: {
				text: "text文本框",
				gender: "男",
				likes: ["健身","打游戏"],
				address: "北京",
				data: "2020-02-02",
				time: "12:20"
			}
		})
	</script>
</html>
~~~

#### v-for 指令

循环当前标签及子标签，循环的次数是指定数组的长度

使用方法：

​    1. 【(代表数组内的每个值/对象 , 下标 ) in 数组名)】

​    2.  也可以不使用下标【代表数组内的每个值/对象 in 数组名】

~~~html
<div id="div">
	<button v-on:click="add()">点击添加"神舟电脑"商品</button>
	<button v-on:click="del()">点击删除第一个商品</button>
	<table border="1px" cellspacing="0px" cellpadding="5px">
		<tr v-for="(item,index) in arr">
			<td>第 {{ index+1 }} 个商品</td>
			<td>{{ item.name }}</td>
		</tr>
	</table>
</div>
~~~

~~~js
new Vue({
	el: "#div",
	data: {
		arr: [
			{name: "iPhone 11"},
			{name: "Xiaomi cc9 pro"},
			{name: "Redmi Note4X"},
			{name: "VIVO X30"},
			{name: "OPPO Reno Ace"}
		]
	},
	methods: {
		add: function(){
			// 向arr(数组)尾部追加元素
			this.arr.push( {name:"神舟电脑"});
		},
		del: function(){
			// 删除第一个元素
			this.arr.shift();
		}
	}
})
~~~

#### v-bind 高级绑定

可以绑定至class后可以直接输入数组，数组内存放需要使用的class，也可以直接输入对象，对象的key为class，value为Boolean值，为true则生效，false则不生效

绑定至style后，也可以直接将对象输入进去，也可以将对象放进数组中然后输入数组，同样生效

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<script type="text/javascript" src="../js/vue.min.js"></script>
		<style type="text/css">
			.color {  color: red;  }
			.size {  font-size: 50px;  }
			.italic {  font-style: italic;  }
		</style>
	</head>
	<body>
		<div id="app">
			<font :class="msg1">我是一个font标签</font>	<br />
			<font :class="msg2">我是一个font标签</font>	<br />
			<font :style="sty">我是一个font标签</font>	<br />
		</div>
	</body>
	<script type="text/javascript">
		new Vue({
			el: "#app",
			data: {
				msg1: [	"size" , "italic" ],
				msg2: {
					"color":true,
					"size":true,
					"italic":false
				},
				sty: { "color": "blue" , "font-size": "20px" }
			}
		})
	</script>
</html>
~~~



### 内部指令

#### v-pre 指令

v-pre 指令的作用是将代码原样输出，例如以下情况

~~~html
<div id="app">
    我们在学习vue的时候可以使用差值表达式来显示值，
    使用方法是<span v-pre>{{good}}</span>，显示出来的值就是{{good}}
</div>
~~~

~~~js
new Vue({
    el: "#app",
    data: {
        "good": 123
    }
})
~~~

#### v-cloak 指令

使用差值表达式的时候，如果在网速较慢的情况下，会看到在 vue 绑定的值出现之前会把差值表达式的 `{{ }}` 展现出来，等待加载出来后才会把值替换过来，针对这种可以使用 v-cloak 指令配合 css 来解决

> v-cloak 特点：在页面请求的过程中存在，请求结束并收到响应后消失，配合 display 样式可以达到最终效果

~~~css
[v-cloak]{
	display: none;
}
~~~

~~~html
<font id="fon" v-cloak>{{aaa}}</font>
~~~

~~~js
new Vue({
	el:"#fon",
	data:{ aaa: "123" }
})
~~~

在这里可以设置网络速度，用来测试

<../img src="./../img/vue-02.png" />



#### v-once 指令

v-once 指令内的变量只会渲染一次

~~~html
<div v-once>第一次绑定的值：{{message}}</div>
<div><input type="text" v-model="message"></div>
~~~



### Vue 自定义指令

在 vue 中，除开官方提供的几个指令 ( v-if , v-for 等 )，还可以通过自定义指令达到某种效果，自定义指令分别有【全局指令】【局部指令】两种，<font color='red'>自定义指令不能包含大写字母，可能会失效</font>

定义指令需要两个参数：

- 第一个 指令名称，字符串体现，书写指令名称的时候要省略掉 v- 标识符，但是在使用的时候要加上 v- 标识符
- 第二个 指令对象，可以使用匿名对象，有两个
  - 第一个 el 固定参数，代表当前指令所在标签的 DOM 对象
  - 第二个 binding 传入参数，当使用自定义指令时传入了参数，binding 就是传入参数的对象，常用属性有
    - name：代表当前指令名称
    - value：获取接收参数的表达式的值 ( 例如传入表达式 2+3，得到的就是 5 )
    - oldValue：指令绑定的上一个值，仅在 update 和 componentUpdated 钩子中可用
    - expression：获取当前参数的字符串表达形式 ( 例如传入表达式 2+3，得到的就是 2+3 )

传入参数是需要注意，如果传入的参数是

> 自定义 全局指令及使用

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<script src="./js/vue.min.js"></script>
	</head>
	<body>
		<div id="app">
			<font v-setcolor="'blue'">测试数据</font>
		</div>
	</body>
	<script>
		Vue.directive("setcolor", {
			bind: function( el, binding ){
				console.log("name=" + binding.name);
				console.log("value=" + binding.value);
				console.log("oldValue=" + binding.oldValue);
				console.log("expression=" + binding.expression);
				el.style.color = binding.value;
			}
		})
		var v = new Vue({ el: "#app" })
	</script>
</html>
~~~

> 自定义 局部指令及使用

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<script src="./js/vue.min.js"></script>
	</head>
	<body>
		<div id="app">
			<div v-fontcolor>测试局部指令</div>
		</div>
	</body>
	<script>
		var v = new Vue({ 
			el: "#app",
			directives: {
				"fontcolor": {
					bind: function(el){
						el.style.color = "blue";
					}
				}
			}
		})
	</script>
</html>
~~~



**钩子函数**

- bind：指令第一次绑定到元素时调用，只调用一次
  - 函数运行时指令刚刚与 DOM 节点绑定，这是只能使用一些 DOM 的属性操作，例如字体颜色等
- inserted：当前 DOM 对象放入父节点时调用
  - 函数运行时当前 DOM 已经插入到 DOM 树中，可以进行例如 获取焦点 等
- update：被绑定元素所在的模板更新时调用，而不论绑定值是否变化。通过比较更新前后的绑定值，可以忽略不必要的模板更新



**缩写指令**

当自定义一个指令的时候需要指定其中的 bind 或 inserted 等等的钩子函数，但是这么写比较麻烦，可以缩写

<font color="red">缩写的代码同时作用在 ==bind== 和 ==updated== 两个钩子函数中</font>

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<script src="./js/vue.min.js"></script>
	</head>
	<body>
		<div id="app">、
			<div v-fontweight="900">缩写指令测试</div>
		</div>
	</body>
	<script>
        // 创建局部命令
		Vue.directive("fontweight", function(el, binding){
			el.style.fontWeight = binding.value;
		})
		var v = new Vue({  el: "#app" })
	</script>
</html>
~~~



## Vue 的生命周期

vue 的生命周期，又被称为钩子函数，是指 vue 实例从开始到销毁的过程，在生命周期函数中可以运行一些逻辑代码，常用的生命周期函数需要知道以下 8 种即可

按照加载的先后顺序排列：

1.  ==初始化==的生命周期
   - beforeCreate，这个时候的 vue 只是一个空对象，还没有初始化，el，data，methods 等不可用
   - created，vue 初始化完成，可以使用 el，data，methods 等等
2. ==挂载页面==的生命周期
   - beforeMount，vue 已经在内存中加载完成，但并没有挂载到页面中，无法在页面上使用 vue
   - mounted，当 mounted 运行后，vue就已经完全创建好且已经挂在到页面中了，可以正常使用
3. ==更新页面==的生命周期
   - beforeUpdate，此时 vue 中的数据被更改，但是页面上的数据还没有同步
   - updated，vue中的数据被更改，页面上已同步完成
4. ==页面销毁==的生命周期
   - beforeDestroy，当前 vue 实例将被销毁，但是还没有被销毁，data，methods 等可以继续使用
   - destroyed，当前 vue 实例已被销毁，data，methods 等将不可用

代码演示：

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<script type="text/javascript" src="../js/vue.min.js"></script>
	</head>
	<body>
		<div id="roor">
			<button @click="msg = '嘿嘿'">修改为 嘿嘿</button>
			<div id="dd">{{msg}}</div>
		</div>
	</body>
	<script type="text/javascript">
		var v = new Vue({
			el: "#roor",
			data: {
				msg: "哈哈哈哈"
			},
			beforeCreate(){
				console.log("beforeCreate: " + this.msg)
			},
			created(){
				console.log("cerated: " + this.msg)
			},
			beforeMount(){
				console.log("beforeMount: " +  document.getElementById("dd").innerText)
			},
			mounted(){
				console.log("beforeMount: " +  document.getElementById("dd").innerText)
			},
			beforeUpdate(){
				console.log("beforeUpdate: vue的msg已经改为 " + this.msg + "，页面上显示的是 " + document.getElementById("dd").innerText)
			},
			updated(){
				console.log("beforeUpdate: vue的msg已经改为 " + this.msg + "，页面上显示的是 " + document.getElementById("dd").innerText)
			},
            // 没法演示，，，
			beforeDestroy(){},
			destroyed(){}
		})
	</script>
</html>
~~~

控制台图示：

<../img src="./../img/vue-11.png" />





## Vue 的组件

vue 的组件可以理解为一个通用的模板，当一段重复的 html 代码反复的出现在页面中，这个时候就可以将这些重复的代码封装成为一个组件，通过调用组件来实现代码的复用

### 创建一个组件

vue 的组件就是一个对象，里面有有几个常用的属性，例如 template 属性是控制组件内的元素的，<font color="red" >在template中有且只能由一个根元素，如有多个元素需要放在一个标签 ( 例如 div ) 内</font>

> 创建一个组件

~~~js
var com1 = {
    template: "<h1>123</h1>"
}
~~~

> 其中 template 的标签可以放在HTML中书写，而后通过 id 调用

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<script type="text/javascript" src="./js/vue.min.js"></script>
	</head>
	<body>
		<template id="temp1">
			<h1>123</h1>
		</template>
		<div id="roor">
			<zhe></zhe>
		</div>
	</body>
	<script type="text/javascript">
		var zhe = {  template: "#temp1"  }
		new Vue({
			el: "#roor",
			components: {  "zhe": zhe  }
		})
	</script>
</html>
~~~



### 全局组件与局部组件

vue 的组件分为全局组件和局部组件两种，全局组件在所有 vue 实例中都可以使用，而局部组件只能在指定的 vue 实例中使用

1. 声明全局组件：组件注册到 component 之后就会称为全局组件，全局组件有两种调用的方法

   ~~~html
   <html>
   	<head>
   		<meta charset="utf-8">
   		<script type="text/javascript" src="../js/vue.min.js"></script>
   	</head>
   	<body>
   		<div id="app">
               <!-- 1. 将组件名以标签的形式发放在html中 -->
   			<com1></com1>
               <!-- 2. 使用component标签，is的属性为组件的名称 -->
   			<component is="com1"></component>
   		</div>
   	</body>	
   	<script type="text/javascript">
   		// 创建一个组件
   		var zhe = {
   			template: "<font color='green'>绿色-组件</font>"
   		}
   		// 将组件注册到component称为了全局组件
   		Vue.component("com1", zhe)
   		var v = new Vue({
   		    el: "#app",
   		})
   	</script>
   </html>
   ~~~

2. 声明局部组件：放在 vue 实例中就是指定实例的局部组件

   ~~~javascript
   var zhe = {
       // 创建组件
       template: "<font color='red'>红色-局部组件</font>"
   }
   var v = new Vue({
       el: "#app",
       components: {
           // 使用componens注册组件，左侧为组件名称，右侧为组件对象
           "com2": zhe
       }
   })
   ~~~

测试代码：

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<script src="./js/vue.min.js"></script>
	</head>
	<body>
		<div id="app1">
			<com1></com1>
			<com2></com2>
		</div>
		<hr />
		<div id="app2">
			<com1></com1>
			<com2></com2>
		</div>
	</body>
	<script>
		var a = {
			template: "<font color='red'>红色-局部组件</font>"
		}
		Vue.component("com1", {
			template: "<font color='green'>绿色-全局组件</font>"
		})
		var v = new Vue({
			el: "#app1",
			components: {
				"com2": a
			}
		})
		var v = new Vue({
			el: "#app2",
		})
	</script>
</html>
~~~

- 要在组件创建完成后才可以创建Vue对象设置挂载点

### 动态组件切换

在页面中显示组件的方法，除开使用组件名称作为标签名，还可以使用动态标签进行组件的引用

> 使用 component 标签来显示组件，然后使用标签内的 is 属性引用组件名，is 可以被绑定实现动态显示

~~~html
<html lang="en">
<head>
  <script src="../static/js/vue.min.js" type="text/javascript"></script>
  <title>动态组件标签</title>
</head>
<body>
  <div id="app">
    <button @click="flag = !flag">切换组件</button>
    <component :is="flag?'com1':'com2'"></component>
  </div>
</body>
<script>
  var com1 = { template: "<h1>我是com1组件</h1>" }
  var com2 = { template: "<h1>我是com2组件</h1>" }
  new Vue({
    el: "#app",
    data: { flag: true },
    components: {
      "com1": com1,
      "com2": com2
    }
  })
</script>
</html>
~~~

### 组件中的 data

在组件中同样拥有 data ，只不过和 vue 中的 data 不同，组件中的 data 必须是个函数，且必须有返回值，返回值类型必须是key: value的 { } 对象

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<script src="./js/vue.min.js"></script>
	</head>
	<body>
		<div id="app">
			<zhe></zhe>	<zhe></zhe>	<zhe></zhe>
		</div>
	</body>
	<script>
		Vue.component("zhe", {
			template: "<div><font>{{a}}</font> <button @click='a++'>+</button></div>",
			data: function(){
				return { a: 0 }
			}
		})
		var v = new Vue({
			el: "#app"
		})
	</script>
</html>
~~~

vue 中的 data 与组件中的 data 的区别

* vue 中的 data：当你重复使用该组件时，修改其中一个data 的值，其他使用这个变量的组件都会发生改变，类似 java 中的 static 公共变量

- 组件中的 data：当你重复使用该组件时，修改其中一个 data 的值，其他使用这个变量的组件都不会发生改变，每组件中都有自己的 data，互不影响



### 组件通信

#### 父传子-属性

在子组件中可以通过 props 定义变量名，然后通过标签的属性对子组件进行传值，属性名就是子组件 props 的值

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<script src="./js/vue.min.js"></script>
	</head>
	<body>
		<div id="app">
			<zhe :ha="msg"></zhe>
		</div>
	</body>
	<script>
		Vue.component("zhe", {
			props: ["ha"],
			template: "<font>接收到传来的值为: {{ha}}</font>"
		})
		var v = new Vue({ 
            el: "#app"
            data: {
            	msg: "哈哈哈哈"
        	}
        })
	</script>
</html>
~~~

- 当子组件内 data 中定义的值与 prop 接受的值得 key 重复的话，那么使用 {{ key }} 会优先调用 prop 中的
- 当父组件中的值发生改变时，子组件同时也会受到影响，但是子组件内修改却不会影响父组件
- 在向子组件传值时只能使用单向绑定。



子组件中修改接受到的值只对子组件有影响，而不会对父组件产生影响，如果想要实现父子同步的话，可以将传入的值封装为一个对象，调用对象内的值，这样父子就可以同步了

~~~html
<html lang="en">
<head>
  <script type="text/javascript" src="../static/js/vue.min.js"></script>
  <title>子组件修改prop值</title>
</head>
<body>
  <template id="tmp1">
    <div>
      从父组件中获取到的值：{{ msg.a }}
      <br />
      修改父组件的值为：
      <input type="text" v-model="msg.a" style="width: 100px;">
    </div>
  </template>
  <div id="app">
    父组件中的msg：<input type="text" v-model="msg.a" style="width: 100px;">
    <hr />
    <com :msg="msg"></com>
  </div>
</body>
<script>
  var com = {
    props: ["msg"],
    template: "#tmp1"
  }
  new Vue({
    el: "#app",
    data: {
      msg: {
        "a": 1, "b": 2
      }
    },
    components: {
      "com": com
    }
  })
</script>
</html>
~~~



#### 父传子-方法

父组件在向子组件传值的时候，需要通过属性，那么<font color="red">传递方法需要通过事件</font>，事件的名称自定义即可

~~~html
<html>
	<head>
		<meta charset="utf-8" />
		<script src="../js/vue.js" type="text/javascript" charset="utf-8"></script>
	</head>
	<body>
		<div id="app">
			<com1 @abc="test"></com1>
		</div>
	</body>
	<script type="text/javascript">
		var com1 = {
			template: "<button @click='good()'>点击触发父组件方法</button>",
			methods: {
				good(){
					this.$emit("abc")
				}
			}
		}
		new Vue({
			el: "#app",
			methods: {
				test(){
					alert("我是父组件的方法")
				}
			},
			components: {
				"com1": com1
			}
		})
	</script>
</html>
~~~

- @事件名 是自定义的，之后需要在子组件中的 $emit() 中使用事件的名字来获取引用
- 在事件内如果使用 func() 则是调用方法，但如果是 func 则是传递该方法的引用地址，通过这点来传递方法
- 获取父组件方法并不会使原方法有变化，该执行照样执行
- 在调用父组件的函数时如果需要参数，那么追加在 $emit() 的参数列表中



#### 子传父-属性

子组件中的 data 传递给父组件，需要使用到父传子方法，在父组件中定义一个 data 属性和一个方法，将方法传递给子组件，但是子组件使用这个方法需要一个参数，将参数放入后就传给父组件了

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<script type="text/javascript" src="../js/vue.js"></script>
	</head>
	<body>
		<div id="app">
			父亲的钱包余额：{{rmb}}元
			<com1 @func="getRmb"></com1>
		</div>
	</body>
	<script type="text/javascript">
		var com1 = {
			template: "<button @click='toSuper()'>给父亲100元钱</button>",
			methods: {
				toSuper(){
					this.$emit("func", 100);
				}
			}
		}
		new Vue({
			el: "#app",
			data: { rmb: 0 },
			methods: {
				getRmb( rmb ){
					this.rmb += rmb;
				}
			},
			components: { "com1": com1 }
		})
	</script>
</html>
~~~



#### 子传父-方法

子组件向父组件传方法，需要在子组件所在的标签中使用 `ref` 属性来为当前组件起个别名，然后使用 `$refs` 来调用子组件中的方法

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<script type="text/javascript" src="../js/vue.js"></script>
	</head>
	<body>
		<div id="app">
			<com1 ref="com1"></com1>
			<button @click="getAndroid()">点击查看儿子手机</button>
		</div>
	</body>
	<script type="text/javascript">
		var com1 = {
			template: "<h2>老爸，我在这</h2>",
			methods: {
				android(){
					alert("小黄片儿")
				}
			}
		}
		new Vue({
			el: "#app",
			data: {
				rmb: 0
			},
			methods: {
				getAndroid(){
					this.$refs.com1.android();
				}
			},
			components: {
				"com1": com1
			}
		})
	</script>
</html>
~~~





#### 组件传值注意事项

无论是传 data 数据还是传 methods 方法，都不是真正的传给了子组件，而是借助父组件的引用来实现调用

> 例如：在父组件中修改 data 的值，对应的子组件也会被修改

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<script type="text/javascript" src="../js/vue.min.js"></script>
	</head>
	<body>
		<div id="good">
			修改父组件中的msg: <input type="text" v-model="msg" />
			<zhe :msg="msg"></zhe>
		</div>
	</body>
	<script type="text/javascript">
		new Vue({
			el: "#good",
			data: {  msg: "哈哈哈哈"  },
			methods: {
				func1(){  alert( this.msg )  }
			},
			components: {
				"zhe": {
					template: "<div>子组件中的msg：{{msg}}</div>",
					props:["msg"]
				}
			}
		})
	</script>
</html>
~~~

> 例如：在子组件中调用父组件传来的方法，方法中调用父和子中同名的 data，被调用的一定是父中的 data

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<script type="text/javascript" src="../js/vue.min.js"></script>
	</head>
	<body>
		<div id="good">
			<zhe @func1="func1"></zhe>
		</div>
	</body>
	<script type="text/javascript">
		new Vue({
			el: "#good",
			data: {  msg: "父组件中的msg"  },
			methods: {
				func1(){  alert( this.msg )  }
			},
			components: {
				"zhe": {
					template: "<button @click='func1'> 点击测试 </button>",
					data: function(){
						return {  msg: "子组件的msg"  }
					},
					methods: {
						func1(){  this.$emit("func1")  }
					}
				}
			}
		})
	</script>
</html>
~~~





## Vue 全局 API

### mixins 混入

如果当前项目已经开发完毕，这时突然要求要新增一个功能，但是你已经不想在源代码的基础上在去乱改了，这是可以使用到混入的功能，<font color="red">混入，添加其他对象到当前 vue 实例中 ( 按照 vue 的规范书写 )</font>

> mixins 混入是一个数组，可以混入多个对象，可以混入普通函数，也可以混入生命周期函数等等，

~~~html
<div id="app">
    <button @click="add()">add</button>
</div>
~~~

~~~js
var mixins1 = {
    methods: {
        good(){
            console.log("新增加的功能");
        }
    },
    created() {
        console.log("项目初始化！")
    },
}
new Vue({
    el: "#app",
    methods: {
        add(){
            console.log("调用了add方法");
            this.good();
        }
    },
    mixins: [mixins1]
})
~~~

- 混入的生命周期函数和本身的生命周期函数相比优先级较高，但如果当前实例中已经存在了混入的同名方法，那么会默认调用本身的而不调用混入的



### extends 扩展

extend 扩展，和混入几乎一模一样

~~~html
<div id="app">
    <button @click="add()">add</button>
</div>
~~~

~~~js
var extend1 = {
    methods: {
        good(){
            console.log("新增加的功能");
        }
    },
    created() {
        console.log("项目初始化！")
    },
}
new Vue({
    el: "#app",
    methods: {
        add(){
            console.log("调用了add方法");
            this.good();
        }
    },
    extends: extend1
})
~~~

- 混入的生命周期函数和本身的生命周期函数相比优先级较高，但如果当前实例中已经存在了混入的同名方法，那么会默认调用本身的而不调用混入的



### 修改差值表达式符号

在 vue 中使用插值表达式 `{{ }}` 可以直接输入实例中的 data 数据，但是当 vue 框架的差值表达式和其他框架的表达式发成冲突，这时可以使用 `delimiters` 修改插值表达式的使用规则

>  `delimiters` 是一个数组，需要两个参数做为头尾，使用 *[ 做为开始标记，] 做为结束标记

~~~html
<div id="app"> *[msg] </div>
~~~

~~~js
new Vue({
    el: "#app",
    data: {
        "msg": "测试数据"
    },
    delimiters: ["*[", "]"]
})
~~~





### computed 计算属性

计算属性，就像名字一样，可以和 data 中的数据一样作为属性直接调用，但是与 data 不同的是，计算属性向方法一样，可以将值提前计算好，在使用时直接调用计算好的值

methods完全可以代替 computed，但是 computed 和 methods 不同的是，computed 是依赖于缓存，只要缓存数据不变，那么就不工作

相比来说 computed 性能更高，但是如果想避免缓存问题还是要使用 methods

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<script src="./js/vue.min.js"></script>
	</head>
	<body> </body>
	<script>
		var v = new Vue({
			el: "#app",
			data: {
				message: "哈哈哈"
			},
			computed: {
				msgFunc: {
					get: function(){
						return this.message;
					},
					set: function( value ){
						this.message = value;
					}
				}
			}
		})
		document.write("set前：" + v.message);
		// 执行set方法
		v.msgFunc = "嘿嘿嘿";
		document.write("<br />set后：" + v.message);
	</script>
</html>
```



### watch 监听属性

在 vue 中可以使用两种不同的方法监听

1. vue 对象内的 watch 属性

   ~~~javascript
   var v = new Vue({
       el: "#app",
       data: {
           s: 0
       },
       watch: {
           // 通过watch进行监听
           s: function( value ){
               alert("s 修改后的值为：" + value);
           }
       }
   })
   ~~~

2. 通过 vue 对象调用监听实例

   ~~~javascript
   var v = new Vue({
       el: "#app",
       data: {
           s: 0
       }
   })
   // 第一个参数是被监听的对象，第二个参数是回调函数，回调函数在监听到数据被修改的一瞬间执行
   // 回调函数的第一个参数是修改后的值，第二个参数是修改前的值，变量名随便起
   v.$watch("s", function(end, begin){
       alert( begin + "→" + end );
   })
   ~~~

小练习：

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<script src="./js/vue.min.js"></script>
	</head>
	<style> input{width: 100px;} </style>
	<body>
		<div id="app">
			千米：<input type="text" v-model="km" />
			米：<input type="text" v-model:value="m" />
			<div id="info"></div>
		</div>
	</body>
	<script>
		var v = new Vue({
			el: "#app",
			data: {
				km: 0,
				m: 0
			},
			watch: {
				// 通过watch进行监听
				km: function( value ){
					this.m = value * 1000;
				},
				m: function( value ){
					this.km = value / 1000;
				}
			}
		})
		// 调用监听的实例方法，回调函数在监听到数据被修改的一瞬间执行
		v.$watch("km", function(end, begin){
			document.getElementById("info").innerText = 
					"千米从" + begin + "变成了" + end;
		})
	</script>
</html>
~~~



## Vue 动画

在 vue 中可以通过 v-if 或者 v-show 指令，来对元素进行显示和隐藏的效果，但是表现太过生硬，这里需要使用到vue 中的动画

### 进场和离场过渡

在元素显示和隐藏的过程中添加一个透明度的过渡，针对进场和离场，Vue 提供了四个样式

|  class样式  |   对应时间点    |
| :---------: | :-------------: |
|  .v-enter   | 进场 首部时间点 |
| .v-enter-to | 进场 尾部时间点 |
|  .v-leave   | 离场 首部时间点 |
| .v-leave-to | 离场 尾部时间点 |

进场的两个时间点之间的过程叫做 `v-enter-active`，离场的两个时间点的过程叫 `v-leave-active`

通过四个样式对应的时间点，配合 css 的 transition 样式来完成进场和离场的过渡效果，<font color="red">被 vue 控制的动画必须要在 transition 标签内才有效果</font>

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<script type="text/javascript" src="../js/vue.min.js"></script>
		<style type="text/css">
			.v-enter{
				opacity: 0;
				transform: translateX(-100px);
			}
			.v-leave-to{
				opacity: 0;
				transform: translateX(100px);
			}
			.v-enter-active { transition: all 0.5s ease; }
			.v-leave-active { transition: all 1.0s ease; }
		</style>
	</head>
	<body>
		<center id="roor">
			<button @click="flag=!flag">显示/隐藏</button>
			<transition>
				<h1 v-show="flag">哈哈哈哈</h1>
			</transition>
		</center>
	</body>
	<script type="text/javascript">
		var v = new Vue({
			el: "#roor",
			data: { flag: false }
		})
	</script>
</html>
~~~

### 区分多个动画

当我们定义多个标签进行进场和入场时，他们会共用同一个过渡动画，需要区分过渡动画

可以发现无论时进场的样式还是离场的样式都有一个 v- 作为前缀，v- 前缀是 vue 的默认全局样式，这里可以通过自定义的样式来区分不同的动画

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<script type="text/javascript" src="../js/vue.min.js"></script>
		<style type="text/css">
			.v-enter, .v-leave-to{  opacity: 0;  }
			.v-enter-active, .v-leave-active{
				transition: opacity 0.5s ease;
			}
			.a-enter, .a-leave-to{ opacity: 0; }
			.a-enter-active, .a-leave-active{
				transition: all 1.0s ease;
			}
		</style>
	</head>
	<body>
		<div id="roor">
			<button @click="flag1=!flag1">显示/隐藏</button>
			<transition>
				<h1 v-show="flag1">哈哈哈哈</h1>
			</transition>
			<hr />
			<button @click="flag2=!flag2">显示/隐藏</button>
			<transition name="a">
				<h1 v-show="flag2">哈哈哈哈</h1>
			</transition>
		</div>
	</body>
	<script type="text/javascript">
		var v = new Vue({
			el: "#roor",
			data: {
				flag1: false,
				flag2: false
			}
		})
	</script>
</html>
~~~

<font color="red">使用不同的前缀，在 transition 标签中的 name 属性设置前缀，如不设置 name 则默认 -v</font>

### 切换效果

在使用 vue 动画设置进场和离场的过渡时融入组件的切换，实现 <font color="red">先离场，再进场</font> 的淡入淡出

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<script type="text/javascript" src="../js/vue.min.js"></script>
		<style type="text/css">
			.v-enter{
				opacity: 0;
				transform: translateY(40px);
			}
			.v-leave-to {
				opacity: 0;
				transform: translateX(40px);
			}
			.v-enter-active, .v-leave-active {
				transition: all 0.3s ease;
			}
		</style>
	</head>
	<body>
		<div id="app">
			<button @click="flag=!flag">切换组件</button>
			<transition mode="out-in">
				<component :is="flag?'com1':'com2'"></component>
			</transition>
		</div>
	</body>	
	<script type="text/javascript">
		var zhe1 = { template: "<div><font size='4' color='green'>绿色-组件</font><br /></div>" }
		var zhe2 = { template: "<div><font size='4' color='red'>红色-组件</font><br /></div>" }
		Vue.component("com1", zhe1)
		Vue.component("com2", zhe2)
		var v = new Vue({
		    el: "#app",
			data: { flag: true }
		})
	</script>
</html>
~~~



## router 路由

vue 的路由需要引用他的 js 文件才可以使用，文件位置：https://unpkg.com/vue-router/dist/vue-router.min.js

### 路由的引与使用

vue-router 被称为前端路由，他负责在前端组件之间来回切换实现跳转的功能，使用前端路由后网页的地址栏会有 `#/` 的标识，这就代表这路由引用成功了，<font color="red">一定要优先引用 vue.js，然后在引用 vue-router 才可以正常使用</font>

> 模拟登陆和注册

<../img src="./../img/vue-09.png" />

- 当多个组件匹配了同一个 path 时，只有第一个匹配成功的生效，后面的将被覆盖

### 网页跳转实现

上面就是一个简单的路由的实例，通过修改地址栏达到访问不同组件的跳转，下面将使用超链接实现跳转，因为时基于路由实现跳转，所以要在 /login 前面加上 # 代表访问的是路由

~~~html
<body>
    <div id="roor">
        <a href="#/login"><button>登陆</button></a>
        <a href="#/regis"><button>注册</button></a>
        <router-view />
    </div>
</body>
~~~

针对链接跳转，vue-router 提供了专属的 router-link 标签：

- to: 属性代表跳转的目标地址，不需要携带 #
- tag: 代表他在网页的表现形式，默认会被渲染为 a 标签
- to，tag 属性都可以被 vue 进行绑定传值

~~~html
<body>
    <div id="roor">
        <router-link to="/login" tag="button">登陆</router-link>
        <router-link to="/regis" tag="button">注册</router-link>
        <router-view />
    </div>
</body>
~~~

### 设置首页-默认显示组件

默认情况下当我们访问首页的时候应该是提示我们登陆，然后我们手动的切换登陆和注册，而不是访问首页时显示空白，这里可以设置默认显示的组件

> 第一种方法：当访问根目录时也跳转到 login 组件

~~~html
var router = new VueRouter({
    routes: [
        { path: "/", component: login },
        { path: "/login", component: login },
        { path: "/regis", component: regis }
    ]
})
~~~

> 第二种方法：使用重定向的方法进行跳转

~~~javascript
var router = new VueRouter({
    routes: [
        { path: "/", redirect: "/login" },
        { path: "/login", component: login },
        { path: "/regis", component: regis }
    ]
})
~~~

### 设置路由访问高亮

当一个页面有多个路由跳转链接时，例如导航栏，这个时候希望被选择的链接有高亮显示：

我们可以通过控制台发现，当有多个超链接路由时，被选中的那个超链接会动态的绑定一个class属性：

<../img src="./../img/vue-10.png" />

> 可以利用这一特点来对被点击的链接进行修饰：↓ ↓ ↓

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<script type="text/javascript" src="../js/vue.min.js"></script>
		<script type="text/javascript" src="../js/vue-router.min.js"></script>
		<style type="text/css">
			a {  text-decoration: none;  }
			.router-link-active {
				color: red;
			}
		</style>
	</head>
	<body>
		<div id="roor">	
			<router-link to="/list1">首页</router-link>
			<router-link to="/list2">账户</router-link>
			<router-link to="/list3">个人信息</router-link>
			<router-link to="/list4">关于我们</router-link>
			<hr /> <router-view />
		</div>
	</body>
	<script type="text/javascript">
		var list1 = {  template: "<h1>这个是首页的组件</h1>"  }
		var list2 = {  template: "<h1>这个是账户的组件</h1>"  }
		var list3 = {  template: "<h1>这个是个人信息的组件</h1>"  }
		var list4 = {  template: "<h1>这个是关于我们的组件</h1>"  }
		var router = new VueRouter({
			routes: [
				{ path: "/", redirect: "/list1" },	// 默认是首页
				{ path: "/list1", component: list1 },
				{ path: "/list2", component: list2 },
				{ path: "/list3", component: list3 },
				{ path: "/list4", component: list4 }
			]
		})
		var v = new Vue({
			el: "#roor",
			router: router
		})
	</script>
</html>
~~~

上面的 `router-link-active` 是 vue-router 提供的样式名称，我们在创建对象的时候修改他的默认 class 名称

~~~javascript
var router = new VueRouter({
    routes: [
        { path: "/", redirect: "/list1" },	// 默认是首页
        { path: "/list1", component: list1 },
        { path: "/list2", component: list2 },
        { path: "/list3", component: list3 },
        { path: "/list4", component: list4 }
    ],
	// 创建对象的时候修改他的默认 class 名称，这里可以配合Bootstrap使用
    linkActiveClass: "zhe-active"
})
~~~

### 组件切换动画效果

结合 vue 四个时间段的动画和组件切换的知识点，实现组件切换淡入淡出的效果

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<script type="text/javascript" src="../js/vue.min.js"></script>
		<script type="text/javascript" src="../js/vue-router.min.js"></script>
		<style type="text/css">
			a {  text-decoration: none;  }
			.router-link-active, .zhe-active{
				color: red;
			}
			.v-enter, .v-leave-to {
				opacity: 0;
				transform: translateX(100px);
			}
			.v-enter-active, .v-leave-active {
				transition: opacity 0.5s ease, transform 0.5s ease;
			}
		</style>
	</head>
	<body>
		<div id="roor">	
			<router-link to="/list1">首页</router-link>
			<router-link to="/list2">账户</router-link>
			<hr />
			<transition mode="out-in">
				<router-view />
			</transition>
		</div>
	</body>
	<script type="text/javascript">
		var list1 = {  template: "<h1>这个是首页的组件</h1>"  }
		var list2 = {  template: "<h1>这个是账户的组件</h1>"  }
		var router = new VueRouter({
			routes: [
				{ path: "/", redirect: "/list1" },	// 默认是首页
				{ path: "/list1", component: list1 },
				{ path: "/list2", component: list2 }
			],
			linkActiveClass: "zhe-active"
		})
		var v = new Vue({
			el: "#roor",
			router: router
		})
	</script>
</html>
~~~

### $route 路由传参

$router 是 VueRouter 的一个对象，在跳转至一个组件的时候如果携带了一些参数，可以通过他获取到传递的参数，获取传递参数有两种方法

#### 通过 query 获取参数

$router 对象中的 query 属性可以接受这种拼接字符串的传参

> 当前请求 #/login?user=admin 时

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<script type="text/javascript" src="../js/vue.min.js"></script>
		<script type="text/javascript" src="../js/vue-router.min.js"></script>
	</head>
	<body>
		<div id="roor">
			<router-link to="/login?user=哈哈">登陆</router-link>
			<router-view></router-view>
		</div>
	</body>
	<script type="text/javascript">
		var login = {
			template: "<div>登陆成功！{{$route.query.user}}</div>",
			created(){
				console.log(this.$route)
			}
		}
		var router = new VueRouter({
			routes: [
				{ path: "/login", component:login }
			]
		})
		var v = new Vue({
			el: "#roor",
			router: router
		})
	</script>
</html>
~~~

<../img src="./../img/vue-12.png" />

#### 通过 params 属性获取

使用 query 可以获取到以 ? & 拼接字符串形式的参数，除开这种方式还可以使用 params 属性获取，使用 params 获取的参数需要以 :占位符 的形式来进行传参

> 当访问 #/login/:id/:name 时

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<script type="text/javascript" src="../js/vue.min.js"></script>
		<script type="text/javascript" src="../js/vue-router.min.js"></script>
	</head>
	<body>
		<div id="roor">
			<router-link to="/login/001/张涵哲">登陆</router-link>
			<router-view></router-view>
		</div>
	</body>
	<script type="text/javascript">
		var login = {
			template: "<div>登陆成功！{{$route.params.id}}--{{$route.params.name}}</div>",
			created(){
				console.log(this.$route)
			}
		}
		var router = new VueRouter({
			routes: [
				{ path: "/login/:id/:name", component:login }
			]
		})
		var v = new Vue({
			el: "#roor",
			router: router
		})
	</script>
</html>
~~~



### 路由嵌套

一般在项目中，不会只使用一层路由，往往会有好几层路由嵌套使用，例如 `首页` 是一个组件，，然后首页中又有 `登陆` 和 `注册` 两个组件，这时的 `登陆` 和 `注册 `就是首页的 <font color='red'>子路由</font>

实现 **子路由** 需要在实例化路由对象中使用 **children** 实现

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<script type="text/javascript" src="../js/vue.min.js"></script>
		<script type="text/javascript" src="../js/vue-router.min.js"></script>
	</head>
	<body>
		<template id="index">
			<div>
				<h2>这里是首页，有登陆和注册两个功能</h2>
				<router-link to="/index/login">登陆</router-link>
				<router-link to="/index/regis">注册</router-link>
				<router-view></router-view>
			</div>
		</template>
		<div id="roor">
			<router-link to="/index">首页</router-link>
			<router-view></router-view>
		</div>
	</body>
	<script type="text/javascript">
		var index = {
			template: "#index"
		}
		var login = {
			template: "<font color='red'>登陆的组件</font>"
		}
		var regis = {
			template: "<font color='red'>注册的组件</font>"
		}
		var router = new VueRouter({
			routes: [
				{ 
					path: "/index", component: index,
					children: [
						{ path: "login", component:login },
						{ path: "regis", component:regis }
					]
				}
			]
		})
		var v = new Vue({
			el: "#roor",
			router: router
		})
	</script>
</html>
~~~

在使用路由嵌套时需要注意：

- children 中的子路由的中的 path 不能以 / 开头，以 / 开头默认匹配的根目录

### 视图命名

在 vue 的路由中，可以定义一个组件显示在某一个页面上，如果两个组件匹配了同一个路径，同时当前路径中有两个 router-view，那么处理方法就是：

1. 将相同路径的组件放在 components 中，为每个组件命名
2. 通过视图中的 name  属性来区分显示的组件

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<script type="text/javascript" src="../js/vue.min.js"></script>
		<script type="text/javascript" src="../js/vue-router.min.js"></script>
	</head>
	<body>
		<div id="root">
            <!-- 如果不指定name，那么默认显示default -->
			<router-view></router-view>
			<router-view name="com2"></router-view>
		</div>
	</body>
	<script type="text/javascript">
		var com1 = {  template: "<h2 style='color: red'>组件 1<h2>"  }
		var com2 = {  template: "<h2 style='color: red'>组件 2<h2>"  }
		var router = new VueRouter({
			routes: [
				{ 
					path: "/", components: {
                        // 左侧为组件命名，在右侧指定目标组件，default表示默认值
						"default": com1,
						"/": com2
					}
				}
			]
		})
		new Vue({
			el: "#root",
			router: router
		})
	</script>
</html>
~~~



### 编程式导航

一般在一个项目中，不可能完全依靠 `<router-link />` 标签进行路由跳转的，当逻辑代码执行完成后可能会有一个跳转功能，例如登陆成功后会跳转到网站首页，这个时候就需要用到编程式导航了

编程式导航有三个操作点

~~~js
// 类似于浏览器中的 上一页
this.$router.go(-1)
// 类似于浏览器中的 下一页
this.$router.go(1)
// 将页面跳转到指定导航页面
this.$router.push('/');
~~~





### 监听路由地址变化

监听器最强大的地方不是监听 data 数据，而是 vue 中任何数据都可以被他监听，例如路由中的地址

> $route 中的 path 属性对应的就是请求地址

~~~html
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<script type="text/javascript" src="../js/vue.min.js"></script>
		<script type="text/javascript" src="../js/vue-router.min.js"></script>
	</head>
	<body>
		<div id="root">
			<router-link to="/login" tag="button">登陆</router-link>
			<router-link to="/regis" tag="button">注册</router-link>
			<hr />
			<router-view></router-view>
		</div>
	</body>
	<script type="text/javascript">
		var login = {
			template: "<h2>这个是登陆的组件</h2>"
		}
		var regis = {
			template: "<h2>这个是注册的组件</h2>"
		}
		var router = new VueRouter({
			routes: [
				{ path: "/login", component: login },
				{ path: "/regis", component: regis }
			]
		})
		var v = new Vue({
			el: "#root",
			router: router,
			watch: {
				"$route.path"( newVal, oldVal ){
					console.log( oldVal + " → " + newVal )
				}
			},
		})
	</script>
</html>
~~~

- 在监听 path 属性的时候，由于有一个点 **.** 为特殊符号，所以要用引号将其引起来规避语法错误



## vue 异步请求

异步请求又叫 Ajax，是指在不刷新网页的前提下向后台发送请求并获取到响应数据，以此来加强用户体验

### resource 请求

vue-resource 的互联网地址如下，可以下载至本地引用

~~~
https://cdn.staticfile.org/vue-resource/1.5.1/vue-resource.min.js
~~~

发起 get 请求的步骤，携带参数直接在 url 后面跟上 ?key=value&key=value 即可

~~~js
this.$http.get('URL').then( function(result) {
    console.log(result);
})
~~~

发起 post 请求的步骤

```js
this.$http.post('URL', {'key':'value', 'key': 'value'})
    .then(function (result) {
    	console.log(result.body)
	}
)
```



## Vue-Cli 2.x 脚手架

### **安装 vue-cli**

在控制台全局安装 vue-cli，这里需要说一点关于安装 vue 时的版本问题

~~~shell
# 使用下面这段代码安装 vue-cli 的版本最高不会超过 3
npm install vue-cli -g
# 如果想要使用 3 以上的版本请按照下面这段代码进行安装
npm install @vue/cli -g
~~~

安装成功后可以使用 `vue -V` 来查询版本号信息， -V 的 V 一定要是大写字母



### 项目创建流程

创建项目目录，使用 cmd 打开当前目录，输入 <font color="red">vue init webpack 项目名</font> 开始创建

> 上述指令中项目名可以省略不写，默认以当前所在的文件夹的名称作为项目名

~~~shell
# 是否在在当前目录中生成项目？
? Generate project in current directory? (Y/n)
# 项目名称，最好不要有大写字母，不然会报错
? Project name (vuecli1)
# 项目描述
? Project description (A Vue.js project)
# 作者
? Author
# 这个选择第一个默认，显示standalone即可
? Vue build 
# 是否安装vue路由，否
? Install vue-router? (Y/n)
# 是否使用ESLint对代码进行lint  否
? Use ESLint to lint your code? (Y/n)
# 是否设置单元测试  否
? Set up unit tests (Y/n)
# 是否安装e2e  否
? Setup e2e tests with Nightwatch?
# 是否为您运行"npm install"命令安装依赖 是
Should we run `npm install` for you after the project has been created?
~~~

> 创建完成后运行项目：npm run dev，编译运行后便可以在 localhost:8080 访问当前项目了



### 项目配置修改

- 修改项目运行端口号：

  在当前项目下的 config 目录下的 index.js 文件中，找到 port 修改为指定的端口号



### 使用路由组件

在创建项目的时候，是否使用路由的选项选择是，这样 vue 就会自动将路由安装并配置完成了，如果没有选择安装，也可以手动安装，在当前项目目录下，控制台输入以下命令，就可以安装路由

~~~shell
npm install vue-router --save
~~~

在路由安装完成之后，新建一个 js 文件作为路由的配置文件，暂且命名为 router.js，在里面进行环境搭建

> 需要使用 import 引用 vue 和 vue-router 组件并使用才是路由配置文件

~~~js
import Vue from 'vue';
import VueRouter from "vue-router";
import hello from '@/components/hello'

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        { path: "/hello", component: hello }
    ]
})
~~~

将文件配置完成之后在 main.js 中将路由配置进来

~~~js
import Vue from 'vue'
import App from './App'
import router from './coms/router'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  components: {
    "app": App
  },
  router: router,
  template: "<app></app>"
})
~~~

然后在页面默认显示的位置添加上 ` <router-view />` 标签即可



### Axios 请求

resource 在 vue 2.0 之后就停止更新和维护了，所以才有了 Axios，它的互联网地址如下，可以下载本地引用

~~~html
https://unpkg.com/axios@0.19.2/dist/axios.min.js
~~~

使用 axiox 调用 get 或 post 方法发起相应的请求，其中：

- .then 是回调函数，result 是请求后的相应数据，在函数体内对数据进行操作
- .catch 是异常函数，当请求发生异常的时候回调用该函数进行善后工作

GET 请求操作：

> get 请求传输参数的时候直接在 url 后面跟上 ?key=value&key=value 即可

```js
axios.get('URL')
    .then( function(response){
        console.log(response);
    }).catch(function(){
        console.log("出錯了，，，")
	}
)
```
POST 请求操作：

> post 请求携带参数需要在参数列表传入一个 json，通过 json 携带参数

```js
axios.post('URL', {'key': 'value','key': 'value'})
    .then(function( result ) {
    	console.log(result);
	}).catch(function( error ) {
    	console.log(error);
	}
)
```


## vue 扩展程序

百度下载谷歌扩展程序 `vue-devtools`下载，然后将扩展名改成 `.zip` 的压缩文件并将其解压，得到文件：

<../img src="./../img/vue-05.png" />

将文件放在一个不会被改变的位置，然后打开 Google 浏览器右上角的设置，更多工具，扩展程序

<../img src="./../img/vue-06.png" />

紧接着点击开启扩展程序页面右上角的 `开发者模式` ，然后多出来三个选项，点击 `加载已解压的扩展程序`，找到之前存放扩展程序的位置即可添加成功

<font color="red">想使用vue增强工具需要编辑vue.js文件，将其中的 `devtools: !1` 中的 ！删除，否则工具可能会失效</font>

<../img src="./../img/vue-07.png" />

vue-devtools 的正常工作截图 **↓**

<../img src="./../img/vue-08.png" />



### vuex状态管理

一般我们在写登陆页面的时候，登陆成功会将相关全局信息放在 session 中进行保管，vuex 就是相当于 session 的一个技术，用来存放全局的变量

#### vuex 简单实例

1. 安装 vuex 状态管理：在当前项目目录下使用一下命令进行安装：

~~~shell
npm install vuex --save
~~~

2. 在安装完成之后，在项目中创建 vuex 的 js 文件并配置：

~~~js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        msg: "vuex中的数据"
    }
})
~~~

> 不要忘记将文件引入到 main.js 中

3. 在组件中使用 vuex 中定义的数据

~~~html
<!-- 不需要再组件中进行多余操作，直接通过$store引用就可以 -->
<template>
    <div>{{$store.state.msg}}</div>
</template>
~~~



#### state 状态对象

在 store.js 中定义全局变量的时候可以发现，变量都是定义在 state 中的，state 是状态对象，所有变量都会放在state 中进行存放

~~~js
export default new Vuex.Store({
    state: {
        msg: "vuex中的数据"
    }
})
~~~

将 store.js 引用到 mainj.js 后，vuex 就可以全局使用了，获取 vuex 中数据：

~~~js
// 在页面中获取数据
{{$store.state.msg}}
// 在组件中获取数据
this.$store.state.msg
~~~

通过 `store.state.name` 可以获取到 state 中存放的数据，但是这样一来前缀有点太多了，我们可以利用计算属性将 state 来存储起来：

~~~js
export default {
    computed: {
        state(){
            return this.$store.state;
        }
    }
}
~~~

这样以后想要调用 vuex 中的 msg 就直接使用 `state.msg` 就可以了



#### mutations 修改状态

在 state 中可以存放变量，那么针对变量进行修改也一定是可以的，vuex 中除了有 state 之外还有 mutations，他用来存储公共的函数，可以利用函数来对 state 中的数据进行修改

在 mutations 中定义方法，将 state 作为参数穿进去，通过 state 来对变量进行修改

~~~js
export default new Vuex.Store({
    state: {
        count: 10
    },
    mutations: {
        setCount( state ){
            state.count ++;
        }
    }
})
~~~

方法定义完成之后需要在页面中引用，在组件中创建一个按钮，创建事件调用该方法

> $store 中的 commit 代表要调用方法，然后将想要调用的方法的名称作为参数传过去即可

~~~html
<template>
    <div>
        {{state.msg}}
        <button @click="$store.commit('setCount')">+</button>
    </div>
</template>
~~~

> 如果在定义方法的时候需要接受参数，例如 `setCount( state, number )`，参数需要跟在方法名的后面

~~~html
<template>
    <div>
        {{state.msg}}
        <button @click="$store.commit('setCount', 123)">+</button>
    </div>
</template>
~~~



### axios 异步请求

在脚手架中使用 axios 异步请求，首先要在当前项目下安装请求：

~~~shell
npm install axios --save
~~~

然后在项目中加以使用，注意在使用的时候有一个小技巧：

~~~js
// 在 mian.js 中
import axios from 'axios'
// 挂在到vue实例原型
Vue.prototype.axios = axios
~~~

当把 axios 挂载到实例原型后，就可以在实例中直接使用 `this.axios` 进行调用使用了



<font color="red">**# 注意！**</font>在 vue-cli 开发过程中，不可避免的会产生跨域请求，但是跨域请求在 post 请求携带参数时会出问题，这时候需要额外添加一个依赖：

~~~shell
npm install qs --save
~~~

~~~js
import qs from 'qs';
Vue.prototype.$qs = qs;
~~~

然后在传入参数时使用 qs 对参数进行解析

~~~js
this.axios.post( (this.state.server_url+"user/login"),
	this.$qs.stringify({
		'userId': this_.login.username,
		'userPwd': this_.login.password
	})
)
~~~


