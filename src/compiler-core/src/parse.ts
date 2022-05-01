import { NodeTypes } from "./ast";

const enum TagTypes {
  Start,
  End,
}

export function baseParse(content: string) {
  const context = createParserContext(content);
  return createRoot(parseChildren(context, []));
}
function parseChildren(context, ancestors) {
  let nodes: any = [];
  // 循环处理 在未达到结束他条件时  一直循环处理 内部所有的 数据
  while (!isEnd(context, ancestors)) {
    let node;
    const s = context.source;
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
    if (s.startsWith("{{")) {
      node = parseInterpolation(context);
    } else if (s[0] === "<") {
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestors);
      }
    } else {
      //   if (/[a-z]|[0-9]|[\u4e00-\u9fa5]/i.test(s[0]))
      node = parseText(context);
    }
    nodes.push(node);
  }
  return nodes;
}

// text 处理
function parseText(context) {
  const endTokens = ["<", "{{"];
  let endIndex = context.source.length;
  for (let i = 0; i <= endTokens.length; i++) {
    const index = context.source.indexOf(endTokens[i]);
    if (index !== -1 && endIndex > index) {
      endIndex = index;
    }
  }
  const content = parseTextData(context, endIndex);
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
function parseElement(context: any, ancestors) {
  // 获取tag
  const element: any = parseTag(context, TagTypes.Start);
  ancestors.push(element);
  element.children = parseChildren(context, ancestors);
  ancestors.pop();
  // 这一步是为了去除 </div> 闭合标签
  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagTypes.Start);
  } else {
    throw new Error(`缺少结束标签:${element.tag}`);
  }

  return element;
}

function startsWithEndTagOpen(source, tag) {
  return (
    source.startsWith("</") &&
    source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
  );
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

function isEnd(context, ancestors) {
  const s = context.source;
  // 2. 遇到结束标签 停止循环
  if (s.startsWith("<")) {
    for (let i = ancestors.length - 1; i >= 0; i--) {
      const tag = ancestors[i].tag;
      if (startsWithEndTagOpen(s, tag)) {
        return true;
      }
    }
  }
  if (ancestors && s.startsWith(`</${ancestors}>`)) {
    return true;
  }
  // 1. context.source 有值时 继续循环
  return !s;
}
