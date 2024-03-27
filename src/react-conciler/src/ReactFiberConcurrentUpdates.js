import { HostRoot } from "./ReactWorkTags.js"
// 本来此方法需要处理更新的优先级的问题
// 但是现在不管优先级的问题，只实现一个功能
// 功能：向上找到根节点
export function markUpdateLaneFromFiberToRoot(sourceFiber) {
	let node = sourceFiber // 当前fiber 节点
	let parent = sourceFiber.return // 当前fiber节点的父节点

	while (parent !== null) {
		node = parent
		parent = parent.return
	}

	// 一直找到parent为null，
	if (node.tag === HostRoot) {
		return node.stateNode
	}
	return null
}