// 在react17之前 babel转换是老的写法

const babel = require("@babel/core")
const sourceCode = `
<h1 style={{color: 'yellow'}}>
	hello <span style={{color: 'red'}}>world</span>
</h1>
`
const result = babel.transform(sourceCode, {
	plugins: [
		["@babel/plugin-transform-react-jsx", {runtime: "classic"}]
	]
})
console.log(result.code)
/*
React.createElement("h1", {
  style: {
    color: 'yellow'
  }
}, "hello ", React.createElement("span", {
  style: {
    color: 'red'
  }
}, "world"));
*/