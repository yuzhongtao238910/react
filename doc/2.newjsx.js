// 在react18 的 新的转换 新的转换就是已经将children自动的处理好了

const babel = require("@babel/core")
const sourceCode = `
<h1 style={{color: 'yellow'}}>
	hello <span style={{color: 'red'}}>world</span>
</h1>
`
const result = babel.transform(sourceCode, {
	plugins: [
		["@babel/plugin-transform-react-jsx", {runtime: "automatic"}]
	]
})
console.log(result.code)
/*
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
_jsxs("h1", {
  style: {
    color: 'yellow'
  },
  children: ["hello ", _jsx("span", {
    style: {
      color: 'red'
    },
    children: "world"
  })]
});
*/


// React.createElement = jsx