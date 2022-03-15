export function createApp(rootComponent) {
  return {
    // 这时候是需要转换为 VNode
    mount(rootContainer) {
      const vnode = createVnode(rootContainer);
      
    },
  };
}
