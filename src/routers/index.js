import { createRouter, createWebHistory } from "vue-router";
import Home from "../page/Home.vue";
import ProductDetail from "../components/Product/ProductDetail.vue";
import Cart from "../page/Cart.vue";
import Login from "../page/Login.vue";
import Register from "../page/Register.vue";
import userService from "../services/userSercices";
import Payment from "../page/Payment.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [

    {
      path: "/payment/confirm",
      name: "PaymentConfirm",
      component: () => import("../page/PaymentConfirm.vue")
    },
    {
      path: "/payment/processing",
      name: "PaymentProcessing",
      component: () => import("../page/PaymentProcessing.vue")
    },
    {
      path: "/payment/result",
      name: "PaymentResult",
      component: () => import("../page/PaymentResult.vue")
    },

    {
      path: "/",
      component: Home,
    },

    {
      path: "/login",
      name: "Login",
      component: Login,
      beforeEnter: (to, from, next) => {
        // Check if the user is already logged in
        if (userService.isLoggedIn()) {
          next("/"); // Redirect to home if logged in
        } else {
          next(); // Allow access to login if not logged in
        }
      },
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
      beforeEnter: (to, from, next) => {
        // Check if the user is already logged in
        if (userService.isLoggedIn()) {
          next("/"); // Redirect to home if logged in
        } else {
          next(); // Allow access to login if not logged in
        }
      },
    },
    {
      path: "/product/:id",
      name: "ProductDetail",
      component: ProductDetail,
      props: true,
    },
    {
      path: "/cart",
      name: "Cart",
      component: Cart,
    },
    {
      path: "/payment/:orderId/:totalPrice/:name/:address",
      name: "Payment",
      component: Payment,
    },
  ],
});
