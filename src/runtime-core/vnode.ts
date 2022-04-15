// 创建虚拟节点
// 接收是三个参数 后两个可选
export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
  };
  return vnode;
}
