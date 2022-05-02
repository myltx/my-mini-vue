import { camelize, toHandlerKey } from "../shared";

export function emit(instance, event, ...args) {
  console.log("emit", event);
  // instance.props -> event
  const { props } = instance;
  //   TPP 先写特定行为 再重构为通用行为
  const handlerName = toHandlerKey(camelize(event));
  const handler = props[handlerName];
  handler && handler(...args);
}
