import FactoryHome from "@/view/FactoryHome.vue";
import Login from "@/view/Login.vue";
import Register from "@/view/Register.vue";
import AddFactoryView from "@/view/AddFactoryView.vue";
import Details from "@/view/Details.vue";
import UserInfo from "@/view/UserInfo.vue";
import Cart from "@/view/Cart.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Factories',
            component: FactoryHome
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/register',
            name: 'Register',
            component: Register
        },
        {
            path: '/addfactory',
            name: 'AddFactory',
            component: AddFactoryView
        },
        {
            path: '/factories/:id',
            name: 'Details',
            component: Details
        },
        {
            path: '/users/:id',
            name: 'UserInfo',
            component: UserInfo
        },{
            path: '/cart',
            name: 'Cart',
            component: Cart
        }
    ]
})

export default router