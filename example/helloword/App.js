export const App = {
  // ui
  render() {
    h("div", this.msg);
  },
  setup() {
    return {
      msg: "my-mini-vue",
    };
  },
};
