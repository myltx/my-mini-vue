import { createApp } from "../../lib/my-mini-vue.esm.js";
import App from "./App.js";
// 流程
const rootContainer = document.querySelector("#app");
createApp(App).mount(rootContainer);
