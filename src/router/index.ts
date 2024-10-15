
import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import LoginPage from "@/views/LoginPage.vue";
import SignupPage from "@/views/signupPage.vue";
import LocationPage from "@/views/LocationPage.vue";
import ParametrePage from "@/views/ParametrePage.vue";
import TrajetPage from "@/views/TrajetPage.vue";
import {isLoggedIn} from "@/services/user";
import DetailsTrajetPage from "@/views/DetailsTrajetPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/trips",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/signup",
    name: "Signup",
    component: SignupPage,
  },
  {
    path: "/trips",
    name: "Liste Trajets",
    component: TrajetPage,
  },
  {
    path: "/settings",
    name: "Paramètres",
    component: ParametrePage,
  },
  {
    path: "/geolocation",
    name: "GéoLocalisation",
    component: LocationPage,
  },
  {
    path: "/details/:tripId",
    name: "Détails Trajet",
    component: DetailsTrajetPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const userLoggedIn = await isLoggedIn()

  if ((to.path !== "/login" && to.path !== "/signup") && userLoggedIn.value == '0') {
    next({name: 'Login', replace: true})
  }else if ((to.path === "/login" || to.path === "/signup") && userLoggedIn.value == '1') {
    next({name: 'GéoLocalisation', replace: true})
  } else {
    next()
  }


})

export default router;
