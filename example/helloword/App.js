import { h } from "../../lib/my-mini-vue.esm.js";
export default {
  // ui
  render() {
    // return h("div", { id: "h", class: "red" }, "hi," + this.msg);
    return h("div", { id: "h", class: "red" }, [
      h("p", { class: "red" }, "hi"),
      h("p", { class: "blue" }, "mini-vue"),
    ]);
  },
  setup() {
    return {
      msg: "my-mini-vue",
    };
  },
};
