import { h, renderSlots } from "../../lib/my-mini-vue.esm.js";
export const Foo = {
  name: "Foo",
  setup() {},
  render() {
    const foo = h("p", {}, "foo");
    const age = 18;
    return h("div", {}, [
      renderSlots(this.$slots, "header", { age }),
      foo,
      renderSlots(this.$slots, "footer"),
    ]);
  },
};
