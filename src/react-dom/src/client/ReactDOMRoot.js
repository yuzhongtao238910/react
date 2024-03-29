import { createContainer,
    updateContainer
 } from "../../../react-conciler/src/ReactFiberReconciler"
/*
FiberRootNode
    containerInfo

HostRootFiber

 */
function ReactDOMRoot(internalRoot) {
    this._internalRoot = internalRoot
}

ReactDOMRoot.prototype.render = function (children) {

    const root = this._internalRoot
    updateContainer(children, root)
}

export function createRoot(container) {
    // container div#root
    const root = createContainer(container)
    return new ReactDOMRoot(root)
}
