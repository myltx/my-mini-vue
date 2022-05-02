import { createVnodeCall, NodeTypes } from "../ast";
import { CREATE_ELEMENT_VNODE } from "../runtimeHelpers";

export function transformElement(node, context) {
  if (node.type === NodeTypes.ELEMENT) {
    return () => {
      // 这里是中间处理层
      // tag 标签
      const vnodeTag = `'${node.tag}'`;
      // props 参数
      let vnoceProps;
      // children 节点
      const children = node.children;
      let vnodeChildren = children[0];

      const vnodeElement = createVnodeCall(
        context,
        vnodeTag,
        vnoceProps,
        vnodeChildren
      );
      node.codegenNode = vnodeElement;
    };
  }
}
