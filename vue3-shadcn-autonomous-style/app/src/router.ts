import { createRouter, createWebHistory } from "vue-router";
import PainView from "./views/PainView.vue";
import OwnershipView from "./views/OwnershipView.vue";
import ThemeView from "./views/ThemeView.vue";
import TableView from "./views/TableView.vue";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/pain" },
    { path: "/pain", name: "pain", component: PainView },
    { path: "/ownership", name: "ownership", component: OwnershipView },
    { path: "/theme", name: "theme", component: ThemeView },
    { path: "/table", name: "table", component: TableView },
  ],
});
