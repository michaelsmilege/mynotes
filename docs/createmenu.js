const fs = require('fs');
const path = require('path');

// 定义根目录为当前目录下的md文件夹
const rootDir = path.join(__dirname, 'md');
// 定义要排除的文件夹名称
const excludeFolder = 'img';
// 定义输出的sidebar文件路径
const outputFile = path.join(__dirname, '_sidebar.md');

/**
 * 递归读取目录结构并生成markdown导航
 * @param {string} dir 当前目录路径
 * @param {number} level 当前层级，用于生成缩进
 * @returns {string} 生成的markdown导航字符串
 */
function readDirRecursive(dir, level = 0) {
    let result = '';
    // 获取当前目录下的所有文件和文件夹
    const files = fs.readdirSync(dir);
    
    // 过滤掉要排除的文件夹
    const filteredFiles = files.filter(file => {
        const fullPath = path.join(dir, file);
        const isDir = fs.statSync(fullPath).isDirectory();
        // 如果是文件夹且名称是要排除的，则过滤掉
        return !(isDir && file.toLowerCase() === excludeFolder);
    });
    
    // 遍历处理每个文件/文件夹
    filteredFiles.forEach(file => {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);
        const indent = '  '.repeat(level); // 根据层级生成缩进
        
        if (stats.isDirectory()) {
            // 处理文件夹：添加文件夹名称作为标题
            result += `${indent}- ${file}\n`;
            // 递归处理子文件夹，层级+1
            result += readDirRecursive(fullPath, level + 1);
        } else if (stats.isFile() && path.extname(file).toLowerCase() === '.md') {
            // 处理md文件：生成链接
            // 计算相对路径（相对于根目录）
            const relativePath = path.relative(__dirname, fullPath).replace(/\\/g, '/');
            // 文件名去掉扩展名作为链接文本
            const fileName = path.basename(file, '.md');
            result += `${indent}- [${fileName}](${relativePath})\n`;
        }
    });
    
    return result;
}

/**
 * 生成并写入sidebar文件
 */
function generateSidebar() {
    try {
        // 检查md文件夹是否存在
        if (!fs.existsSync(rootDir)) {
            throw new Error('未找到md文件夹，请确保在脚本同级目录下存在md文件夹');
        }
        
        // 生成导航内容
        const sidebarContent = readDirRecursive(rootDir);
        
        // 写入到__sidebar.md文件
        fs.writeFileSync(outputFile, sidebarContent);
        console.log(`成功生成_sidebar.md文件，路径：${outputFile}`);
    } catch (error) {
        console.error('生成sidebar失败：', error.message);
    }
}

// 执行生成函数
generateSidebar();
