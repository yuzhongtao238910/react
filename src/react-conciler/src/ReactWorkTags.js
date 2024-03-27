// 根fiber的tag类型
// 每种虚拟dom都会有自己对应的fiber 的 tag类型

export const FunctionComponent = 0
export const ClassComponent = 1

// 后面我们会讲到类组件和函数组件，因为它们本质上都是函数，刚开始无法判断，所以叫做未决定的组件
export const IndeterminateComponent = 2
export const HostRoot = 3 // 容器的根节点
export const HostComponent = 5 // 原生节点
export const HostText = 6 // 文本节点
