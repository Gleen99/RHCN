import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/composition/authStore";
import type { RouteRecordRaw } from "vue-router";
import { Routes } from "@/enums"; // Import de l'énumération des routes

// Import des vues
import Home from "@/views/Home.vue";
import LegalsPage from "@/views/LegalsPage.vue";
import PrivateApp from "@/views/PrivateApp/PrivateApp.vue";
import Admin from "@/views/PrivateApp/Admin.vue";
import Dashboard from "@/views/PrivateApp/Dashboard/dashboard.vue";
import DashboardLayout from "@/views/PrivateApp/Dashboard/DashboardLayout.vue";
import Login from "@/components/PrivateApp/Dashboard/profil/Login.vue";
import ForgotPassword from "@/components/PrivateApp/Dashboard/profil/forgotPassword.vue";
import ResetPassword from "@/components/PrivateApp/Dashboard/profil/resetPassword.vue";
import AcceptInvitation from "@/components/PrivateApp/Dashboard/Invitation/acceptInvitation.vue";
import Invitation from "@/components/PrivateApp/Dashboard/Invitation/Invitation.vue";
import Collaborateurs from "@/components/PrivateApp/Dashboard/Collaborateurs/Collaborateurs.vue";
import Profil from "@/components/PrivateApp/Dashboard/profil/Profil.vue";
import Events from "@/views/Events.vue";
import Article from "@/views/Article.vue";
import Partners from "@/views/Partners.vue";
import AboutUs from "@/views/aboutUs.vue";
import Contact from "@/views/Contact.vue";
import Faq from "@/components/PrivateApp/Dashboard/faq/Faq.vue";
import Members from "@/components/PrivateApp/Dashboard/Members/Members.vue";
import Articles from "@/components/PrivateApp/Dashboard/Articles/Articles.vue";
import Categories from "@/components/PrivateApp/Dashboard/Category/Categories.vue";
import Images from "@/components/PrivateApp/Dashboard/Images/Images.vue";
import EventsDashboard from "@/components/PrivateApp/Dashboard/Events/EventsDashboard.vue";
import PartenairesIcons from "@/components/PrivateApp/Dashboard/Partenaires Icons/Partenaires-Icons.vue";
import BlogArticle from "@/components/Article/BlogArticle.vue";
import Blog from "@/components/Article/Blog.vue";
import MemeberInfos from "@/components/Partners/MemeberInfos.vue";

const routes: Array<RouteRecordRaw> = [
  // Pages publiques
  {
    path: "/",
    name: Routes.home,
    component: Home,
    meta: { requiresAuth: false },
  },
  {
    path: "/events",
    name: Routes.events,
    component: Events,
    meta: { requiresAuth: false },
  },
  {
    path: "/article",
    name: Routes.article,
    component: Blog,
    redirect: { name: Routes.articleHome },
    meta: { requiresAuth: false },
    children: [
      {
        path: '',
        name: Routes.articleHome,
        component: Article,
        meta: { requiresAuth: false },
      },
      {
        path: ':articleSlug',
        name: Routes.blog,
        component: BlogArticle,
        meta: { requiresAuth: false },
      },
    ]
  },
  {
    path: "/partners",
    name: Routes.partners,
    component: Partners,
    meta: { requiresAuth: false },
  },
  {
    path: "/aboutUs",
    name: Routes.aboutUs,
    component: AboutUs,
    meta: { requiresAuth: false },
  },
  {
    path: "/contact",
    name: Routes.contact,
    component: Contact,
    meta: { requiresAuth: false },
  },
  {
    path: "/cookies",
    name: Routes.cookies,
    component: LegalsPage,
    meta: { requiresAuth: false },
  },

  // Application privée
  {
    path: "/app",
    name: Routes.app,
    component: PrivateApp,
    redirect: { name: Routes.login },
    children: [
      {
        path: "admin",
        name: Routes.admin,
        component: Admin,
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "profil",
        name: Routes.profil,
        component: Profil,
        meta: { requiresAuth: true, roles: ["admin", "editor", "contributor"] },
      },
      {
        path: "login",
        name: Routes.login,
        component: Login,
        meta: { requiresAuth: false },
      },
      {
        path: "forgotPassword",
        name: Routes.forgotPassword,
        component: ForgotPassword,
        meta: { requiresAuth: false },
      },
      {
        path: "resetPassword",
        name: Routes.resetPassword,
        component: ResetPassword,
        meta: { requiresAuth: false },
      },
      {
        path: "acceptInvitation",
        name: Routes.acceptInvitation,
        component: AcceptInvitation,
        meta: { requiresAuth: true, roles: ["admin"] },
      },
      {
        path: "dashboard",
        name: Routes.DashboardLayout,
        component: DashboardLayout,
        redirect: { name: Routes.dashboard },
        children: [
          {
            path: "",
            name: Routes.dashboard,
            component: Dashboard,
            meta: { requiresAuth: true, roles: ["admin", "editor", "user"] },
          },
          {
            path: "invitation",
            name: Routes.invitation,
            component: Invitation,
            meta: { requiresAuth: true, roles: ["admin"] },
          },
          {
            path: "collaborateurs",
            name: Routes.collaborateurs,
            component: Collaborateurs,
            meta: { requiresAuth: true, roles: ["admin"] },
          },
          {
            path: "faq",
            name: Routes.faq,
            component: Faq,
            meta: { requiresAuth: true, roles: ["admin", "editor", "contributor"] },
          },
          {
            path: "members",
            name: Routes.members,
            component: Members,
            meta: { requiresAuth: true, roles: ["admin"] },
          },
          {
            path: "articles",
            name: Routes.articles,
            component: Articles,
            meta: { requiresAuth: true, roles: ["admin", "editor", "contributor"] },
          },
          {
            path: "category",
            name: Routes.category,
            component: Categories,
            meta: { requiresAuth: true, roles: ["admin", "editor"] },
          },
          {
            path: "images",
            name: Routes.images,
            component: Images,
            meta: { requiresAuth: true, roles: ["admin", "editor"] },
          },
          {
            path: "eventsDashboard",
            name: Routes.eventsdashboard,
            component: EventsDashboard,
            meta: { requiresAuth: true, roles: ["admin", "editor"] },
          },
          {
            path: "partenairesIcons",
            name: Routes.partenairesIcons,
            component: PartenairesIcons,
            meta: { requiresAuth: true, roles: ["admin", "editor"] },
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🚀 Middleware global pour la protection des routes
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const userRole = authStore.user?.role || "guest";

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next({ name: Routes.login });
    }

    const routeRoles = (to.meta.roles as string[]) || [];
    if (routeRoles.length > 0 && !routeRoles.includes(userRole)) {
      return next({ name: Routes.dashboard });
    }
  }

  next();
});

export default router;