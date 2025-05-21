import { createRouter, createWebHistory } from "vue-router";
import UserView from "@/views/UserView";
import LoginView from "@/views/LoginView";
import RegisterView from "@/views/RegisterView";
import store from "@/services/store";
import SuratView from "@/views/SuratView.vue";
import ChatView from "@/views/ChatView.vue";
import ArsipView from "@/views/ArsipView.vue";
import HomeView from "@/views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "beranda",
    component: HomeView,
    meta: {
      title: "Beranda",
      authRequired: false,
      authForbidden: false,
    },
  },
  {
    path: "/users",
    name: "user",
    component: UserView,
    meta: {
      title: "Users",
      authRequired: true,
      authForbidden: false,
    },
  },
  {
    path: "/surat",
    name: "surat",
    component: SuratView,
    meta: {
      title: "Surat",
      authRequired: true,
      authForbidden: false,
    },
  },
  {
    path: "/surat/arsip",
    name: "arsip",
    component: ArsipView,
    meta: {
      title: "Arsip",
      authRequired: true,
      authForbidden: false,
    },
  },
  {
    path: "/chat",
    name: "chat",
    component: ChatView,
    meta: {
      title: "Chat",
      authRequired: true,
      authForbidden: false,
    },
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: {
      title: "Login",
      authRequired: false,
      authForbidden: true,
    },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
    meta: {
      title: "Register",
      authRequired: false,
      authForbidden: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (!store.state.isStoreUpdated) {
    await store.dispatch("updateStore");
  }

  const isAuthenticated = store.state.userLoggedIn;

  if (!isAuthenticated && to.meta.authRequired) {
    next({ path: "/" });
  } else if (isAuthenticated && to.meta.authForbidden) {
    next({ path: "/" });
  } else {
    next();
  }
});

router.afterEach((to) => {
  document.title = to.meta.title;
});

export default router;
