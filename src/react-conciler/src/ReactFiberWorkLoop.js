import { scheduleCallback } from '../../scheduler/index.js'
import { createWorkInProgress } from "./ReactFiber.js"
import { beginWork } from "./ReactFiberBeginWork.js"
import { completeWork } from "./ReactFiberCompleteWork.js"
import {NoFlags, MutationMask} from "./ReactFiberFlags.js";
import { commitMutationEffectsOnFiber } from "./ReactFiberCommitWork.js"
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
	console.log(root)


	// 开始进入提交阶段，就是执行副作用 修改真实的dom,获取最新的alternate
	const finishedWork = root.current.alternate
	root.finishedWork = finishedWork
	commitRoot(root)
	// debugger
}

function commitRoot(root) {
	const  { finishedWork } = root
	// 如果一个子节点是新创的，那么他自己会有副作用，但是它的儿子们是没有的，因为自己是新创建的，它的儿子肯定都是新创建 的
	// 我们就不需要管了，直接走创建就好

	// 判断子树是否具有副作用
	const subtreeHasEffects = (finishedWork.subtreeFlags & MutationMask ) !== NoFlags
	// 判断根fiber自己是否具有副作用
	const rootHasEffect = (finishedWork.flags & MutationMask ) !== NoFlags

	// 如果自己有副作用或者子节点有副作用，那么就进行提交dom操作
	if (subtreeHasEffects || rootHasEffect) {
		// console.log("commitRoot")
		commitMutationEffectsOnFiber(finishedWork, root)
	}
	// 等dom变更后，就可以让root的current指向新的fiber树
	root.current = finishedWork
	console.log(finishedWork, 43)
	// debugger
}
function prepareFreshStack(root) {
	workInProgress = createWorkInProgress(root.current, null)
}
function renderRootSync(root) {
	// debugger
	// 开始构建fiber树
	prepareFreshStack(root)
	// debugger
	workLoopSync()
}

function workLoopSync() {
	while (workInProgress !== null) {
		// console.log(workInProgress, 42)
		performUnitOfWork(workInProgress)
	}
}



/**
 * 执行一个工作单元
 * @param unitOfWork
 */
function performUnitOfWork(unitOfWork) {
	// debugger
	// 获取新的fiber对应的老的fiber
	const current = unitOfWork.alternate
	// console.log(unitOfWork, 47)
	// 完成当前fiber的子fiber链表构建后
	const next = beginWork(current, unitOfWork)
	unitOfWork.memoizedProps = unitOfWork.pendingProps
	// debugger
	if (next === null) {
		// 如果没有子节点，表示当前的fiber已经完成了
		completeUnitWork(unitOfWork)
		// workInProgress = null
	} else {
		// 如果有子节点，就让子节点成为下一个工作单元
		workInProgress = next
	}
}
function completeUnitWork(unitOfWork) {
	let completedWork = unitOfWork
	do {
		const current = completedWork.alternate
		const returnFiber = completedWork.return
		// 执行此fiber的完成工作，如果是原生组件的话就是创建真实的dom节点插入容器
		completeWork(current, completedWork)
		const siblingFiber = completedWork.sibling
		// console.log(completedWork, 82)
		// debugger
		// 如果有弟弟，就构建弟弟对应的fiber子链表
		if (siblingFiber !== null) {
			workInProgress = siblingFiber
			return
		}
		// 如果没有弟弟，说明当前完成的就是父fiber的最后一个节点
		// 也就是说一个父fiber，所有的子fiber都完成了
		completedWork = returnFiber
		workInProgress = completedWork

	} while (completedWork !== null) // 根fiber的父fiber就退出啦
}

























