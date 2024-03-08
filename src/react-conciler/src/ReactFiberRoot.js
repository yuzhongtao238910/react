import { createHostRootFiber } from "./ReactFiber.js"
import { initialUpdateQueue } from "./ReactFiberClassUpdateQueue.js"
function FiberRootNode(containerInfo) {
    this.containerInfo = containerInfo
}
export function createFiberRoot(containerInfo) {
    const root = new FiberRootNode(containerInfo)
    // uninitializedFiber 未初始化的fiber
    const uninitializedFiber = createHostRootFiber() // 根 fiber HostRoot指的就是根节点
    /*
        FiberRootNode
            current -> HostRootFiber
        HostRootFiber
            stateNode -> FiberRootNode
     */
    // 项目的根 根容器的current指向当前的根fiber
    // 根fiber的stateNode，也就是真实dom节点指向
    root.current = uninitializedFiber
    uninitializedFiber.stateNode = root
    // 初始化更新队列 依据的就是虚拟dom
    initialUpdateQueue(uninitializedFiber)
    return root
}



















