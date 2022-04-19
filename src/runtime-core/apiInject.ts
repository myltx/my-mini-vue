import { getCurrentInstance } from "./component";

export function provide(key, value) {
  // 通过 getCurrentInstance 获取当前实例
  // 只能在setup 中使用
  // 因为 getCurrentInstance 是在setup之后赋值的 components -> setCurrentInstance() 可以查看
  const currentInstance: any = getCurrentInstance();
  if (currentInstance) {
    let { provides } = currentInstance;
    const parentProvides = currentInstance.parent?.provides;
    // Object.create() -> https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create
    // Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。
    // init provides 将 父组件的 provides

    // 判断 当前的 provides 是不是 与父级相等 如果相等 说明需要初始化
    if (parentProvides === provides) {
      // 原型绑定到 当前组件
      // 使用原型链解决 多层问题
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    // 当 当前组件的 provides 被设置后 就不会再与父级的 provides 相等
    provides[key] = value;
  }
}
export function inject(key, defaultValue) {
  const currentInstance: any = getCurrentInstance();
  if (currentInstance) {
    const provides = currentInstance.parent?.provides;
    // 如果 key 在 parentProvides 中
    if (key in provides) {
      return provides[key];
    } else if (defaultValue) {
      // 如果 defaultValue 有值
      if (typeof defaultValue === "function") {
        return defaultValue();
      } else {
        return defaultValue;
      }
    }
  }
}
