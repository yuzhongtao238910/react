import * as ReactWorkTags from "../react-conciler/src/ReactWorkTags.js"

const ReactWorkTagsMap = new Map()

for (let tag in ReactWorkTags) {
    ReactWorkTagsMap.set(ReactWorkTags[tag], tag)
}
console.log(ReactWorkTagsMap)
export default function (prefix, workInProgress) {
    let tagValue = workInProgress.tag
    let tagName = ReactWorkTagsMap.get(tagValue)
    let str = `${tagName}`
    if (tagName === 'HostComponent') {
        str += `${workInProgress.type}`
    } else if (tagName === 'HostText') {
        str += `${workInProgress.pendingProps}`
    }
    console.log(`${prefix} -- ${str}`)
    return str
}
