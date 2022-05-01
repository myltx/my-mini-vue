// 1. 深度优先搜索
// 2. 修改 text content
export function transform(root, options = {}) {
  const context = createTransformsContext(root, options);
  // 1. 深度优先搜索
  traverseNode(root, context);
  createRootCodegen(root);
}

function createRootCodegen(root: any) {
  root.codegenNode = root.children[0];
}
// 处理传入的 ast 树 深度遍历寻找需要修改的 值
function traverseNode(node: any, context) {
  //  console.log(node);
  // 为了达到测试效果 判断 node.type 是不是 text 如果是 就进行修改
  // 2. 修改 text content
  //   if (node.type === NodeTypes.TEXT) {
  //     node.content = node.content + "my-mini-vue";
  //   }
  const nodeTransforms = context.transforms;
  for (let i = 0; i < nodeTransforms.length; i++) {
    nodeTransforms[i] && nodeTransforms[i](node);
  }
  traverseChildren(node, context);
}
// 处理 node children
function traverseChildren(node, context) {
  const children = node.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      traverseNode(node, context);
    }
  }
}

function createTransformsContext(root, options) {
  return {
    root,
    transforms: options.nodeTransforms || [],
  };
}
