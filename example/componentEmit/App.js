import { h } from "../../lib/my-mini-vue.esm.js";
import { Foo } from "./Foo.js";
window.self = null;
export default {
  // ui
  render() {
    window.self = this;
    return h("div", {}, [
      h("p", {}, "hi, " + this.msg),
      h(Foo, {
        onAdd(a, b) {
          console.log("Is onAdd", a, b);
        },
        onAddFoo() {
          console.log("Is onAddFoo");
        },
      }),
    ]);
  },
  setup() {
    return {
      msg: "App",
    };
  },
};
