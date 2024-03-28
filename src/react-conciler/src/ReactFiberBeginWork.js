import logger, { indent } from "../../shared/logger.js"
import {HostComponent, HostRoot, HostText} from "./ReactWorkTags.js";
import { processUpdateQueue } from "./ReactFiberClassUpdateQueue.js"
import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber.js"
import { shouldSetTextContext } from "../../react-dom-bindings/src/client/ReactDOMHostConfig.js"

/**
 * 根据新的虚拟dom生成新的fiber链表
 * @param current 老的父fiber
 * @param workInProgress 新的父fiber
 * @param nextChildren 新的子虚拟dom
 */
function reconcileChildren(current, workInProgress, nextChildren) {
    // current是根fiber
    // 如果此新fiber没有老的fiber，说明此新的fiber是新创建的额
    // 如果此这个父fiber是新的创建的，它的儿子们肯定都是新创建的
    if (current === null) {
        workInProgress.child = mountChildFibers(workInProgress, null, nextChildren)
    } else {
        // 更新的
        // 如果有老fiber的话，需要做dom-diff，需要拿老的子fiber链表和新的子虚拟dom及逆行比较，来做最小化的更新
        workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren)
    }
}

function updateHostRoot(current, workInProgress) {
    // 1- 需要知道它的子虚拟dom 知道它的儿子的虚拟dom信息
    processUpdateQueue(workInProgress) // workInProgress.memorized = { element }
    const nextState = workInProgress.memoizedState
    // nextChildren 就是新的子虚拟dom
    const nextChildren = nextState.element
    // 协调子节点，dom-diff 算法
    // 根据新的虚拟dom生成子fiber链表
    reconcileChildren(current, workInProgress, nextChildren)
    return workInProgress.child
    // 2-
}

/**
 * 构建原生组件的子fiber链表
 * @param current 老fiber
 * @param workInProgress 新fiber
 */
function updateHostComponent(current, workInProgress) {
    const { type } = workInProgress
    const nextProps = workInProgress.pendingProps
    let nextChildren = nextProps.children

    // 判断当前虚拟dom它的儿子是不是文本的独生子，字符串或者是数字
    // 如果是的话，
    const isDirectTextChild = shouldSetTextContext(type, nextProps)
    if (isDirectTextChild) {
        nextChildren = null
    }
    // console.log(current, workInProgress, nextChildren)
    // debugger
    reconcileChildren(current, workInProgress, nextChildren)
    return workInProgress.child
}

/**
 * 目标是根据虚拟dom构建新的fiber 子链表 child sibling
 * @param current 老的fiber
 * @param workInProgress 新的fiber
 * @returns {null}
 */
export function beginWork(current, workInProgress) {
    logger(' '.repeat(indent.number) + 'beginWork', workInProgress)
    indent.number += 2
    // console.log(current, 'fiber')
    // debugger
    switch (workInProgress.tag) {
        case HostRoot:
            return updateHostRoot(current, workInProgress)
        case HostComponent:
            return updateHostComponent(current, workInProgress)
        case HostText:
            return null
        default:
            return  null
    }
}

































