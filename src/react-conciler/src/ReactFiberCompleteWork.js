import logger, { indent } from "../../shared/logger.js";
import {HostComponent, HostRoot, HostText} from "./ReactWorkTags.js";
import { createTextInstance, createInstance, appendInitialChild, finializeInitialChildren
} from "../../react-dom-bindings/src/client/ReactDOMHostConfig.js"
import {NoFlags} from "./ReactFiberFlags.js";


/**
 * 把当前完成的fiber所有的子节点对应的真实dom都挂在到自己的父parent真实节点上面
 * @param parent 当前完成fiber真实的dom节点
 * @param workInProgress 完成的fiber
 */
function appendAllChildren(parent, workInProgress) {
    let node = workInProgress.child
    while (node) {
        // 需要考虑函数组件，类组件的情况
        if (node.tag === HostComponent || node.tag === HostText) {
            // 如果子节点的类型是一个原生节点或者是一个文本节点，那么快就会直接添加
            appendInitialChild(parent, node.stateNode)
        } else if (node.child !== null) {
            // 如果是函数组件的的话，第一层的标记就不会原生，就需要继续向下找
            node = node.child
            continue
        }

        if (node === workInProgress) {
            return;
        }
        // 如果当前的节点没有弟弟
        while (node.sibling === null) {
            // 如果回到最初的父fiber 就结束了
            if (node.return === null || node.return === workInProgress) {
                return
            }
            // 回到父节点
            node = node.return
        }
        node = node.sibling
    }
}

/**
 * 完成一个fiber节点
 * @param current 老fiber
 * @param workInProgress 新的构建的fiber
 */
export function completeWork(current, workInProgress) {
    indent.number -= 2
    logger(' '.repeat(indent.number) + 'completeWork', workInProgress)


    const newProps = workInProgress.pendingProps
    // console.log(workInProgress)

    switch (workInProgress.tag) {
        case HostRoot:
            bubbleProperties(workInProgress)
            break
        // 如果完成的是原生节点的话
        case HostComponent:
            // 原生节点

            // 创建真实的dom节点
            const { type } = workInProgress
            const instance = createInstance(type, newProps, workInProgress)

            // 把自己所有的儿子都添加到自己身上，初次挂载
            // 这块更新和渲染是不一样的
            // 目前只在处理新节点的逻辑，后面会进行区分
            workInProgress.stateNode = instance
            // 把所有的儿子都添加到自己身上
            appendAllChildren(instance, workInProgress)
            finializeInitialChildren(instance, type, newProps)
            bubbleProperties(workInProgress)
            break
        // 判断fiber的类型
        case HostText: // 文本节点的话，创建真实的文本节点
            const newText = newProps
            // 创建真实的dom节点，并且传传入stateNode
            workInProgress.stateNode = createTextInstance(newText)
            // 向上冒泡属性


            bubbleProperties(workInProgress)

            break
    }
}


// 把副作用冒泡到根节点，然后统一处理
function bubbleProperties(completedWork) {
    let subtreeFlags = NoFlags
    // 遍历当前fiber的所有子节点，把所有子节点的副作用，以及子节点的子节点的副作用全部进行合并
    let child = completedWork.child
    // console.log(completedWork)
    // 副作用就是 增 删 改
    // debugger
    while (child !== null) {
        subtreeFlags |= child.subtreeFlags
        subtreeFlags |= child.flags
        child = child.sibling
    }
    completedWork.subtreeFlags = subtreeFlags
}


















