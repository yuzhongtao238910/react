import { markUpdateLaneFromFiberToRoot } from "./ReactFiberConcurrentUpdates.js"
import assign from "../../shared/assign.js"
export const UpdateState = 0
// 初始化更新队列
export function initialUpdateQueue(fiber) {
    // 创建一个新的更新队列
    // pending其实是一个循环链表
    const queue = {
        shared: {
            // 等待生效的队列
            pending: null
        }
    }
    fiber.updateQueue = queue
}

export function createUpdate() {
    const update = {
        tag: UpdateState
    }
    return update
}

export function enqueueUpdate(fiber, update) {
    const updateQueue = fiber.updateQueue
    const pending = updateQueue.pending

    if (!pending) {
        // 说明是初始化的状态
        update.next = update
    } else {
        update.next = pending.next
        pending.next = update
    }
    // 单项的循环链表
    // pending要指向最后一个更新，最后一个更新next指向第一个更新
    // 3 -》 1 -》 2 -》 3
    updateQueue.shared.pending = update




    // 返回根节点 从当前的fiber一直到根节点
    // 现在还没有将更新优先级的问题
    // 返回标记更新的赛道

    const root = markUpdateLaneFromFiberToRoot(fiber)

    return root
}


/**
 * 根据老状态和更新队列之中的更新计算 最新的状态
 * @param workInProgress 要计算的fiber
 */
export function processUpdateQueue(workInProgress) {
    const queue = workInProgress.updateQueue
    const pendingQueue = queue.shared.pending
    // 更新队列之中有内容的话
    if (pendingQueue !== null) {
        // 清除等待生效的更新
        queue.shared.pending = null
        // 获取更新队列之中的最后一个更新 update = { payload: {element: 'h1'}}
        const lastPendingpUpdate = pendingQueue
        // 指向第一个更新
        const firstPendingUpdate = lastPendingpUpdate.next
        // 把更新链表剪开，变成一个单链表
        lastPendingpUpdate.next = null

        // 获取老状态,虽然名字是newState，但是获取的是最初的memoizedState，其实是老状态
        let newState = workInProgress.memoizedState
        let update = firstPendingUpdate

        while (update) {
            // 根据老状态和更新计算新状态
            newState = getStateFromUpdate(update, newState)
            update = update.next
        }
        console.log(newState)
        // 把最终计算到的状态赋值给 memoizedState
        workInProgress.memoizedState = newState
    }
}

/**
 * 根据老抓状态和更新计算新状态
 * @param update 更新的对象其实有很多种类型
 * @param prevState
 */
function getStateFromUpdate(update, prevState) {
    console.log(prevState, update, 92)
    switch (update.tag) {
        // 一个新的fiber的memoizedState就是null
        // 此处合并的不是vdom，而是一个对象，对象里面的属性的值是vdom
        case UpdateState:
            const {payload} = update
            return assign({}, prevState, payload)
    }
}


























