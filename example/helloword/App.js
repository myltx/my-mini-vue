import { h } from "../../lib/my-mini-vue.esm.js";
import { Foo } from "./Foo.js";
window.self = null;
export default {
  // ui
  render() {
    window.self = this;
    return h(
      "div",
      {
        id: "h",
        class: "blue",
        onClick() {
          console.log("click");
        },
      },
      [h("p", {}, "hi, " + this.msg), h(Foo, { count: 1 })]
    );
    // return h("div", { id: "h", class: "red" }, [
    //   h("p", { class: "red" }, "hi"),
    //   h("p", { class: "blue" }, this.msg),
    // ]);
  },
  setup() {
    return {
      msg: "my-mini-vue",
    };
  },
};
