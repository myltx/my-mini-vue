import {
  h,
  ref,
  getCurrentInstance,
  nextTick,
} from "../../lib/my-mini-vue.esm.js";

export default {
  name: "App",
  setup() {
    const count = ref(0);
    const instance = getCurrentInstance();
    function onClick() {
      for (let i = 0; i < 100; i++) {
        count.value = i;
      }
      console.log(instance, "instance");
      nextTick(() => {
        console.log(instance, "instance");
      });
    }

    return { count, onClick };
  },

  render() {
    return h("div", { tId: 1 }, [
      // h("p", {}, "主页"),
      h("p", {}, "count: " + this.count),
      h("button", { onClick: this.onClick }, "update"),
      // h(NextTicker),
    ]);
  },
};
