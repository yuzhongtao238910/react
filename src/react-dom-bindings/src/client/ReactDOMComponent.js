import { setValueForStyles } from "./CSSPropertyOperations.js"
import setTextContent from "./setTextContent.js"
import { setValueForProperty } from "./DOMPropertyOperations.js"
const STYLE = 'style'
const CHILDREN = 'children'
function setInitialDOMProperties(tag, domElement, nextProps) {
    for (const propKey in nextProps) {
        if (nextProps.hasOwnProperty(propKey)) {
            const nextProp = nextProps[propKey]
            if (propKey === STYLE) {
                setValueForStyles(domElement, nextProp)
            } else if (propKey === CHILDREN) {
                // 儿子是单独处理的，除非是文本的独生子
                if (typeof nextProp === 'string') {
                    setTextContent(domElement, nextProp)
                } else if (typeof nextProp === 'number') {
                    setTextContent(domElement, nextProp+'')
                }

            } else if (nextProp !== null) {
                setValueForProperty(domElement,propKey, nextProp)
            }
        }
    }
}

export function setInitialProperties(domElement, tag, props) {
    setInitialDOMProperties(tag, domElement, props)
}
