import { createApp } from "vue"
import App from "./App.vue"
import { createVuestic } from "vuestic-ui"
import 'vuestic-ui/css'
import Overview from './pages/Overview.vue';
import Block from './pages/Block.vue';
import Transaction from './pages/Transaction.vue';
import Address from './pages/Address.vue';
import {createRouter, createWebHistory} from "vue-router";
import hljsVuePlugin from "@highlightjs/vue-plugin";

const routes = [
    { path: '/', component: Overview },
    { path: '/block/:height', component: Block },
    { path: '/tx/:id', component: Transaction },
    { path: '/address/:address', component: Address },
]

const router = createRouter({history: createWebHistory(), routes});

const app = createApp(App)
app.use(router)
app.use(createVuestic())
app.use(hljsVuePlugin)
app.mount("#app")
