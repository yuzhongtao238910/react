import { createContainer } from "../../../react-conciler/src/ReactFiberReconciler"
/*
FiberRootNode
    containerInfo

HostRootFiber

 */
function ReactDOMRoot(internalRoot) {
    this._internalRoot = internalRoot
}
export function createRoot(container) {
    // container div#root
    const root = createContainer(container)
    return new ReactDOMRoot(root)
}
