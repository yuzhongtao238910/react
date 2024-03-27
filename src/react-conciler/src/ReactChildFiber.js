// 第一次渲染
/*
<ul>
    <li>a</li>
</ul>

<ul>
    <li>a</li>
    <li>b</li>
</ul>
 */

/**
 * true 跟踪 false 不跟踪
 * @param shouldTrackSideEffects 是否跟踪副作用，是否需要比较
 */
import { REACT_ELEMENT_TYPE } from "../../shared/ReactSymbols.js"
import { createFiberFromElement, createFiberFromText } from "./ReactFiber.js"
import { Placement } from "./ReactFiberFlags.js"
import isArray  from "../../shared/isArray.js"


function createChildReconciler(shouldTrackSideEffects) {
    function reconcileSingleElement(returnFiber, currentFirstFiber, element) {
        // 因为我们现在实现的是初次挂载
        // 老节点currentFirstFiber肯定是没有的，所以可以直接根据虚拟dom创建新的fiber节点
        const created = createFiberFromElement(element)
        created.return = returnFiber
        return created
    }

    /**
     * 设置副作用
     * @param newFiber
     * @returns {*}
     */
    function placeSingleChild(newFiber) {
        if (shouldTrackSideEffects) { // 说明需要添加副作用
            // 需要在最后的提交阶段插入此节点
            // react渲染分为渲染和提交两个阶段
            // 渲染：构建fiber树
            // 提交：更新真实dom
            newFiber.flags |= Placement // 插入
        }

        return newFiber
    }

    function createChild(returnFiber, newChild) {
        if ((typeof newChild === 'string' && newChild !== '') || typeof newChild === 'number') {
            const created = createFiberFromText(`${newChild}`)
            created.return = returnFiber
            return created
        }


        if (typeof newChild === 'object' && newChild !== null) {
             switch (newChild) {
                 case REACT_ELEMENT_TYPE:
                     const created = createFiberFromElement(`${newChild}`)
                     created.return = returnFiber
                     return created;
             }
        }

        return null
    }


    function placeChild(newFiber, newIndex) {
        newFiber.index = newIndex
        if (shouldTrackSideEffects) {
            // 如果一个fiber它的flags有placement，说明此节点徐要创建真实dom并且插入到父容器之中
            // 如果父fiber节点是初次挂载，那么shouldTrackSideEffects变量是false，不需要添加flags
            // 那么会在完成阶段把所有的子节点全部添加到自己身上
            newFiber.flags |= Placement
        }
    }

    function reconcileChildrenArray(returnFiber, currentFirstFiber, newChildren) {
        console.log(returnFiber, currentFirstFiber, newChildren)
        let resultinfFirstChild = null // 返回的第一个新的儿子
        let previousNewFiber = null // 上一个新的fiber
        let newIndex = 0
        for (;newIndex < newChildren.length;newIndex++) {
            const newFiber = createChild(returnFiber, newChildren[newIndex])
            if (newFiber === null) {
                continue
            }
            placeChild(newFiber, newIndex)

            // 如果 previousNewFiber 为null，说明是第一个fiber
            if (previousNewFiber === null) {
                resultinfFirstChild = newFiber // 这个newFiber就是大儿子
            } else { // 说明不是大儿子，就把newFiber添加到上一个子节点的后面
                previousNewFiber.sibling = newFiber
            }
            // 让newFiber成为最后一个或者 上一个 子fiber
            previousNewFiber = newFiber
        }
        // 返回第一个子fiber
        return resultinfFirstChild
    }

    /**
     * 比较子fibers
     * 所谓的dom-diff就写在这个里面
     * dom-diff 就是用老的子fiber链表和新的虚拟dom进行比较的过程
     * @param returnFiber 新的父fiber
     * @param currentFirstFiber current一般来说指的是老的意思，老fiber的第一个子fiber
     * @param newChild 新的子虚拟dom
     */
    function  reconcileChildFibers(returnFiber, currentFirstFiber, newChild) {
        console.log(returnFiber, currentFirstFiber, newChild)
        // 现在暂时只考虑新的节点只有一个的情况
        if (typeof  newChild === 'object' && newChild !== null) {
            switch (newChild.$$typeof) {
                case REACT_ELEMENT_TYPE:
                    return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstFiber, newChild))
                default:
                    break
            }
        }

        // newChild: ['hello', span虚拟dom元素]

        if (isArray(newChild)) {
            return reconcileChildrenArray(returnFiber, currentFirstFiber, newChild)
        }

        return null

    }

    return reconcileChildFibers
}

// 有老fiber 更新的时候
export const reconcileChildFibers = createChildReconciler(true)

// 没有老fiber 初次挂载的时候
export const mountChildFibers = createChildReconciler(false)
























