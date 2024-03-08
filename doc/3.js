const path = require("path")
// sep 分隔符号 windows是分号 linux是冒号
console.log(path.delimiter)
// 不管在什么系统下面都是 冒号
console.log(path.posix.delimiter)