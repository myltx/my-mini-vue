import { h } from "../../lib/my-mini-vue.esm.js";
import { Foo } from "./Foo.js";
export default {
  // ui
  render() {
    const app = h("p", {}, this.msg);
    // const foo = h(Foo, {}, h("p", {}, "123"));
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => h("p", {}, "header" + age),
        footer: () => h("p", {}, "footer"),
      }
    );

    return h("div", {}, [app, foo]);
  },
  setup() {
    return {
      msg: "App",
    };
  },
};
