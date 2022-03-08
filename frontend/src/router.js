//import Vue from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';

//Vue.use(Router);

const routes = [
    //{ Path: '', redirect: '/'},
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
/*
export default new Router ({
    routes: [
        { path: '/', component: Home },
        { path: '/Login', component: Login }
    ]
})*/