import {createRouter, createWebHistory} from "vue-router";
import Home from "../pages/Home.vue";
import Help from "../pages/Help.vue";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component:Home
        },
        {
            path: "/home",
            redirect: "/"
        },
        {
            path: "/help",
            component: Help
        }
    ]
})