// 创建虚拟节点
// 接收是三个参数 后两个可选
import { ShapeFlags } from "../shared/ShapeFlags";
// 用 symbol 作为唯一标识
export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");
export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    key: props && props.key,
    shapeFlag: getShapeFlag(type),
    el: null,
  };
  if (typeof children === "string") {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  }
  // 如果是组件 并且children 是 object 那么就是 slot
  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === "object") {
      vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN;
    }
  }
  return vnode;
}
function getShapeFlag(type: any) {
  return typeof type === "string"
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}

// 创建slot text 形式的虚拟节点
export function createTextVNode(text: string) {
  return createVNode(Text, {}, text);
}
