// babel会先处理jsx
import hasOwnProperty from "shared/hasOwnProperty.js"
import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols.js"
// 保留的属性 这些属性不会放到prop上面
const RESERVED_PROPS = {
	key: true,
	ref: true,
	__self: true,
	__source: true
}
function hasValidKey(config) {
	return config.key !== undefined
}
function hasValidRef(config) {
	return config.ref !== undefined
}
function ReactElement(type, key, ref, props) {
	return { // 这个就是react元素，也被称为虚拟dom
		$$typeof: REACT_ELEMENT_TYPE,
		type, // h1 span
		key, // 唯一标识
		ref, // 用来获取真实的dom元素
		props // 属性 children style id
	}
}
export function jsxDEV(type, config) {
	// type: h1 span
	// config {{ style: {}}, {children: []}}
	let propName; // 属性名字
	const props = {} // 属性对象
	let key = null // 每一个虚拟dom可以有一个可选的key的属性 用来区分一个父节点下面的不同子节点
	let ref = null // 后面可以通过这个实现获取真实dom的需求
	if (hasValidKey(config)) {
		key = config.key
	}
	if (hasValidRef(config)) {
		ref = config.ref
	}

	for (propName in config) {
		// 有可能属性是原型上面的，不要原型上面的属性
		if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
			props[propName] = config[propName]
		}
	}
	return ReactElement(type, key, ref, props)
}