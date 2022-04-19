import { h, provide, inject } from "../../lib/my-mini-vue.esm.js";

const ProviderOne = {
  name: "ProviderOne",
  setup() {
    provide("foo", "fooVal");
    provide("bar", "barVal");
  },
  render() {
    return h("div", {}, [h("p", {}, "ProviderOne"), h(ProviderTwo)]);
  },
};
const ProviderTwo = {
  name: "ProviderTwo",
  setup() {
    const foo = inject("foo");
    provide("foo", "fooTwo");
    // provide("bar", "barVal");
    return {
      foo,
    };
  },
  render() {
    return h("div", {}, [h("p", {}, `ProviderTwo - ${this.foo}`), h(Consumer)]);
  },
};

const Consumer = {
  name: "Consumer",
  setup() {
    const foo = inject("foo");
    const bar = inject("bar");
    // const baz = inject("baz", "defaultBaz");
    const baz = inject("baz", () => "defaultBazFunction");
    return {
      foo,
      bar,
      baz,
    };
  },
  render() {
    return h("div", {}, `Consumer: - ${this.foo} - ${this.bar} - ${this.baz}`);
  },
};
export default {
  name: "App",
  setup() {},
  render() {
    return h("div", {}, [h("p", {}, "apiInject"), h(ProviderOne)]);
  },
};
