import { effect } from "../reactivity/effect/effect";
import { EMPTY_OBJ } from "../reactivity/shared";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options;
  function render(vnode, container) {
    // 调用 patch 方法，为了方便后续递归处理
    patch(null, vnode, container, null, null);
  }

  // n1 -> 旧的虚拟节点
  // n2 -> 新的虚拟节点
  function patch(n1, n2, container, parentComponent, anchor) {
    // 去处理组件
    // 判断是不是 element 类型
    // 如果是 element 就应该处理 element
    const { type, shapeFlag } = n2;
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor);
        break;
      case Text:
        processText(n1, n2, container);
        break;

      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent, anchor);
        } else {
          processComponent(n1, n2, container, parentComponent, anchor);
        }
        break;
    }
  }

  // 初始化挂载
  function processComponent(
    n1,
    n2: any,
    container: any,
    parentComponent,
    anchor
  ) {
    // 初始化 挂载 dom 组件
    mountComponent(n2, container, parentComponent, anchor);
  }

  // slot 只渲染 children 节点
  function processFragment(
    n1,
    n2: any,
    container: any,
    parentComponent,
    anchor
  ) {
    mountChildren(n2.children, container, parentComponent, anchor);
  }
  // slot 渲染 text 格式节点
  function processText(n1, n2: any, container: any) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }
  // 将虚拟节点创建为真实 DOM
  function processElement(
    n1,
    n2: any,
    container: any,
    parentComponent,
    anchor
  ) {
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor);
    } else {
      patchElement(n1, n2, container, parentComponent, anchor);
    }
  }
  // 处理 element 更新对比
  function patchElement(n1, n2, container, parentComponent, anchor) {
    // console.log("patchComponent-------");
    // console.log("n1:", n1);
    // console.log("n2:", n2);
    // console.log("我是更新");
    // 因为更新时 n2 是没有 el 的所有需要将 n1 的 el 赋值给他
    const el = (n2.el = n1.el);
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    patchChildren(n1, n2, el, parentComponent, anchor);
    patchProps(el, oldProps, newProps);
  }
  // 处理更新时的 children
  function patchChildren(n1, n2, container, parentComponent, anchor) {
    const { shapeFlag: prevShapeFlag } = n1;
    const c1 = n1.children;
    const { shapeFlag } = n2;
    const c2 = n2.children;
    // 判断新的 children 是 text
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 再判断 旧的 children 是不是 array
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1);
      }
      if (c1 !== c2) {
        hostSetElementText(container, c2);
      }
    } else {
      // 如果新的 children 不是 text
      // 判断旧的 children 是不是 array
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, "");
        mountChildren(c2, container, parentComponent, anchor);
      } else {
        // array diff array
        patchKeyedChildren(c1, c2, container, parentComponent, anchor);
      }
    }
  }

  // 处理数组对比数组
  function patchKeyedChildren(
    c1,
    c2,
    container,
    parentComponent,
    parentAnchor
  ) {
    const l2 = c2.length;
    let i = 0;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    function isSomeVNodeType(n1, n2) {
      return n1.type === n2.type && n1.key === n2.key;
    }
    // 左侧对比
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];
      // 如果相等 就执行 patch 判断下级是不是相等
      if (isSomeVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      i++;
    }

    // 右侧
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      // 如果相等 就执行 patch 判断下级是不是相等
      if (isSomeVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    // 新的比老的多 创建
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : null;
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor);
          i++;
        }
      }
    }
    // 老的比新的多 删除
    else if (i > e2) {
      while (i <= e1) {
        hostRemove(c1[i].el);
        i++;
      }
    }
    // 中间对比
    else {
      let s1 = i;
      let s2 = i;
      // 记录新数组的数量
      // 执行累加数
      // 当 patched 大于 等于 toBePatched 时 就相当于后边的都需要删除掉
      const toBePatched = e2 - s2 + 1;
      let patched = 0;
      // 存储新的 数组中不同的元素 的映射表
      const keyToNewIndexMap = new Map();
      // 建立新旧关系 映射表 设置固定长度  可以优化性能
      const newIndexToOldIndexMap = new Array(toBePatched);
      // 记录是否需要移动状态
      let moved = false;
      let maxNewIndexSoFar = 0;
      // 初始化所有的映射为 0 ，为 0 的时候代表还未建立映射
      for (let i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;

      // 遍历新的数组将 值添加至map  key:i
      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i];
        keyToNewIndexMap.set(nextChild.key, i);
      }

      // 遍历旧的数组 新旧对比 处理逻辑
      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          hostRemove(prevChild.el);
          continue;
        }
        let newINdex;
        // 如果用户设置 key
        if (prevChild.key != null) {
          newINdex = keyToNewIndexMap.get(prevChild.key);
        } else {
          // 如果用户没有设置 key
          for (let j = s2; j <= e2; j++) {
            if (isSomeVNodeType(prevChild, c2[j])) {
              newINdex = j;
              break;
            }
          }
        }
        // 判断 旧的  在不在新的里边 不在就执行删除
        // 如果存就通过 patch 递归进行对比
        if (newINdex === undefined) {
          hostRemove(prevChild.el);
        } else {
          // 如果新的点 大于等于 maxNewIndexSoFar
          if (newINdex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newINdex;
          } else {
            moved = true;
          }
          // i + 1 是因为 初始化 newIndexToOldIndexMap 的时候为 0  所以需要进行  + 1
          newIndexToOldIndexMap[newINdex - s2] = i + 1;
          patch(prevChild, c2[newINdex], container, parentComponent, null);
          patched++;
        }
      }
      // 生成最长递增子序列
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : [];
      let j = increasingNewIndexSequence.length - 1; // 最长递增子序列 指针
      // 使用倒叙处理 是为了保证 锚点的准确性
      for (let i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = i + s2;
        const nextChild = c2[nextIndex];
        // 判断锚点是不是存在于 c2 如果不在 就是 null 追加在最后边
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null;
        // 如果新的不存在与映射表 那么就是新增
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, parentComponent, anchor);
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            hostInsert(nextChild.el, container, anchor);
          } else {
            j--;
          }
        }
      }
    }
  }

  // 删除 节点下的所有 children
  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el;
      hostRemove(el);
    }
  }
  // 处理更新时的 props
  function patchProps(el, oldProps: any, newProps: any) {
    if (oldProps !== newProps) {
      // 遍历 newProps 与 oldProps 对比 判断是修改还是删除
      for (const key in newProps) {
        const prevProp: any = oldProps[key];
        const nextProp: any = newProps[key];
        if (prevProp !== newProps) {
          hostPatchProp(el, key, prevProp, nextProp);
        }
      }
      // 遍历 oldProps 判断 key 在 newProps 中是否存在
      // 如果不存在就删除
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null);
          }
        }
      }
    }
  }
  function mountElement(vnode: any, container: any, parentComponent, anchor) {
    // 创建 dom 添加至我们的视图
    const { type, props, children, shapeFlag } = vnode;
    // vnode -> element -> div
    let el = (vnode.el = hostCreateElement(type));
    // 判断 children 是不是数组 如果是数组就 遍历 重新执行 patch
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el, parentComponent, anchor);
    }
    // 处理所有的 props
    for (const key in props) {
      const val = props[key];
      hostPatchProp(el, key, null, val);
    }
    // container.append(el);
    hostInsert(el, container, anchor);
  }
  // 处理 children 的 dom
  function mountChildren(
    children: any,
    container: any,
    parentComponent,
    anchor
  ) {
    children.forEach((v) => {
      patch(null, v, container, parentComponent, anchor);
    });
  }
  function mountComponent(
    initialVNode: any,
    container: any,
    parentComponent,
    anchor
  ) {
    // 创建组件示例对象
    const instance = createComponentInstance(initialVNode, parentComponent);
    // 设置 component
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container, anchor);
  }
  function setupRenderEffect(
    instance: any,
    initialVNode: any,
    container: any,
    anchor
  ) {
    // 通过使用 effect 依赖收集进行更新操作
    // 判断 instance 的 isMounted 状态 确定是否为初始化流程
    effect(() => {
      if (!instance.isMounted) {
        console.log("init-----");
        // 获取setup的数据 绑定到render this 上
        const { proxy } = instance;
        // call -> https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call
        const subTree = (instance.subTree = instance.render.call(proxy));
        // subTree => 虚拟节点树 app.js 中设置的 h
        // vnode => path
        // vnode => element => mountElement
        patch(null, subTree, container, instance, anchor);
        // element -> mount
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        // 获取到 旧的 subTree 以及新的subTree
        const { proxy } = instance;
        // 获取新的 subTree
        const subTree = instance.render.call(proxy);
        const prevTree = instance.subTree;
        instance.subTree = subTree;
        console.log("update----");
        patch(prevTree, subTree, container, instance, anchor);
      }
    });
  }
  return {
    createApp: createAppAPI(render),
  };
}
// 获取最长递增子序列
function getSequence(arr: number[]): number[] {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = (u + v) >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}
