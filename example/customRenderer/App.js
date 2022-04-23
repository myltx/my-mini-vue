import { h } from "../../lib/my-mini-vue.esm.js";
export const App = {
  setup() {
    return {
      x: 100,
      y: 100,
    };
  },
  // ui
  render() {
    return h("rect", {
      x: this.x,
      y: this.y,
    });
  },
};
