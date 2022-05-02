// 1. 深度优先搜索

import { NodeTypes } from "./ast";
import { TO_DISPLAY_STRING } from "./runtimeHelpers";

// 2. 修改 text content
export function transform(root, options = {}) {
  const context = createTransformsContext(root, options);
  // 1. 深度优先搜索
  traverseNode(root, context);
  createRootCodegen(root);

  root.helpers = [...context.helpers.keys()];
}

function createRootCodegen(root: any) {
  const child = root.children[0];
  if (child.type === NodeTypes.ELEMENT) {
    root.codegenNode = child.codegenNode;
  } else {
    root.codegenNode = root.children[0];
  }
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
  const exitFns: any = []; // 插件的退出收集
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i];
    const onExit = transform(node, context);
    if (onExit) {
      exitFns.push(onExit);
    }
  }

  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING);
      break;
    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      traverseChildren(node, context);

    default:
      break;
  }
  // 处理插件的退出逻辑
  let i = exitFns.length;
  while (i--) {
    exitFns[i]();
  }
}
// 处理 node children
function traverseChildren(node, context) {
  const children = node.children;
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    traverseNode(node, context);
  }
}

function createTransformsContext(root, options) {
  const context = {
    root,
    transforms: options.nodeTransforms || [],
    helpers: new Map(),
    helper(key) {
      context.helpers.set(key, 1);
    },
  };
  return context;
}
