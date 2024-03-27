import { createFiberRoot } from "./ReactFiberRoot.js"
import { createUpdate, enqueueUpdate } from "./ReactFiberClassUpdateQueue.js"
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop.js"


export function createContainer(containerInfo) {
    return createFiberRoot(containerInfo)
}


/**
 * 更新容器，把虚拟dom element变成真实dom插入到container容器之中
 * element 虚拟dom
 * container dom容器 其实是FiberRootNode
 */ 
export function updateContainer(element, container) {
    // 获取当前的根fiber
    const current = container.current
    // 创建更新
    const update = createUpdate()
    // 要更新的虚拟dom
    update.payload = { element }
    // 把次更新对象添加到current这个根fiber的更新队列之中，返回根节点
    const root = enqueueUpdate(current, update)


    // 在fiber上面调度更新
    scheduleUpdateOnFiber(root)




    

}