import { NodeTypes } from "../src/ast";
import { baseParse } from "../src/parse";

describe("Parse", () => {
  // 插值测试
  describe("interpolation", () => {
    test("simple interpolation", () => {
      const ast = baseParse("{{ message }}");
      // root
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: "message",
        },
      });
    });
  });

  // element 测试
  describe("element", () => {
    test("simple element div", () => {
      const ast = baseParse("<div></div>");
      // root
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "div",
      });
    });
  });

  // text 测试
  describe("text", () => {
    test("simple text", () => {
      const ast = baseParse("some text");
      // root
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.TEXT,
        content: "some text",
      });
    });
  });
});
