import { effect } from "../reactivity/effect/effect";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
  } = options;
  function render(vnode, container) {
    // 调用 patch 方法，为了方便后续递归处理
    patch(null, vnode, container, null);
  }

  // n1 -> 旧的虚拟节点
  // n2 -> 新的虚拟节点
  function patch(n1, n2, container, parentComponent) {
    // 去处理组件
    // 判断是不是 element 类型
    // 如果是 element 就应该处理 element
    const { type, shapeFlag } = n2;
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container);
        break;

      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent);
        } else {
          processComponent(n1, n2, container, parentComponent);
        }
        break;
    }
  }

  // 初始化挂载
  function processComponent(n1, n2: any, container: any, parentComponent) {
    // 初始化 挂载 dom 组件
    mountComponent(n2, container, parentComponent);
  }

  // slot 只渲染 children 节点
  function processFragment(n1, n2: any, container: any, parentComponent) {
    mountChildren(n2, container, parentComponent);
  }
  // slot 渲染 text 格式节点
  function processText(n1, n2: any, container: any) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }
  // 将虚拟节点创建为真实 DOM
  function processElement(n1, n2: any, container: any, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container);
    }
  }
  // 处理 element 更新对比
  function patchElement(n1, n2, container) {
    console.log("patchComponent-------");
    console.log("n1:", n1);
    console.log("n2:", n2);
    console.log("我是更新");
  }
  function mountElement(vnode: any, container: any, parentComponent) {
    // 创建 dom 添加至我们的视图
    const { type, props, children, shapeFlag } = vnode;
    // vnode -> element -> div
    let el = (vnode.el = hostCreateElement(type));
    // 判断 children 是不是数组 如果是数组就 遍历 重新执行 patch
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent);
    }
    // 处理所有的 props
    for (const key in props) {
      const val = props[key];
      hostPatchProp(el, key, val);
    }
    // container.append(el);
    hostInsert(el, container);
  }
  // 处理 children 的 dom
  function mountChildren(vnode: any, container: any, parentComponent) {
    vnode.children.forEach((v) => {
      patch(null, v, container, parentComponent);
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
    // 通过使用 effect 依赖收集进行更新操作
    // 判断 instance 的 isMounted 状态 确定是否为初始化流程
    effect(() => {
      if (!instance.isMounted) {
        console.log("init-----");
        // 获取setup的数据 绑定到render this 上
        const { proxy } = instance;
        // call -> https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call
        const subTree = (instance.subTree = instance.render.call(proxy));
        // subTree => 虚拟节点树 app.js 中设置的 h
        // vnode => path
        // vnode => element => mountElement
        patch(null, subTree, container, instance);
        // element -> mount
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        // 获取到 旧的 subTree 以及新的subTree
        const { proxy } = instance;
        // 获取新的 subTree
        const subTree = instance.render.call(proxy);
        const prevTree = instance.subTree;
        instance.subTree = subTree;
        console.log("update----");
        patch(prevTree, subTree, container, instance);
      }
    });
  }
  return {
    createApp: createAppAPI(render),
  };
}
