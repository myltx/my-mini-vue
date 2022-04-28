import { createRenderer } from "../runtime-core";

function createElement(type) {
  // console.log("createElement----------");
  return document.createElement(type);
}
function patchProp(el, key, preValue, nextValue) {
  // console.log("PatchProp----------");
  // console.log("preValue:", preValue);
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLocaleLowerCase();
    el.addEventListener(event, nextValue);
  } else {
    if (nextValue === undefined || nextValue == null) {
      el.removeAttribute(key, nextValue);
    } else {
      el.setAttribute(key, nextValue);
    }
  }
}
function insert(child, parent, anchor) {
  // console.log("insert----------");
  // parent.append(child);
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Node/insertBefore
  // Node.insertBefore() 方法在参考节点之前插入一个拥有指定父节点的子节点
  parent.insertBefore(child, anchor || null);
}

function remove(child) {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}

function setElementText(el, text) {
  el.textContent = text;
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
  remove,
  setElementText,
});

export function createApp(...args) {
  return renderer.createApp(...args);
}
export * from "../runtime-core";
