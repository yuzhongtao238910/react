/*
简单来说：FiberRootNode = containerInfo,它的本质就是一个真实的容器的dom节点 div#root
其实就是一个真实的dom节点
fiber
	性能瓶颈
	js任务执行时间长
		浏览器刷新频率为60Hz，大概是16.6毫秒渲染一次，而js线程和渲染线程是互斥的，所以如果js线程执行任务的时间
		超过16.6ms，就会导致掉帧，导致卡顿，解决方案就是react利用空闲的时间进行更新，不影响渲染进程的渲染

		把一个耗时任务切分成为一个个的小任务，分布在每一帧里面的方式就叫做时间切片
屏幕刷新率
	目前大多数的设备的屏幕刷新率为60次/s
	浏览器渲染动画或者页面的每一帧的速率也需要跟设备屏幕的刷新率保持一致
	页面是一帧一帧绘制出来的，当每秒的帧数FPs达到60的时候，页面就会使流畅的，否则小于这个值，用户就会感觉卡顿
	每一个帧的预算时间是16.66毫秒
	1s60帧，所以我们书写代码求一帧的工作量不超过16.6.ms

帧
	每个帧的开头包括样式计算，布局和绘制
	js执行js引擎和页面渲染引擎在同一个渲染线程，gui渲染和js执行两者是互斥的
	如果某个任务的执行时间过长的话，浏览器就会推迟渲染
requestIdleCallback
	正常帧任务完成没超过16ms，就说明时间有富裕
	1）requestIdleCallback向浏览器申请时间片
	2）浏览器执行高优先级任务
	3）浏览器分配时间片
	4）requestIdleCallback执行完任务之后归还时间片
fiber
	我们可以通过某些调度策略合理分配cpu资源，从而提高用户的响应速度
	通过Fiber架构，让自己的调度过程变成可中断的操作，适时的让出cpu的执行权，让浏览器及时的响应用户的交互
单个任务执行不完依旧会是卡断
fiber是一个执行单元
	每次执行完一个执行单元，react会检查还剩下多少的时间，有时间执行下个单元，没时间&没任务将控制权交给浏览器
fiber是一个数据结构
	react目前使用的是链表，每个虚拟节点对应一个fiber

如果一个节点只有一个儿子，儿子是字符串或者数字的话，就不再为他创造节点了

链表
	单向链表
	双向链表
	循环链表
深度优先
	DFS Depth First Search
广度优先
	Breadth First Search
beginWork
	开始工作，下一个节点，先找大儿子，没有的话找弟弟，还没有的话找叔叔
completeWork
	自己所有的子节点完成后自己完成
ReactFiber.js
	双缓冲技术是在内存或者显存之中开辟一块与屏幕一样大小的存储区域，作为缓冲屏幕，将下一帧要显示的图像绘制
	到这个缓冲屏幕上面，在显示的时候将虚拟屏幕之中的数据复制到可见视频缓存区里面去

react执行分为两个阶段
	render 计算副作用
	commit 修改真实dom，或者叫做提交副作用

react18以前会搜集 effect
但是在18.2删除了所有的effects，不在收集effect，以后不再会有effect了 effectList没了

儿子的副作用会向上冒泡给父亲，有一个方法

根节点是非常特殊的，正常来说是先有虚拟dom -》fiber节点 -》真实dom
根节点比较特殊，一开始就有了真实dom react执行前就已经创建好了，不需要为它创建虚拟dom
但是根节点有fiber rootfiber

current指的是当前根容器它的现在正在显示或者说已经渲染好的fiber树
current是有特殊含义的，
fiber是一个数据结构
为什么需要有这样的数据结构，因为我们希望把构建fiber树的过程，或者说渲染的过程变成可中断，可恢复的事情


fiber树有两个：
	当前的和进行中的，一个老的，一个新的

react16之前：
	先有虚拟dom =》 生成真实dom，此过程是一气呵成的，中间是不能中断的，如果工作时间过长，可能会引起卡断
	fiber的数据结构，是链表，可以很方便的中断和重启操作
 */
import { createRoot } from "react-dom/client.js";
let element1 = (
		<h1 id="container">
			hello1 <span style={{color: 'red'}}>world1</span>
		</h1>
)
// console.log(element1)

let element2 = (
	<h3>
		<h2></h2>
	</h3>
)
// console.log(element2)

/*
FiberRoot 表示的是一个真实的dom节点
RootFiber 表示的是 Fiber树的根节点
 */


const root = createRoot(document.querySelector("#root"))
// console.log(root)/**/

// 把element虚拟dom渲染到容器之中
root.render(element1)



