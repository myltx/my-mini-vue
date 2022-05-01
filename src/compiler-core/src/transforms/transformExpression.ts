import { NodeTypes } from "../ast";

// 处理表达式
export function transformExpression(node) {
  if (node.type === NodeTypes.INTERPOLATION) {
    node.content = processExpression(node.content);
  }
}
// 因为 node.content.content 过长 进行封装优化处理
function processExpression(node: any) {
  node.content = `_ctx.${node.content}`;
  return node;
}
