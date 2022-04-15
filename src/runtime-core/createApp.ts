import { render } from "./render";
import { createVNode } from "./vnode";

// 接收一个根组件 返回一个 App 对象
export function createApp(rootComponent) {
  return {
    // 这时候是需要转换为 VNode
    // vue3 原本接收一个字符串 这里简化直接接收 dom
    mount(rootContainer) {
      // 先转换为虚拟节点 vnode
      // component -> vnode
      // 后续所有逻辑操作 都会基于 vnode 处理
      const vnode = createVNode(rootContainer);
      render(vnode, rootContainer);
    },
  };
}
