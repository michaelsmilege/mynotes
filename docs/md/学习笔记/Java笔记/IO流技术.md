## Java IO

Java 中的 IO 流是我们通过程序对磁盘或网络中的某个文件进行某种操作的时候使用的技术

### File 文件类

File 类是专门对文件进行操作的类，一个 File 实例代表硬盘中实际存在的一个文件或者目录，需要注意的是 **它只能针对文件进行操作，并不能操作文件中的内容**

> 创建 File 类的实例

既然说 File 类是操作文件的，那么当然一个类对应的就是一个文件或者目录了，所以我们要在创建的时候就要告诉他代表的是什么，创建 File 类实例最常见的三种方法如下所示：

~~~java
// 获取File类的实例
public class MyFile1 {
    public static void main(String[] args) {
        // 直接获取目标文件实例
        File f1 = new File("D:/example/3.txt");
        // 获取某个目录下的文件实例
        File f2 = new File("D:/example/", "3.txt");
        // 获取某个File类实例(对应的是文件夹)下的某个文件实例
        File f3 = new File( new File("D:/example/"), "3.txt");
    }
}
~~~

> File 类的常用方法：判断方法

File 类具体指向的是什么样的字符串我们不一定是都知道的，所以我们需要依靠一些判断的方法：

~~~java
// File类的判断方法
public class MyFile1 {
    public static void main(String[] args) {
        File file = new File("D:/example/3.txt");
        System.out.println("目标是否存在：" + file.exists());
        System.out.println("是否是文件：" + file.isFile());
        System.out.println("是否是文件夹：" + file.isDirectory());
    }
}
~~~

> File 类的常用方法：获取方法

我们想要通过 File 示例拿到相应的信息，就需要用到获取方法啦，方法多了点这里列了一个表格：

| 调用者 | 函数              | 作用                                       |
| ------ | ----------------- | ------------------------------------------ |
| 文件   | getName()         | 获取文件 ( 夹 ) 名称                       |
| 文件   | getPath()         | 获取文件 ( 夹 ) 相对路径                   |
| 文件   | getAbsolutePath() | 获取文件 ( 夹 ) 绝对路径                   |
| 文件   | length()          | 获取文件大小 ( 单位：字节 )                |
| 文件夹 | list()            | 获取文件夹下所有文件 ( 夹 ) 的字符串数组   |
| 文件夹 | listFiles()       | 获取文件夹下所有文件 ( 夹 ) 的 File 类数组 |

~~~java
// File类的获取方法
public class MyFile1 {
    public static void main(String[] args) {
        System.out.println("==文件类型=============================");
        File file = new File("D:/example/3.txt");
        System.out.println("文件名称：" + file.getName());
        // 当我们用相对路径创建File对象的时候返回的就是相对路径
        System.out.println("相对路径：" + file.getPath());
        System.out.println("绝对路径：" + file.getAbsolutePath());
        System.out.println("文件大小：" + file.length() + "字节");

        System.out.println("==文件夹类型===========================");
        File folder = new File("D:/example/");
        // 如果File对象指向的是一个文件夹的话返回值是位置的，测试结果是0
        System.out.println("文件大小：" + folder.length() + "字节");
        for (String s : folder.list())
            System.out.print( s + "  " );
        System.out.println();
        for (File f : folder.listFiles())
            System.out.print( f.getName() + "  " );
    }
}
~~~

- 【8位( Bit ) = 1字节( Byte ) 】--【1024字节( Byte ) = 1兆( M ) 】--【1024兆( M ) = 1G 】

> File 类的常用方法：创建、重命名以及删除

判断和获取已经了解的差不多了，接下来了解一下创建、重命名和删除函数，File 类基本也就差不多了

~~~java
// 创建、重命名以及删除
public class MyFile1 {
    public static void main(String[] args) throws IOException {
        // 这个4.txt本身是不存在的
        File file = new File("D:/example/4.txt");
        System.out.println("创建文件：" + file.createNewFile());
        // 这个test目录也是不存在的
        File folder = new File("D:/example/test/");
        System.out.println("创建目录：" + folder.mkdir());
        System.out.println("创建多级目录：" + 
                           new File("D:/example/test/1/2/3/4/5/6/").mkdirs());
        // 重命名文件
        File newName = new File("D:/example/40.txt");
        System.out.println("文件重命名" + file.renameTo(newName));
        // 删除函数，需要注意的是多级目录无法直接删除，这里写了一个递归删除的函数
        System.out.println("删除文件：" + newName.delete());
        System.out.println("删除文件夹：" + folder.delete());
        System.out.println("递归删除" + deletes(folder));
    }
    // 递归删除函数
    public static boolean deletes( File file ){
        if (file.isDirectory() && file.list().length > 0) {
            for (File f : file.listFiles())
                deletes(f);
            file.delete();
        } else file.delete();
        return true;
    }
}
~~~

> 小练习：递归遍历某个目录下的所有 文件/文件夹，最终删除名为【病毒.exe】的文件 ( 文件自己创建 )

~~~java
// 递归遍历以及删除
public class MyFile1 {

    public static StringBuilder marker = new StringBuilder("|-");

    public static void main(String[] args) throws IOException {
        File root = new File("D:/_Zhe/");
        findAndDelete(root);
    }

    public static void findAndDelete( File file ){
        if( file.isDirectory() && file.list().length > 0 ){
            System.out.println(marker.toString() + file.getName());
            for (File f : file.listFiles()){
                marker.append("-");
                findAndDelete(f);
                marker = new StringBuilder(marker.substring(0, marker.length()-1));
            }
        } else {
            System.out.println(marker.toString() + file.getName());
            if ( file.getName().equals("病毒.exe") ) {
                String path = file.getAbsolutePath();
                file.delete();
                System.out.println("**********************************************");
                System.out.println("已删除【病毒.exe】，位于" + path);
                System.out.println("**********************************************");
            }
        }
    }

}
~~~



### IO 流概念

IO 流，I 代表 input，O 代表 output，所以 IO 流就是输入输入的数据流

**流的分类：**Java 中的 IO 流有两大分类：以字节为单位的 **字节流** 以及以字符为单位 **字符流**

**流的方向：**两大分类中每种流都有两个方向，以当前应用程序的内存为基准，将硬盘中的某个文件读入内存中叫做 **输入流**，将内存中的数据写到硬盘上的某个文件中，称为 **输出流**

共两大分类四种类型，旗下又有多个实现类，类关系图如下所示：

![IO类关系图-屈博老师](C:/Users/Administrator/Desktop/Markdown/img/JavaSenior-02.jpg)

> 关于关流

**1. **无论是输入流还是输出流，在我们 IO 流使用完成后一定要记得 `close()` 关流

**2. **如果输入输入同时使用的话，优先关闭输出流，再关闭输入流

**3. **如果流之前有一来关系 ( 例如字符流依赖字节流 )，需要先关闭后者，最后关闭前者



### 字节输出流

`FileOutputStream` 为字节输出流，常用函数包含：

| 函数                              | 作用                                        |
| --------------------------------- | ------------------------------------------- |
| close()                           | 关闭流                                      |
| flush()                           | 刷新此输出流将数据都写出                    |
| write(int b)                      | 将指定的字节输出                            |
| write(byte[] b)                   | 输出整个字节数组                            |
| write(byte[] b, int off, int len) | 基于 b 数组，从下标 off 开始写满 len 个字节 |

想要使用字节输出流首先需要创建他的实例

> 创建字节输出流实例

~~~java
// 创建字节输出流的方法有两种，这里推荐直接使用第一种路径字符串
public class MyFileOutputStream {
    public static void main(String[] args) throws Exception{
        FileOutputStream fos = new FileOutputStream("D:/example/3.txt");
        FileOutputStream fos2 = new FileOutputStream(new File("D:/example/3.txt"));
        fos.close();
        fos2.close();
    }
}
~~~

- 这里需要注意，输出流在 new 对象的时候就已经在目标位置创建好文件了，如果文件已存在会进行覆盖。

> 向文件中输出数据

之前的表格中有介绍输出的函数 write，这个函数重载了三次，我们来分别测试一下

~~~java
// write函数测试
public class MyFileOutputStream {
    public static void main(String[] args) throws Exception{
        // 每次只写出一个字节
        FileOutputStream fos = new FileOutputStream("D:/example/3.txt");
        fos.write(97);
        fos.write(98);
        fos.write(99);
        fos.close();
        // 写出整个字节数组
        fos = new FileOutputStream("D:/example/4.txt");
        byte[] bytes = "You can kill me, but you can't fuck me".getBytes();
        fos.write(bytes);
        fos.close();
        // 从指定位置开始，写满len个后结束 -- kill
        fos = new FileOutputStream("D:/example/5.txt");
        fos.write(bytes, 8, 4);
        fos.close();
    }
}
~~~

> 字节输出流实现续写，换行

流一旦关闭后再次创建写入数据就会把之前的数据都弄丢掉，这点就比较烦，这里我们通过在创建实例对象的时候传入一个 `true` 值来实现续写的功能：

- `public FileOutputStream(String name, boolean append)`，name 文件路径，append 是否续写

~~~java
// 续写和换行
public class MyFileOutputStream {
    public static void main(String[] args) throws Exception{
        // 写入一行数据
        FileOutputStream fos = new FileOutputStream("D:/example/3.txt");
        fos.write("You can kill me".getBytes());
        fos.close();
        // 进行续写
        fos = new FileOutputStream("D:/example/3.txt", true);
        fos.write("\r\n".getBytes());   // 在Windows中：\r 回车符，\n 换行符
        fos.write("but you can't fuck me!!!".getBytes());
        fos.close();
    }
}
~~~

> 实现实时输出数据

~~~java
// 实时输出数据，exit结束输出
public class MyFileOutputStream {
    public static void main(String[] args) throws Exception{
        FileOutputStream fos = new FileOutputStream("D:/example/3.txt");
        boolean flag = true;
        Scanner sc = new Scanner(System.in);
        System.out.println("写入数据：");
        while ( flag ) {
            String str = sc.nextLine();
            if( !str.equals("exit") )
                fos.write((str+"\r\n").getBytes());
            else flag = false;;
        }
        fos.close();
    }
}
~~~



### 字节输入流

`FileOutputStream` 为输出流，常用函数如下：

| 函数                             | 作用                                                         |
| -------------------------------- | ------------------------------------------------------------ |
| close()                          | 关闭流                                                       |
| read()                           | 刷新此输出流将数据都写出                                     |
| read(byte[] b)                   | 读取同数组长度的字节数量并存到数组中，读到末尾时返回 -1      |
| read(byte[] b, int off, int len) | 从下标 off 开始读入 len 个字节并存储到数组中，读到末尾时返回 -1 |

和输出流一样有两种构造方法 ( 这里就不写了 )，同样我们直接采用路径字符串的形式进行实例化：

~~~java
public class MyFileInputStream {
    public static void main(String[] args) throws Exception {
        // 一次读取一个字节
        FileInputStream fis = new FileInputStream("D:/example/3.txt");
        for ( int read = 0; (read = fis.read()) != -1; )
            System.out.println((char)read);
        System.out.println(fis.read());
        fis.close();
        // 读取数组长度的字节存放进数组中
        fis = new FileInputStream("D:/example/3.txt");
        byte[] bytes = new byte[5];
        fis.read(bytes);
        System.out.println(new String(bytes));
        // 从off开始读取len个存到bytes中
        fis = new FileInputStream("D:/example/3.txt");
        bytes = new byte[2];
        for( int read = 0; (read = fis.read(bytes, 0, bytes.length)) != -1; )
            System.out.println(new String(bytes));
    }
}
~~~

我的 4.txt 文件中只有 abcde 五个英文字母，在读取的时候明显最后一个读到的是 d，原因：

![https://www.cnblogs.com/xichji/p/11793464.html](C:/Users/Administrator/Desktop/Markdown/img/JavaSenior-03.jpg)



### 字节流练习-文件复制

要求：复制某个图片到 D 盘盘根下重命名为 stream.jpg

~~~java
// 字节流练习-复制文件
public class StreamCopyFile {
    public static void main(String[] args) throws Exception{
        String file = "C:/Users/Administrator/Desktop/Markdown/img/1.jpg";
        FileInputStream fis = new FileInputStream(file);
        FileOutputStream fos = new FileOutputStream("D:/stream.jpg");
        byte[] bytes = new byte[1024];
        for ( int len = 0; (len = fis.read(bytes))!= -1; )
            fos.write(bytes);
        System.out.println("图片复制成功！");
        fos.close();
        fis.close();
    }
}
~~~



### 字节流与码表

刚刚我们是先学习输出流，通过输出流向文本文件中写入数据，然后再用输入流读回来，如果我们先使用输入流读取文本文件会怎么样呢？我们创建一个 4.txt 来读取一下其中的内容

~~~java
public class MyFileInputStream {
    public static void main(String[] args) throws Exception {
        // 内容：学习IO流
        FileInputStream fis = new FileInputStream("D:/example/4.txt");
        byte[] bs = new byte[10];
        fis.read(bs);
        // 打印：ѧϰIO��  
        System.out.println(new String(bs));
    }
}
~~~

这个时候我们发现打印出来的竟然是一堆乱码，刚刚练习的时候还是正常的，这是因为我们优先使用的输出流，如果我们没有开启续写的话，输出流默认会重新创建一个新的文件来替换掉之前的旧的文件，新文件就会基于 java 写入的内容来设置对应文件的码表：

![](C:/Users/Administrator/Desktop/Markdown/img/JavaSenior-04.jpg)

我们读取了 ANSI 码表中的字节通过 `new String( bs )` 以 UTF-8 进行解码结果当然是乱码的，想要解决这个问题我们只需要在转换的时候为他指定码表就可以了，经测试文本文件的 ANSI 对应的是 GBK：

~~~java
public class MyFileInputStream {
    public static void main(String[] args) throws Exception {
        // 内容：学习IO流
        FileInputStream fis = new FileInputStream("D:/example/4.txt");
        byte[] bs = new byte[10];
        fis.read(bs);
        // 打印：学习IO流
        System.out.println(new String(bs, "GBK"));
        fis.close();
    }
}
~~~

现在我们已经可以将 ANSI 格式的字节读回 UTF-8 了，那么我们可不可以在输出的时候就输出 ANSI 呢：

~~~java
public class MyFileOutputStream {
    public static void main(String[] args) throws Exception{
        FileOutputStream fos = new FileOutputStream("D:/example/4.txt");
        // 在获取字节数组的时候传入一个字符串作为码表，他就会按照码表的格式进行转换了
        fos.write("一日三餐想吃好，就吃老八秘制小汉堡".getBytes("GBK"));
        fos.close();
    }
}
~~~

![](C:/Users/Administrator/Desktop/Markdown/img/JavaSenior-05.jpg)

> 字符流引言

字节流以字节为单位适用于文件 ( 图片，音频，视频等 ) 传输等，而字符流偏向于文本 ( .txt，.md，.xml ) 传输等

在 GBK 码表中一个字母中占用一字节，中文占用两字节，在 UTF-8 中的中文要三个字节，所以就有了字符流，字符流只需要负责对数据进行操作即可，无需考虑占用几个字节的问题，**字符流可以理解为字节流和码表的结合**



### 字符输入流

`FileReader` 为字符输入流，使用默认的 ( 大多为 UTF-8 ) 码表，用的同样是那几个 read 函数，这里就不细说了

> 使用字符输入流

~~~Java
// 字符输入流
public class MyFileReader {
    public static void main(String[] args) throws IOException {
        FileReader fr = new FileReader("D:/example/5.txt");
        for ( int read; (read = fr.read()) != -1; )
            System.out.println((char) read);
        fr.close();
    }
}
~~~



### 字符输出流

`FileWriter` 为字符输出流，使用默认的 ( 大多为 UTF-8 ) 码表，用的同样是那几个 write 函数，这里就不细说了

> 使用字符输出流

~~~java
// 测试字符输出流
public class MyFileWriter {
    public static void main(String[] args) throws IOException {
        FileWriter fw = new FileWriter("D:/example/6.txt");
        fw.write("测试字符输出流：\r\n");
        fw.close();
    }
}
~~~

> 续写以及实时输出数据

~~~java
public class MyFileWriter {
    public static void main(String[] args) throws IOException {
        FileWriter fw = new FileWriter("D:/example/6.txt", true);
        Scanner sc = new Scanner(System.in);
        System.out.println("写入数据：");
        for ( boolean flag = true; flag; ){
            String str = sc.nextLine();
            if( !str.equals("exit") ){
                fw.write(str+"\r\n");
                fw.flush();
            } else flag = false;
        }
    }
}
~~~

- 字符输出流的 write 函数是将字符写在了缓冲区中，只有在 close 关流的时候才会将缓冲区的字符写出，想要实现实时写出需要配合 flush 函数强制刷新并写出

> 缓冲流引言

我们平时经常接触到的 IO 方面的操作，例如文件复制，我们可以用字节输入流读取数据然后用字节输出流进行写出，没有任何问题，但是文件偏大的时候就会有一个效率的概念，这个时候我们就可以使用缓冲流来解决

缓冲流，也叫做高效流，是针对开始提过的四种类型进行增强的流



### 字节缓冲流

字节输入流对应的缓冲流为：`BufferedInputStream(InputStrean in)`

字节输出流对应的缓冲流为：`BufferedOutputStream(OutputStream out)`

> 通过大文件复制来测试字节流与缓冲流

同样都是那几个读入写出以及刷新关流的函数，这里就不介绍了

~~~java
// 字节流复制大文件
public class MyBufferStream {
    public static void main(String[] args) throws Exception{
        long l = System.currentTimeMillis();
        // IDEA社区版安装包--大小572M
        FileInputStream fis = new FileInputStream("D:/Download/ideaIC-2020.2.1.exe");
        FileOutputStream fos = new FileOutputStream("D:/example/ideaIC.exe");
        byte[] bs = new byte[1024];
        for (int len; (len = fis.read(bs)) != -1; )
            fos.write(bs, 0, len);
        // 文件复制完成！花费7329ms
        System.out.println("文件复制完成！花费" + 
                           (System.currentTimeMillis() - l) + "ms");
        fos.close();
        fis.close();
    }
}
~~~

~~~java
// 字符流复制大文件
public class MyBufferStream {
    public static void main(String[] args) throws Exception{
        long l = System.currentTimeMillis();
        // IDEA社区版安装包--大小572M
        FileInputStream fis = new FileInputStream("D:/Download/ideaIC-2020.2.1.exe");
        FileOutputStream fos = new FileOutputStream("D:/example/ideaIC.exe");
        // 缓冲流需要字节流作为参数
        BufferedInputStream bis = new BufferedInputStream(fis);
        BufferedOutputStream bos = new BufferedOutputStream(fos);
        byte[] bs = new byte[1024];
        for (int len; (len = bis.read(bs)) != -1; )
            bos.write(bs, 0, len);
        // 文件复制完成！花费3327ms
        System.out.println("文件复制完成！花费" + 
                           (System.currentTimeMillis() - l) + "ms");
        bos.close();
        bis.close();
        fos.close();
        fis.close();
    }
}
~~~



### 字符缓冲流

字符输入流对应的缓冲流为：`public BufferedReader(Reader in)` 

字符输出流对应的缓冲流为：`public BufferedWriter(Writer out)`

> 文件内容复制练习

相比之前学过的那些，字符缓冲流有着自己专属的函数：

| 调用者         | 函数       | 作用                                               |
| -------------- | ---------- | -------------------------------------------------- |
| BufferedReader | readLine() | 只读取一行数据，读到最后返回 null                  |
| BufferedWriter | newLine()  | 创建一个换行符，会根据当前系统环境创建符合的换行符 |

~~~java
// 字符缓冲流实现文件内容拷贝
public class MyBufferChar {
    public static void main(String[] args) throws IOException {
        // 同样，缓冲流需要字符流作为参数
        FileReader fr = new FileReader("D:/Download/34059.txt");
        FileWriter fw = new FileWriter("D:/example/桃花源记.txt");
        BufferedReader readBuffer = new BufferedReader(fr);
        BufferedWriter writeBuffer = new BufferedWriter(fw);
        // 读取一行数据，读到返回给line，读不到返回null
        for (String line; (line = readBuffer.readLine()) != null; ) {
            writeBuffer.write(line);
            /* 在这里创建了两个换行相当于在源文件基础上添加了一个换行，因为
	           它是按行读的，不存在换行的概念，所以这里我们需要手动换行 */
            writeBuffer.newLine();
            writeBuffer.newLine();
        }
        writeBuffer.close();
        readBuffer.close();
        fw.close();
        fr.close();
    }
}
~~~

![](C:/Users/Administrator/Desktop/Markdown/img/JavaSenior-06.jpg)



### 字节字符转换流

之前说过，我们在使用字节流处理字符的时候，由于一个中文可能对应两个或三个字节，不方便进行操作，所以有了字符流，但是字符流使用的是默认码表 ( 大多是 UTF8 )，也就意味着如果我有 GBK 字符集的文本他就无法处理了，这个时候我们可以通过转换流进行操作

顾名思义，转换流就是字节流和字符流之间的转换，我们可以在转换的过程中告诉他应该用什么类型的码表，这样一来就可以解决码表的问题了

转换流分为两种：

- 字节转字符：`InputStreamReader`，将读入内存的字节转换成程序可处理的字符
- 字符转字节：`OutputStreamWriter`，将处理好的字符转换成字节写出



> 转换流练习

之前我们学习字符流的时候只操作 UTF-8 类型的文本文件进行测试，因为使用其他编码的时候会乱乱码，现在我们来尝试一下其他的编码

~~~java
// 转换流练习
public class MyConversionStream {
    public static void main(String[] args) throws IOException {
        // 转换流顾名思义，需要我们提供字节流以及对应的码表来转换为字符流
        FileInputStream fis = new FileInputStream("D:/Download/73369.txt");
        InputStreamReader isr = new InputStreamReader(fis, "GBK");
        // 获取GBK编码的文本转换成unicode类型的文本
        FileOutputStream fos = new FileOutputStream("D:/example/冰灯.txt");
        OutputStreamWriter osw = new OutputStreamWriter(fos, "unicode");
        for (int read; (read = isr.read()) != -1;) {
            osw.write((char) read);
        }
        osw.close();
        fos.close();
        isr.close();
        fis.close();
    }
}
~~~

![](C:/Users/Administrator/Desktop/Markdown/img/JavaSenior-07.jpg)

> 【扩展】详细的 [ 编码表/字符集 ] 信息--原文地址：https://www.cnblogs.com/xichji/p/11793464.html#字符集

- ASCII字符集：
  - ASCII（American Standard Code for Information Interchange，美国信息交换标准代码）是基于拉丁字母的一套电脑编码系统，用于显示现代英语，主要包括控制字符（回车键、退格、换行键等）和可显示字符（英文大小写字符、阿拉伯数字和西文符号）。
  - 基本的ASCII字符集，使用7位（bits）表示一个字符，共128字符。ASCII的扩展字符集使用8位（bits）表示一个字符，共256字符，方便支持欧洲常用字符。
- ISO-8859-1字符集：
  - 拉丁码表，别名Latin-1，用于显示欧洲使用的语言，包括荷兰、丹麦、德语、意大利语、西班牙语等。
  - ISO-8859-1使用单字节编码，兼容ASCII编码。
- GBxxx字符集：
  - GB就是国标的意思，是为了显示中文而设计的一套字符集。
  - **GB2312**：简体中文码表。一个小于127的字符的意义与原来相同。但两个大于127的字符连在一起时，就表示一个汉字，这样大约可以组合了包含7000多个简体汉字，此外数学符号、罗马希腊的字母、日文的假名们都编进去了，连在ASCII里本来就有的数字、标点、字母都统统重新编了两个字节长的编码，这就是常说的"全角"字符，而原来在127号以下的那些就叫"半角"字符了。
  - **GBK**：最常用的中文码表。是在GB2312标准基础上的扩展规范，使用了双字节编码方案，共收录了21003个汉字，完全兼容GB2312标准，同时支持繁体汉字以及日韩汉字等。
  - **GB18030**：最新的中文码表。收录汉字70244个，采用多字节编码，每个字可以由1个、2个或4个字节组成。支持中国国内少数民族的文字，同时支持繁体汉字以及日韩汉字等。
- Unicode字符集：
  - Unicode编码系统为表达任意语言的任意字符而设计，是业界的一种标准，也称为统一码、标准万国码。
  - 它最多使用4个字节的数字来表达每个字母、符号，或者文字。有三种编码方案，UTF-8、UTF-16和UTF-32。最为常用的UTF-8编码。
  - UTF-8编码，可以用来表示Unicode标准中任何字符，它是电子邮件、网页及其他存储或传送文字的应用中，优先采用的编码。互联网工程工作小组（IETF）要求所有互联网协议都必须支持UTF-8编码。所以，我们开发Web应用，也要使用UTF-8编码。它使用一至四个字节为每个字符编码，编码规则：
    1. 128个US-ASCII字符，只需一个字节编码。
    2. 拉丁文等字符，需要二个字节编码。
    3. 大部分常用字（含中文），使用三个字节编码。
    4. 其他极少使用的Unicode辅助字符，使用四字节编码。

### 扩展 Properties

properties 应该很熟悉了，springboot 的配置文件就是 properties 和 ymal 文件，properties 类严格来说不属于 IO 类，它其实位于 `java.util.Properties` 包下 继承 `Hashtable` 的一个键值对的集合类，只不过类中包含了和 IO 相关的操作

>简单了解 Properties 集合类

~~~java
// Properties集合类的使用
public class MyProperties {
    public static void main(String[] args) {
        // 创建实例
        Properties ps = new Properties();
        // 添加/修改值
        ps.setProperty("user", "zhang");
        ps.setProperty("name", "hanzhe");
        ps.setProperty("age", "21");
        // 打印测试
        System.out.println(ps);
        // 迭代遍历
        System.out.println("user--" + ps.getProperty("user"));
        for (Iterator<Map.Entry<Object, Object>> iterator = ps.entrySet().iterator(); iterator.hasNext();){
            Map.Entry<Object, Object> entyr = iterator.next();
            System.out.println(entyr.getKey() + "：" + entyr.getValue());
        }
    }
}
~~~

>配合IO流读取配置文件信息

~~~java
public class MyProperties {
    public static void main(String[] args) throws IOException {
        // 创建实例
        Properties ps = new Properties();
        // 加载properties配置文件
        ps.load(new FileInputStream("D:/example/applitaion.properties"));
        System.out.println(ps);
    }
}
~~~



