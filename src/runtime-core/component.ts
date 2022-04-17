import { shallowReadonly } from "../reactivity/reactive/reactive";
import { emit } from "./componentEmit";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlot";
import { initProps } from "./componentsProps";

export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    emit: () => {},
  };
  // bind -> https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
  component.emit = emit.bind(null, component) as any;
  return component;
}

export function setupComponent(instance) {
  // TODO: 这里初始化props slots的方法占位 后续实现
  // 初始化props
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  // 处理有状态的组件
  setupStatefulComponent(instance);
}
function setupStatefulComponent(instance: any) {
  // 获取用户给到的配置
  const Component = instance.type;
  // ctx 给 instance 设置proxy 代理对象 解决this. 获取数据的问题
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    // setup 返回function(组件的render函数) 或者object（注入到组件上下文）
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult: any) {
  // 处理function(组件的render函数) 或者object（注入到组件上下文）
  // TODO: 此处先实现了object 后续需要实现function 得逻辑
  if (typeof setupResult == "object") {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}
function finishComponentSetup(instance: any) {
  const Component = instance.type;
  instance.render = Component.render;
  // if (!instance.render) {
  //   instance.render = Component.render;
  // }
}
