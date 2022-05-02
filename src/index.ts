// mini-vue 出口
export * from "./runtime-dom";
import { baseCompiler } from "./compiler-core/src";
import * as runtimeDom from "./runtime-dom";
import { registerRuntimeCompiler } from "./runtime-dom";

function compilerToFunction(template) {
  // 调用 baseCompiler 返回 code 字符串

  const { code } = baseCompiler(template);
  const render = new Function("Vue", code)(runtimeDom);
  return render;
  //   renderFunction(runtimeDom);
  //   // 通过一个函数生成 接收一个 Vue 字段
  //   function renderFunction(Vue) {
  //     const {
  //       toDisplayString: _toDisplayString,
  //       createElementVNode: _createElementVNode,
  //     } = Vue;
  //     return function render(_ctx, _cache) {
  //       return _createElementVNode(
  //         "div",
  //         null,
  //         "hi," + _toDisplayString(_ctx.message)
  //       );
  //     };
  //   }
}
// 调用 registerRuntimeCompiler 给到内部使用
registerRuntimeCompiler(compilerToFunction);
