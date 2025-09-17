# jQuery学习笔记

jQuery 是一个快速、简洁的 JS 框架，它封装 JS 中常用的功能代码，提供一种简便使用方式，优化HTML文档操作、事件处理、动画设计和 AJAX 请求

想要在页面上使用 jQuery 需要添加引用：`https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js`



> jQuery初体验

1. 页面加载完成后执行 JS

~~~html
<script>
    // 我们在页面上想要在页面加载完成后执行 JS 代码，需要使用window的onload
    /* window.onload = function(){
        console.log(123);
    } */
    // jQuery中也可以实现相同的功能：
    jQuery(function(){
        console.log(123);
    })
</script>
~~~

2. jQuery 的简化写法

~~~html
<script>
    // 我们每次使用jQuery的时候都需要写一长串的单词，让人不爽
    // 这里jQuery为我们提供了简化的写法，就是美元符号：$
    // 使用 $ 符可以代替jQuery这个单词进行使用，以后也会使用这个符号进行练习
    $(function(){
        console.log(123);
    })
</script>
~~~

3. 替换 $ 符号

~~~html
<script>
    // 在之后，我们可能会引入多个JS文件，$符可能会与其他JS文件产生冲突
    // 这里我们可以选择重新定义一个变量JQ来代替jQuery这个单词，首先我们先来看看jQuery是什么
    console.log(jQuery);
    // 通过打印得知jQuery变量其实是一个全局的函数，想要更名的话只需要在定义一个变量赋值这个引用即可
    let JQ = jQuery;
    // 通过新的变量来代替jQuery进行操作
    JQ(function(){
        console.log(123);
    })
</script>
~~~

~~~html
<script>
    // 上面那种方法经测试可行，但是网上更流行的是种写法，同样也是可行的
    let JQ = jQuery.noConflict();
    JQ(function(){
        console.log(123);
    })
</script>
~~~



## 选择器练习

> 认识选择器

~~~html
<body>
    <p id="p1">P标签</p>
</body>
<script>
    // 上面有一个p标签id为p1，我们想要获取到他的dom对象需要使用如下方法：
    window.onload = function(){
        let p1 = document.getElementById("p1");
    }
</script>
~~~

但是这样写起来代码太长了，jQuery 为我们提供了强大的选择器，我们可以用过选择器来获取 DOM 节点



### 基本选择器

> 三大基本选择器

~~~html
<body>
    <p id="p1">p标签</p>
    <div> div标签 </div>
    <span class="sp">span标签1</span>
    <span class="sp">span标签2</span>
</body>
<script>
    $(function(){
        let p1 = $("#p1");     // ID选择器
        let div = $("div");    // 标签选择器
        let span = $(".sp");   // class选择器
    })
</script>
~~~



> 编程式选择器

这里只简单写了几个常用的选择器，之后有用到的随时百度查

~~~html
<body>
    <p>1</p>    <p>2</p>    <p>3</p>
    <p id="p4">4</p>
    <p>5</p>    <p>6</p>    <p>7</p>
</body>
<script>
    $(function(){
        // 这里要频繁使用p4这个jQuery对象，这里就暂时存起来了
        let p = $("#p4");
        let p1 = p.next("p");     // 获取下一个同级的p
        let p2 = p.nextAll("p");  // 获取后面所有同级的p
        let p3 = p.prev("p");     // 获取上一个同级的p
        let p4 = p.prevAll("p");  // 获取所有同级的p
        let p5 = p.siblings("p"); // 获取同级所有的p
    })
</script>
~~~





### 层级选择器

jQuery 的选择器也支持层级关系，我们可以通过层级关系获取指定的目标元素

~~~html
<body>
    <div>div1</div>
    <div>div2</div>
    <div id="div">
        div3
        <span>span1</span>
        <span>
            span2
            <span>span2-1</span>
            <span>span2-2</span>
        </span>
        <span>span3</span>
    </div>
    <div>div3</div>
    <div>div4</div>
</body>
<script>
    $(function(){
        let ojb1 = $("#div>span");  // 子选择器
        let ojb2 = $("#div span");  // 后代选择器
        let ojb3 = $("#div+div");  // 兄弟选择器
        let ojb4 = $("#div~div");  // 兄弟选择器
    })
</script>
~~~

- obj1：子选择器：选择当前标签的*下一级标签*中所有符合条件的标签
- ojb2：后代选择器：选择当前标签下*所有标签*中符合条件的标签
- ojb3：兄弟选择器：+ 表示选择同级后面*第一个*符合条件的标签
- ojb3：兄弟选择器：~ 表示选择同级后面*所有*符合调钱的标签



### 常用的过滤选择器

当我们无法精准的获取到目标元素的时候，就可以使用过滤器进行操作

~~~html
<body>
    <ul>
        <li>12</li>
        <li>34</li>
        <li>56</li>
        <li>78</li>
        <li>90</li>
    </ul>
</body>
<script>
    $(function(){
        // 直接获取li会返回多个li，通过 :first来获取数组中第一个li元素
        let obj1 = $("li:first");
        // 同 :first想法，:last用于获取最后一个元素
        let obj2 = $("li:last");
        // 返回所有li中索引为偶数的元素，0也算作为偶数
        let obj3 = $("li:even");
        // 同:even相反，:odd用于取基数 (可以利用奇偶数来做隔行变色的说)
        let obj4 = $("li:odd");
        // 获取索引大于2的li
        let obj5 = $("li:gt(2)");
        // 获取索引小于2的li
        let obj6 = $("li:lt(2)");
        // 通过下标获取执行li
        let obj7 = $("li:eq(2)");
    })
</script>
~~~



### 更多选择器

更多选择器我是记不过来了，这里只记录了几个比较常用的选择器，需要使用更多随时查询

`https://blog.csdn.net/pseudonym_/article/details/76093261`



## 元素操作

和 JS 一样，我们可以通过 jQuery 对象获取到这个标签的所有信息，而且比 JS 操作要便捷的多

### 一般元素操作

以这段 HTML 代码为例：

~~~html
<body>
    <div id="d1" title="我是title">哎呦不错哦</div>
    <div id="d2">
        <span></span>
        <span>
            <img src=""/>
        </span>
    </div>
</body>
~~~



> 获取操作

~~~html
<script>
    $(function(){
        // 获取d1的属性title的值
        let title = $("#d1").attr("title");
        // 获取d1标签内的内容(仅文本)
        let text = $("#d1").text();
        // 获取d1标签内的内容(HTML也会以文本方式读取)
        let text = $("#d1").html();
        // 获取d2标签内的所有子标签
        let children = $("#d2").children();

        /* 这里针对children数组，可以用jQuery的each函数进行遍历 */
        
        // 在匿名函数中this代表的就是数组中的每个元素
        children.each(function(){
            console.log(this);
        })
        // 但是如果使用的是箭头函数，this的指向就会发生改变，不过我们还是可以通过参数列表获取信息
        children.each(function(index, item){
            // 第一个是下标，第二个对应着数组内的元素
            console.log(index, item);
        })
    })
</script>
~~~

> 修改操作

~~~html
<script>
    $(function(){
        // 修改d1的属性title的值
        $("#d1").attr("title", "哎呦不错哦");
        // 修改d1标签内的文本(不会被渲染为HTML)
        $("#d1").text("<font color='red'>font标签/font>");
        // 修改d1标签内的文本(会被渲染为HTML)
        $("#d1").html("<font color='red'>font标签/font>");
        // 修改d2标签下第二个span下的第一个img的src属性
        $("#d2")
            .children().eq(1)
        	.children().eq(0)
        	// 除开attr，prop也可以操作标签的属性
        	.prop("src", "../img/hello.jpg");
    })
</script>
~~~

> 删除操作

~~~html
<script>
    $(function(){
        // 删除了d1的title，还可以删除removeClass
        $("#d1").removeAttr("title");
        // 删除了d2标签内第二个span下的第一个img标签
        $("#d2").children().eq(1).children().eq(0).remove();
        // 清空d2下所有的标签以及文本
        $("#d2").empty();
    })
</script>
~~~

> 添加操作

~~~html
<script>
    // 这里皮一下
    let JQ = jQuery;
    // jQuery只是需要一个匿名函数而已，这里传一个箭头函数也是可以的
    JQ(()=>{
        JQ("#d1").remove();
        // 获取到d2下的第一个span
        let span = JQ("#d2").children().eq(0);
        span.text("【原始的span】");
        
        // 添加到内部(追加在原有内容后面)
        span.append(JQ("<button>追加到span内部</button>"));
        JQ("<button>被追加到span内部</button>").appendTo(span);
        
        // 添加到内部(添加在原有内容的前面)
        span.prepend(JQ("<button>从前面添加到内部</button>"));
        JQ("<button>从前面被添加到内部</button>").prependTo(span);
        
        // 追加到span后面
        span.after(JQ("<p>追加到span后面</p>"));
        JQ("<p>被追加到span后面</p>").insertAfter(span);
        
        // 添加到span前面
        span.before(JQ("<p>添加到span前面</p>"));
        JQ("<p>被添加到span前面</p>").insertBefore(span);
    })
</script>
~~~

这里需要注意的是，添加到内部和添加到同级的方法，他们的顺序是相反的

>样式操作

~~~html
<script>
    $(()=>{
        let d1 = $("#d1");
        // 设置样式、获取样式的值
        d1.css("color", "red");
        console.log(d1.css("color"));
        // 获取目标标签的宽高
        console.log("width", d1.width());
        console.log("height", d1.height());
    })
</script>
~~~

除开这种方式我们还可以通过 jQuery 的 `attr` 或者 `prop` 函数来动态修改标签的 class 来达到修改样式的目的

| 方法名                         | 作用                                     |
| ------------------------------ | ---------------------------------------- |
| $("#id").attr("class", "样式") | 为该标签重新设置样式                     |
| $("#id").addClass("样式")      | 在原有的 class 基础上追加新的 class      |
| $("#id").removeClass("样式")   | 在原有的 class 基础上移除指定的 class    |
| $("#id").removeClass()         | 该方法在不写参数的情况下将移除所有 class |
| $("#id").hasClass("样式")      | 该标签是否包含指定的 class 样式          |



> 其他操作

~~~html
<!-- 复制与替换 -->
<script>
    $(()=>{
        let d1 = $("#d1");
        // clone复制该节点
        d1.after(d1.clone());
        // clone复制该节点(连同事件一起复制)
        d1.after(d1.clone(true));
        let d2 = $("#d2");
        
        // 被替换的标签调用函数
        d2.replaceWith($("<font id='font' color='blue'>我来替换这个标签</font>"));
        // 替换后的标签调用函数
        $("<font color='red'>这里在替换一次</font>").replaceAll($("#font"))
    })
</script>
~~~



### 表单元素操作

之前联系了普通标签的一些操作，然后来练习一下基于 form 表单中的标签的操作

~~~html
<!-- 这个是表单代码 -->
<body>
    <form id="form">
        <input type="hidden" name="id" value="123">
        姓名：<input type="text" name="username" /> <br />
        账号：<input type="text" name="account" /> <br />
        密码：<input type="password" name="password" /> <br />

        性别：
        <input type="radio" name="gender" value="男"/> 男
        &nbsp;
        <input type="radio" name="gender" value="女"/> 女
        <br />
        爱好：
        <input type="checkbox" name="likes" value="游泳" /> 游泳
        <input type="checkbox" name="likes" value="健身" /> 健身
        <input type="checkbox" name="likes" value="卡拉OK" /> 卡拉OK
        <input type="checkbox" name="likes" value="大保健" /> 大保健
        <br />
        住址：
        <select name="address">
            <option>北京</option>
            <option>上海</option>
            <option>广东</option>
            <option>深圳</option>
        </select>
    </form>
    <br />
    <button>提交</button>
</body>
~~~

~~~html
<!-- 这个是jQuery代码 -->
<script>
    $(()=>{
		// 动态设置表单的提交参数
        let form = $("#form");
        form.attr("action", "http://www.baidu.com");
        form.attr("method", "post");
		// 尝试获取了表单中的值，然后提交了表单
        let button = $("button").eq(0);
        // 动态绑定单击事件，提交表单
        button.click(()=>{
            let id = $("#form input[type='hidden']").val();
            let name = $("#form input[type='text']").eq(0).val();
            let accunt = $("#form input[type='text']").eq(1).val();
            let password = $("#form input[name='password']").val();
            let gender = $("#form input[name='gender']:checked").val();
            let address = $("#form select>option:selected").val();
            let likes = [];
            $("#form input[name='likes']:checked")
                	.each((index, item)=>likes.push($(item).val()));
            form.submit();
        })
    })
</script>
~~~







## 事件函数

## 特效和动画

## DOM遍历

## AJAX请求

