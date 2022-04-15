export function render(vnode, container) {
  // 调用 patch 方法，为了方便后续递归处理
  parch(vnode, container);
}

function parch(vnode, container) {
  // 去处理组件
  processComponent(vnode, container);
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}
function mountComponent(vnode: any, container: any) {
  createComponentInstance(vnode);
}
function createComponentInstance(vnode: any) {
	
}
