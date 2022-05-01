import { NodeTypes } from "./ast";

export function baseParse(content: string) {
  const context = createParserContext(content);
  return createRoot(parseChildren(context));
}
function parseChildren(context) {
  let nodes: any = [];
  let node;
  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
  if (context.source.startsWith("{{")) {
    node = parseInterpolation(context);
  }
  nodes.push(node);
  return nodes;
}
function parseInterpolation(context) {
  // 处理 message
  const openDelimiter = "{{"; // 分隔符
  const closeDelimiter = "}}";
  const closeIndex = context.source.indexOf("}}", openDelimiter.length);
  advanceBy(context, openDelimiter.length);

  const rawContentLength = closeIndex - openDelimiter.length;
  const rawContent = context.source.slice(0, rawContentLength);
  const content = rawContent.trim();
  advanceBy(context, rawContentLength + closeDelimiter.length);
  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content,
    },
  };
}

// 推进字符串
function advanceBy(context: any, length: number) {
  context.source = context.source.slice(length);
}
function createRoot(children) {
  return { children };
}

function createParserContext(content) {
  return {
    source: content,
  };
}
