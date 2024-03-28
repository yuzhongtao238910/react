import {HostComponent, HostRoot, HostText} from "./ReactWorkTags.js";
import {MutationMask, Placement} from "./ReactFiberFlags.js";
import { appendChild, insertBefore } from "../../react-dom-bindings/src/client/ReactDOMHostConfig.js"
function recursivelyTraverseMutationEffects(root, parentFiber) {
    if (parentFiber.subtreeFlags & MutationMask) {
        let { child } = parentFiber
        while (child!==null) {
            commitMutationEffectsOnFiber(child, root)
            child = child.sibling
        }
    }
}

function commitReconciliationEffects(finishedWork) {
    const { flags } = finishedWork
    // 如果此fiber要执行插入操作的
    if (flags & Placement) {
        // 进行操作操作，也就是把此fiber对应的真实dom节点添加到父真实的dom节点上
        commitPlacement(finishedWork)
        // 把flags里面的placement删除
        finishedWork.flags & ~Placement
    }
}

function isHostParent(fiber) {
    return fiber.tag === HostRoot || fiber.tag === HostComponent
}

function getHostParentFiber(fiber) {
    let parent = fiber.return
    while (parent !== null) {
        if (isHostParent(parent)) {
            return parent
        }
        parent = parent.return
    }

}



/**
 * 把子节点对应的真实dom添加到父节点之中
 * @param node 将要插入的fiber节点
 * @param parent 父真实dom节点
 */
function insertOrAppendPlacementNode(node, before, parent) {
    const { tag } = node
    // 判断此fiber对应的节点是不是真实的dom节点
    const isHost = tag === HostComponent || tag === HostText
    // 如果是的话，直接插入
    if (isHost) {
        const { stateNode } = node
        // 找到锚点
        if (before) {
            insertBefore(parent, stateNode, before)
        } else {
            appendChild(parent, stateNode)
        }
        // appendChild(parent, stateNode)
    } else {
        // 如果node不是真实的dom节点
        const { child } = node
        if (child !== null) {
            insertOrAppendPlacementNode(child, parent) // 大儿子添加到父亲dom节点里面取
            let { sibling } = child
            while (sibling !== null) {
                insertOrAppendPlacementNode(sibling, parent)
                sibling = sibling.sibling
            }
        }
    }
}

/**
 * 找到要插入的锚点
 * 找到可以插入在它的前面的那个fiber的对应的真实dom
 * @param fiber
 */
function getHostSibling(fiber) {
    let node = fiber
    siblings: while (true) {
        while (node.sibling === null) {
            if (node.return === null || isHostParent(node.return)) {
                return null
            }
            node = node.return
        }
        node = node.sibling
        // 如果弟弟不是原生节点也不是文本节点，就不能用
        while (node.tag !== HostComponent && node.tag !== HostText) {
            // 如果此节点是一个将要插入的新节点，找它的弟弟
            if (node.flags & Placement) {
                continue siblings // 直接退出到外层循环
            } else {
                node = node.child
            }
        }

        if (!(node.flags & Placement)) {
            return node.stateNode
        }
    }
}

/**
 * 把此fiber的真实dom插入到父dom里面
 * @param finishedWork
 */
function commitPlacement(finishedWork) {
    // console.log("commitPlacement", finishedWork)
    const parentFiber = getHostParentFiber(finishedWork)
    switch (parentFiber.tag) {
        case HostRoot:
        {
            const parent = parentFiber.stateNode.containerInfo
            // 如果在1和3之间插入2，那么我不需要无脑的append，只需要在1 3 之间插入2就可以了
            const before = getHostSibling(finishedWork) // 获取最近的弟弟真实dom节点
            insertOrAppendPlacementNode(finishedWork,before, parent)
            break
        }
        case HostComponent:
        {
            const parent = parentFiber.stateNode
            const before = getHostSibling(finishedWork) // 获取最近的弟弟真实dom节点
            insertOrAppendPlacementNode(finishedWork, before, parent)
            break
        }
        default:
            break

    }

    // 不能够直接这样取，需要网上找，找到是真实节点的fiber
    // let parentFiber = finishedWork.return
    // parentFiber.stateNode.appendChild(finishedWork.stateNode)
    // debugger
}
/**
 *
 * @param finishedWork fiber节点
 * @param root 根节点
 */
export function commitMutationEffectsOnFiber(finishedWork, root) {
    console.log(finishedWork, root)
    // 遍历fiber树，执行fiber上面的副作用
    switch (finishedWork.tag) {
        case HostRoot:
        case HostComponent:
        case HostText:
            // 递归遍历变更的副作用
            // 先便利他们的子节点，处理他们的子节点上的副作用
            recursivelyTraverseMutationEffects(root, finishedWork)
            // 在处理自己身上的副作用
            commitReconciliationEffects(finishedWork)
            break
        default:
            break
    }
    // debugger
}
















