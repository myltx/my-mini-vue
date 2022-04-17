import { h } from "../h";

export function renderSlots(slots, name, props) {
  const slot = slots[name];
  if (slot) {
    if (typeof slot === "function") {
      return h("div", {}, slot(props));
    }
  }
}
