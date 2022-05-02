import { isString } from "../../shared";
import { NodeTypes } from "./ast";
import {
  CREATE_ELEMENT_VNODE,
  helperMapName,
  TO_DISPLAY_STRING,
} from "./runtimeHelpers";

export function generate(ast) {
  const context = createCodegenContext();
  const { push } = context;

  genFunctionPreamble(ast, context);

  const functionName = "render";
  const args = ["_ctx", "_cache"];
  const signature = args.join(", ");

  push(`function ${functionName} (${signature}){`);
  push("return ");
  genNode(ast.codegenNode, context);
  push("}");

  return {
    code: context.code,
  };
}
// 导入部分代码生成
function genFunctionPreamble(ast, context) {
  const { push, helper } = context;
  const VueBinging = "Vue";
  const aliasHelper = (s) => `${helperMapName[s]}:${helper(s)}`;
  if (ast.helpers.length) {
    push(`const { ${ast.helpers.map(aliasHelper).join(", ")}} = ${VueBinging}`);
  }
  push(`\n`);
  push("return ");
}
function createCodegenContext() {
  const context = {
    code: "",
    push(source) {
      context.code += source;
    },
    helper(key) {
      return `_${helperMapName[key]}`;
    },
  };
  return context;
}
// 处理 code
function genNode(node: any, context: any) {
  switch (node.type) {
    case NodeTypes.TEXT:
      genText(node, context);
      break;
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context);
      break;
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context);
      break;
    case NodeTypes.ELEMENT:
      genElement(node, context);
      break;
    case NodeTypes.COMPOUND_EXPRESSION:
      genCompoundExpression(node, context);
      break;
    default:
      break;
  }
}
// 处理 element
function genElement(node, context) {
  const { push, helper } = context;
  const { tag, children, props } = node;
  push(`${helper(CREATE_ELEMENT_VNODE)}(`);
  genNodeList(genNullable([tag, props, children]), context);
  push(")");
}
// 处理转换 null 后的数组
function genNodeList(nodes, context) {
  const { push } = context;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (isString(node)) {
      push(node);
    } else {
      genNode(node, context);
    }
    if (i < nodes.length - 1) {
      push(", ");
    }
  }
}
// 将所有的 undefined 等转为 null
function genNullable(args) {
  return args.map((arg) => arg || "null");
}
// 处理 string
function genText(node, context) {
  const { push } = context;
  push(`'${node.content}'`);
}
// 处理 插值
function genInterpolation(node: any, context: any) {
  const { push, helper } = context;
  push(`${helper(TO_DISPLAY_STRING)}(`);
  genNode(node.content, context);
  push(`)`);
}
// 处理 表达式
function genExpression(node: any, context: any) {
  const { push } = context;
  push(`${node.content}`);
}
// 处理复合类型
function genCompoundExpression(node: any, context: any) {
  const { push } = context;
  const { tag, children } = node;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (isString(child)) {
      push(child);
    } else {
      genNode(child, context);
    }
  }
}
