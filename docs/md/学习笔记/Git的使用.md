# Git的使用

## 一、克隆项目

```git
git clone 项目地址
```



## 二、切换分支

```
git checkout 分支名称
```



## 三、拉取内容

```
git pull
```



## 四、提交内容

### 1、添加暂存区

```
# 添加单个文件：git add 文件名（如 git add app.js）
git add 文件名

# 添加多个文件：git add 文件名1 文件名2
git add 文件名1 文件名2

# 添加当前目录所有修改（包括新文件，但排除被忽略的文件）：git add .
git add .

# 添加指定目录下的所有修改：git add 目录名/
git add 目录名/
```

### 2、提交

```
git commit -m "修改描述"
```

### 3、撤回最近一次 commit（保留修改）

```
git reset --soft HEAD~1[撤回几次提交1是1次]
```

### 4、撤回最近一次 commit（丢弃修改）

```
git reset --hard HEAD~1
```

- `--hard`：强制撤销提交，同时清空工作区和暂存区的修改（**无法恢复**）
- 适用于确认提交内容完全错误，不需要保留的情况



###  5、撤回历史中的某个 commit（不破坏历史）

```
# 1. 找到需要撤销的 commit ID（通过 git log 查看）
git log --oneline  # 显示简洁的提交历史

# 2. 创建反向提交，抵消目标 commit 的修改
git revert <commit-ID>
```

- 执行后会生成一个新的 commit，内容与目标 commit 完全相反，从而抵消其影响
- 不会删除原有 commit，适合多人协作的公开分支（如 `main`）

### 6、令查看 `origin` 对应的实际仓库地址

```
git remote -v 
```



## 五、推送到仓库

```
git push origin 分支名
```

