import {HostComponent, HostRoot, HostText, IndeterminateComponent} from "./ReactWorkTags.js"
import { NoFlags } from "./ReactFiberFlags.js"

/**
 *
 * @param tag fiber的类型 函数组件0 类组件1 原生组件5 根元素3
 * @param pendingProps 新属性 等待处理 或者 说是生效的属性
 * @param key 唯一标识 每个虚拟dom属性都有一个唯一的标识
 * @constructor
 */
export function FiberNode(tag, pendingProps, key) {
    this.tag = tag
    this.key = key
    this.type = null // fiber的类型，来自于虚拟dom节点的type span div p
    // 每个虚拟dom =》 fiber节点 =》真实dom 1对1 对 1的关系
    // 根fiber的stateNode就是容器，不需要我们再次创建了
    this.stateNode = null // 此fiber对应的真实的dom节点，h1 => 真实的h1DOM

    this.return = null // 指向父节点
    this.child = null // 指向第一个子节点
    this.sibling = null // 指向下一个弟弟

    // fiber哪里来的？通过虚拟dom创建的，虚拟dom会提供 pendingProps 用来创建fiber节点的属性
    this.pendingProps = pendingProps // 等待生效的属性
    this.memoizedProps = null // 已经生效的属性


    // 类组件对应的fiber存储的就是类的实例的状态
    // 根fiber存储的就hi是要渲染的元素
    // 这个单词 就是这样写的
    this.memoizedState = null // 每个fiber还会有自己的状态 每一种fiber状态存储的类型不一样

    this.updateQueue = null // 每个fiber身上可能还有更新队列


    // 副作用的标识，表示要真的此fiber节点进行何种操作 NoFlags就是没有副作用，没有任何操作
    this.flags = NoFlags
    // 子节点 对应的副作用的标识 记住子节点的flags是为了性能优化
    this.subtreeFlags = NoFlags
    // 替身 轮替 一个fiber节点只有两个版本，一个老的，一个新的，来回实现替换
    // 在后面讲到dom diff的时候会用到
    this.alternate = null // 替身 更替 的意思

    this.index = 0
}
/*
we use a double buffering pooling technique because we know that ww'll only
 */
export function createFiber(tag, pendingProps, key) {
    return new FiberNode(tag, pendingProps, key)
}
export function createHostRootFiber() {
    return createFiber(HostRoot, null, null)
}


/**
 * 基本老的fiber和新的属性来创建新的fiber
 * @param current 老fiber
 * @param pendingProps 新属性
 */
export function createWorkInProgress(current, pendingProps) {
    // 拿到老的fiber的轮替
    let workInProgress = current.alternate

    if (!workInProgress) {
        // 没有，说明是创建的过程
        workInProgress = createFiber(current.tag, pendingProps, current.key)
        workInProgress.type = current.type
        workInProgress.stateNode = current.stateNode
        workInProgress.alternate = current
        current.alternate = workInProgress
    } else {
        // 有，说明是更新的过程
        workInProgress.pendingProps = pendingProps
        workInProgress.type = current.type
        workInProgress.flags = NoFlags
        workInProgress.subtreeFlags = NoFlags
    }
    workInProgress.child = current.child
    workInProgress.memoizedProps = current.memoizedProps
    workInProgress.memoizedState = current.memoizedState
    workInProgress.updateQueue = current.updateQueue
    workInProgress.sibling = current.sibling
    workInProgress.index = current.index

    return workInProgress
}


/**
 * 根据虚拟dom节点创建fiber节点
 * @param element
 */
export function createFiberFromElement(element) {
    const { type, key } = element
    const pendingProps = element.props
    return createFiberFromTypeAndProps(type, key, pendingProps)
}
function createFiberFromTypeAndProps(type, key, pendingProps) {
    let tag  = IndeterminateComponent // 先给一个默认值
    if (typeof type === 'string') {
        // 如果是一个字符串的话，说明此fiber类型是一个原生组件 div span，除此之外都是上面的
        tag = HostComponent
    }
    const fiber = createFiber(tag, pendingProps, key)
    fiber.type = type
    return fiber
}




export function createFiberFromText(content) {
    const fiber = createFiber(HostText, content, null)
    return fiber
}





















