import { hasOwn } from "../reactivity/shared";

const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
};

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setupState, props } = instance;
    if (hasOwn(setupState, key)) {
      return setupState[key];
    }
    // 处理 组件传入的 props
    if (hasOwn(props, key)) {
      return props[key];
    }
    // 判断key 是不是$el 如果是 就返回 vnode 的el
    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};
