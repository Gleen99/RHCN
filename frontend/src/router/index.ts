import Home from "@/views/Home.vue";
import { Routes } from "@/enums";
import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import LegalsPage from "@/views/LegalsPage.vue";
import { LegalType } from "@shared/enums";
import ChangeProfile from "@/views/PrivateApp/Login/ChangeProfile.vue";
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



const routes: Array<RouteRecordRaw> = [
  // Page d'accueil
  {
    path: "/",
    name: Routes.home,
    component: Home,
    meta: {
      noAuthentication: false,
    },
  },
   {
    path: "/events",
    name: Routes.events,
    component: Events,
    meta: {
      noAuthentication: false,
    },
  },
    {
      path: "/article",
      name: Routes.article,
      component: Article,
      meta: {
        noAuthentication: false,
      },
    },
    {
      path: "/article",
      name: Routes.article,
      component: Article,
      meta: {
        noAuthentication: false,
      },
    },
    {
      path: "/partners",
      name: Routes.partners,
      component: Partners,
      meta: {
        noAuthentication: false,
      },
    },
       {
      path: "/aboutUs",
      name: Routes.aboutUs,
      component: AboutUs,
      meta: {
        noAuthentication: false,
      },
    },
    {
      path: "/contact",
      name: Routes.contact,
      component: Contact,
      meta: {
        noAuthentication: false,
      },
    },
  
  // Page légale
  {
    path: "/cookies",
    name: Routes.cookies,
    component: LegalsPage,
    meta: {
      noAuthentication: true,
      type: LegalType.cookies,
    },
  },
  // Application privée
  {
    path: "/app",
    name: Routes.app,
    component: PrivateApp,
    redirect: { name: Routes.login }, // Redirection par défaut
    children: [
      {
        path: "admin",
        name: Routes.admin,
        component: Admin,
      },
      // Profil de l'utilisateur
      {
        path: "profil",
        name: Routes.ChangeProfile,
        component: ChangeProfile,
      },
      {
        path: "login",
        name: Routes.login,
        component: Login,
      },
      {
        path: "forgotPassword",
        name: Routes.forgotPassword,
        component: ForgotPassword,
      },  
       {
        path: "resetPassword",
        name: Routes.resetPassword,
        component: ResetPassword,
      },  
        {
        path: "acceptInvitation",
        name: Routes.acceptInvitation,
        component: AcceptInvitation,
      },
      // Section tableau de bord
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
          },
          {
            path: "invitation",
            name: Routes.invitation,
            component: Invitation,
          },
          {
            path: "collaborateurs",
            name: Routes.collaborateurs,
            component: Collaborateurs,
          },
               {
            path: "profil",
            name: Routes.profil,
            component: Profil,
          },
         
          {
            path: "faq",
            name: Routes.faq,
            component: Faq,
          },
          {
            path: "members",
            name: Routes.members,
            component: Members,
          },
           {
            path: "articles",
            name: Routes.articles,
            component: Articles,
          },
          {
            path: "category",
            name: Routes.category,
            component: Categories,
          },
          {
            path: "images",
            name: Routes.images,
            component: Images,
          },
          {
            path: "eventsDashboard",
            name: Routes.eventsdashboard,
            component: EventsDashboard,
          },
         
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
