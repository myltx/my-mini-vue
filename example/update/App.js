import { h, ref } from "../../lib/my-mini-vue.esm.js";
export default {
  name: "App",
  setup() {
    const count = ref(0);
    const props = ref({
      foo: "foo",
      bar: "bar",
    });
    const onClick = () => {
      count.value++;
    };
    const onChangeProps = () => {
      props.value.foo = "new-foo";
    };
    const onChangeProps1 = () => {
      props.value.foo = undefined;
    };
    const onChangeProps2 = () => {
      props.value = {
        foo: "foo",
      };
    };
    return {
      count,
      props,
      onClick,
      onChangeProps,
      onChangeProps1,
      onChangeProps2,
    };
  },
  // ui
  render() {
    return h(
      "div",
      {
        id: "root",
        foo: this.props.foo,
        bar: this.props.bar,
      },
      [
        h("div", {}, `count: ${this.count}`), // 依赖收集
        h(
          "button",
          {
            onClick: this.onClick,
          },
          "click"
        ),
        h(
          "button",
          {
            onClick: this.onChangeProps,
          },
          "修改 foo 值为 new-foo"
        ),
        h(
          "button",
          {
            onClick: this.onChangeProps1,
          },
          "修改 foo 值为 undefined"
        ),
        h(
          "button",
          {
            onClick: this.onChangeProps2,
          },
          "删除 bar"
        ),
      ]
    );
  },
};
