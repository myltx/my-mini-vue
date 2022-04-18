import { h, getCurrentInstance } from "../../lib/my-mini-vue.esm.js";
export const Foo = {
  name: "Foo",
  setup() {
    const instance = getCurrentInstance();
    console.log("Foo", instance);
  },
  render() {
    const foo = h("p", { name: "Foo" }, "foo");
    return h("div", {}, [foo]);
  },
};
