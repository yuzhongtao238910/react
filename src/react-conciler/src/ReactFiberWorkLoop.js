import { scheduleCallback } from '../../scheduler/index.js'
import { createWorkInProgress } from "./ReactFiber.js"
import { beginWork } from "./ReactFiberBeginWork.js"
// workInProgress对应一个fiber节点，fiber节点组合在一起称为fiber树
// current也是一个fiber节点，代表老的fiber节点，也就是上一次的fiber节点
// 两棵树：一个是对应页面上的真实dom元素，代表当前已经渲染完成的fiber
// 一个是正在构建之中的新的fiber树，表示还没有生效，没有更新到dom上
let workInProgress = null

// 计划更新root
// 源码之中此处有个任务的功能
export function scheduleUpdateOnFiber(root) {
	// 确保调度执行root上面的更新
	ensureRootIsScheduled(root)
}

function ensureRootIsScheduled(root) {
	// 告诉 浏览器要执行 performConcurrentWorkOnRoot 参数定死了是root
	scheduleCallback(performConcurrentWorkOnRoot.bind(null, root))
}

/**
 * 根据虚拟dom，构建fiber树，要创建真实的dom节点，还需要把真实的dom节点插入到容器
 * @param root
 */
function performConcurrentWorkOnRoot(root) {
	// 第一次渲染，会以同步的方式渲染根节点，初次渲染的时候，都是同步，因为是希望尽快给用户呈现内容
	renderRootSync(root)
}
function prepareFreshStack(root) {
	workInProgress = createWorkInProgress(root.current, null)
}
function renderRootSync(root) {
	// 开始构建fiber树
	prepareFreshStack(root)
	// debugger
	workLoopSync()
}

function workLoopSync() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress)
	}
}

/**
 * 执行一个工作单元
 * @param unitOfWork
 */
function performUnitOfWork(unitOfWork) {
	// 获取新的fiber对应的老的fiber
	const current = unitOfWork.alternate
	// console.log(unitOfWork, 47)
	// 完成当前fiber的子fiber链表构建后
	const next = beginWork(current, unitOfWork)
	unitOfWork.memoizedProps = unitOfWork.pendingProps
	// debugger
	if (next === null) {
		// 如果没有子节点，表示当前的fiber已经完成了
		// completeUnitWork(unitOfWork)
		workInProgress = null
	} else {
		// 如果有子节点，就让子节点成为下一个工作单元
		workInProgress = next
	}
}































