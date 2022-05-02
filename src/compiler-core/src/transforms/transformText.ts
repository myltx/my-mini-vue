import { NodeTypes } from "../ast";
import { isText } from "../utisl";

export function transformText(node) {
  if (node.type === NodeTypes.ELEMENT) {
    return () => {
      const children = node.children;
      let currentContainer;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        // 判断是不是一个text
        if (isText(child)) {
          for (let j = i + 1; j < children.length; j++) {
            const next = children[j];

            if (isText(next)) {
              if (!currentContainer) {
                currentContainer = children[i] = {
                  type: NodeTypes.COMPOUND_EXPRESSION,
                  children: [child],
                };
              }
              currentContainer.children.push(" + ");
              currentContainer.children.push(next);
              // 添加完成后将处理过的删除掉
              children.splice(j, 1);
              // 因为删除了元素 所以 会影响到 children  少了一个  所以这里需要进行 j--
              j--;
            } else {
              // 如果是 element 就返回
              currentContainer = undefined;
            }
          }
        }
      }
    };
  }
}
