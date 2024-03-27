export function shouldSetTextContext(type, props) {
    return typeof props.children === 'string' || typeof props.children === 'number'
}
