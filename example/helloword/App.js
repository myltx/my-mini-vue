import { h } from "../../lib/my-mini-vue.esm.js";
window.self = null;
export default {
  // ui
  render() {
    window.self = this;
    // return h("div", { id: "h", class: "red" }, "hi," + this.msg);
    return h("div", { id: "h", class: "red" }, [
      h("p", { class: "red" }, "hi"),
      h("p", { class: "blue" }, this.msg),
    ]);
  },
  setup() {
    return {
      msg: "my-mini-vue",
    };
  },
};
