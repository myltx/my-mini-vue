import { NodeTypes } from "./ast";

const enum TagTypes {
  Start,
  End,
}

export function baseParse(content: string) {
  const context = createParserContext(content);
  return createRoot(parseChildren(context));
}
function parseChildren(context) {
  let nodes: any = [];
  let node;
  const s = context.source;
  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
  if (s.startsWith("{{")) {
    node = parseInterpolation(context);
  } else if (s[0] === "<") {
    if (/[a-z]/i.test(s[1])) {
      node = parseElement(context);
    }
  } else {
    //   if (/[a-z]|[0-9]|[\u4e00-\u9fa5]/i.test(s[0]))
    node = parseText(context);
  }
  nodes.push(node);
  return nodes;
}

// text 处理
function parseText(context) {
  const content = parseTextData(context, context.source.length);
  return {
    type: NodeTypes.TEXT,
    content,
  };
}

function parseTextData(context, length) {
  const content = context.source.slice(0, length);
  advanceBy(context, length);
  return content;
}
// element 处理
function parseElement(context: any) {
  // 获取tag
  const element = parseTag(context, TagTypes.Start);
  // 这一步是为了去除 </div> 闭合标签
  parseTag(context, TagTypes.Start);
  return element;
}

function parseTag(context, type: TagTypes) {
  const match: any = /^<\/?([a-z]*)/i.exec(context.source);
  const tag = match[1];

  advanceBy(context, match[0].length);
  advanceBy(context, 1);
  if (type === TagTypes.End) return;
  return {
    type: NodeTypes.ELEMENT,
    tag,
  };
}
// 插值处理
function parseInterpolation(context) {
  // 处理 message
  const openDelimiter = "{{"; // 分隔符
  const closeDelimiter = "}}";
  const closeIndex = context.source.indexOf("}}", openDelimiter.length);
  advanceBy(context, openDelimiter.length);

  const rawContentLength = closeIndex - openDelimiter.length;
  const rawContent = parseTextData(context, rawContentLength);
  const content = rawContent.trim();
  advanceBy(context, closeDelimiter.length);
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
