import { createApp } from "vue";
import App from "./App.vue";
import routerFetch from "vue-router-fetch";
import router from "./router.js";

const app = createApp(App);
app.use(router);
app.use(routerFetch, { router });
app.mount("#app");
