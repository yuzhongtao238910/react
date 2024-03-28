import { setInitialProperties } from "./ReactDOMComponent.js"
export function shouldSetTextContext(type, props) {
    return typeof props.children === 'string' || typeof props.children === 'number'
}
export function createTextInstance(content) {
    return document.createTextNode(content)
}
export function createInstance(type) {
    const domElement = document.createElement(type)
    // 属性的添加一会写
    return domElement
}
export function appendInitialChild(parent, child) {
    parent.appendChild(child)
}

export function finializeInitialChildren(domElement, type, props) {
    setInitialProperties(domElement, type, props)
}

export function appendChild(parentInstance, child) {
    parentInstance.appendChild(child)
}

export function insertBefore(parentInstance, child, beforeChild) {
    parentInstance.insertBefore(child, beforeChild)
}









































