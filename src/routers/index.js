import { createRouter, createWebHistory } from "vue-router";
import Home from "../page/Home.vue";
import ProductDetail from "../components/Product/ProductDetail.vue";
import Cart from "../page/Cart.vue";
import Login from "../page/Login.vue";
import Register from "../page/Register.vue";
import userService from "../services/userSercices";
import Payment from "../page/Payment.vue";
import Profile from "../page/Profile.vue";
import PaymentResult from "../page/PaymentResult.vue";
import History from "../page/History.vue";
import RegisterSuccess from "../page/RegisterSuccess.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [

    {
      path: '/admin',
      component: () => import('@/admin/AdminLayout.vue'),
      children: [
      {
        path: "adds",
        name: "AddProduct",
        component: () => import("@/views/admin/AddProduct.vue"),
      },
        {
        path: "edit-product",
        name: "EditProduct",
        component: () => import("@/views/admin/EditProduct.vue"),
      },
      {
        path: "orders",
        name: "OrderList",
        component: () => import("@/views/admin/OrderManage.vue"),
      },
        {
          path: 'products',
          name: 'AdminProducts',
          component: () => import('@/views/admin/ProductManage.vue')
        },
        {
          path: 'users',
          name: 'AdminUsers',
          component: () => import('@/views/admin/UserManage.vue')
        }
      ]
    },

    {
      path: "/payment/confirm",
      name: "PaymentConfirm",
      component: () => import("../page/PaymentConfirm.vue"),
    },
    {
      path: "/payment/processing",
      name: "PaymentProcessing",
      component: () => import("../page/PaymentProcessing.vue"),
    },
    {
      path: "/payment/result",
      name: "PaymentResult",
      component: () => import("../page/PaymentResult.vue"),
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
      path: "/register-success",
      name: "RegisterSuccess",
      component: RegisterSuccess
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
      path: "/history",
      name: "History",
      component: History,
    },
    {
      path: "/payment/:orderId/:totalPrice/:name/:address",
      name: "Payment",
      component: Payment,
    },
    {
      path: "/payment-result",
      name: "PaymentResult",
      component: PaymentResult,
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile,
      meta: { requiresAuth: true },
    },


    
  ],
});
