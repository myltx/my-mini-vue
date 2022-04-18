import { h, getCurrentInstance } from "../../lib/my-mini-vue.esm.js";
import { Foo } from "./Foo.js";
export const App = {
  name: "App",
  render() {
    const app = h("p", {}, "app");
    const foo = h(Foo);

    return h("div", {}, [app, foo]);
  },
  setup() {
    const instance = getCurrentInstance();
    console.log("App", instance);
  },
};
