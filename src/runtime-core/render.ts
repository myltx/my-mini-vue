import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";
export function render(vnode, container) {
  // 调用 patch 方法，为了方便后续递归处理
  patch(vnode, container, null);
}

function patch(vnode, container, parentComponent) {
  // 去处理组件
  // 判断是不是 element 类型
  // 如果是 element 就应该处理 element
  const { type, shapeFlag } = vnode;
  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentComponent);
      break;
    case Text:
      processText(vnode, container);
      break;

    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container, parentComponent);
      } else {
        processComponent(vnode, container, parentComponent);
      }
      break;
  }
}

function processComponent(vnode: any, container: any, parentComponent) {
  // 初始化 挂载 dom 组件
  mountComponent(vnode, container, parentComponent);
}
// slot 只渲染 children 节点
function processFragment(vnode: any, container: any, parentComponent) {
  mountChildren(vnode, container, parentComponent);
}
// slot 渲染 text 格式节点
function processText(vnode: any, container: any) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.append(textNode);
}
function processElement(vnode: any, container: any, parentComponent) {
  mountElement(vnode, container, parentComponent);
}
function mountElement(vnode: any, container: any, parentComponent) {
  // 创建 dom 添加至我们的视图
  const { type, props, children, shapeFlag } = vnode;
  // vnode -> element -> div
  let el = (vnode.el = document.createElement(type));
  // 判断 children 是不是数组 如果是数组就 遍历 重新执行 patch
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el, parentComponent);
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
function mountChildren(vnode: any, container: any, parentComponent) {
  vnode.children.forEach((v) => {
    patch(v, container, parentComponent);
  });
}
function mountComponent(initialVNode: any, container: any, parentComponent) {
  // 创建组件示例对象
  const instance = createComponentInstance(initialVNode, parentComponent);
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
  patch(subTree, container, instance);
  // element -> mount
  initialVNode.el = subTree.el;
}
