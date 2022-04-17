import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
export function render(vnode, container) {
  // 调用 patch 方法，为了方便后续递归处理
  patch(vnode, container);
}

function patch(vnode, container) {
  // 去处理组件
  // 判断是不是 element 类型
  // 如果是 element 就应该处理 element
  const { shapeFlag } = vnode;
  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container);
  } else {
    processComponent(vnode, container);
  }
}

function processComponent(vnode: any, container: any) {
  // 初始化 挂载 dom 组件
  mountComponent(vnode, container);
}
function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}
function mountElement(vnode: any, container: any) {
  // 创建 dom 添加至我们的视图
  const { type, props, children, shapeFlag } = vnode;
  // vnode -> element -> div
  let el = (vnode.el = document.createElement(type));
  // 判断 children 是不是数组 如果是数组就 遍历 重新执行 patch
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el);
  }
  // 处理所有的 props
  for (const key in props) {
    const val = props[key];
    const isOn = (key: string) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
      const event = key.slice(2).toLocaleLowerCase();
      el.addEventListener(event, val);
    } else {
      el.setAttribute(key, val);
    }
  }
  container.append(el);
}
// 处理 children 的 dom
function mountChildren(vnode: any, container: any) {
  vnode.children.forEach((v) => {
    patch(v, container);
  });
}
function mountComponent(initialVNode: any, container: any) {
  // 创建组件示例对象
  const instance = createComponentInstance(initialVNode);
  // 设置 component
  setupComponent(instance);
  setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance: any, initialVNode: any, container: any) {
  // 获取setup的数据 绑定到render this 上
  const { proxy } = instance;
  // call -> https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call
  const subTree = instance.render.call(proxy);
  // subTree => 虚拟节点树 app.js 中设置的 h
  // vnode => path
  // vnode => element => mountElement
  patch(subTree, container);
  // element -> mount
  initialVNode.el = subTree.el;
}
