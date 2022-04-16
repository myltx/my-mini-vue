import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  // 调用 patch 方法，为了方便后续递归处理
  patch(vnode, container);
}

function patch(vnode, container) {
  // 去处理组件
  // 判断是不是 element 类型
  // 如果是 element 就应该处理 element
  if (typeof vnode.type === "string") {
    processElement(vnode, container);
  } else {
    processComponent(vnode, container);
  }
}

function processComponent(vnode: any, container: any) {
  // 初始化 挂载 dom 组件
  mountComponent(vnode, container);
}
function mountComponent(vnode: any, container: any) {
  // 创建组件示例对象
  const instance = createComponentInstance(vnode);
  // 设置 component
  setupComponent(instance);
  setupRenderEffect(instance, container);
}
function setupRenderEffect(instance: any, container: any) {
  const subTree = instance.render();
  // subTree => 虚拟节点树 app.js 中设置的 h
  // vnode => path
  // vnode => element => mountElement
  patch(subTree, container);
}
function processElement(vnode: any, container: any) {
  // 创建 dom 添加至我们的视图
  const { type, props, children } = vnode;
  let el = document.createElement(type);
  // 判断 children 是不是数组 如果是数组就 遍历 重新执行 patch
  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el);
  }
  for (const key in props) {
    const val = props[key];
    el.setAttribute(key, val);
  }
  container.append(el);
}
// 处理 children 的 dom
function mountChildren(vnode: any, container: any) {
  vnode.children.forEach((v) => {
    patch(v, container);
  });
}
