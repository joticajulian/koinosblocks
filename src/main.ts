import {createApp} from "vue"
import App from "./App.vue"
import {createVuestic} from "vuestic-ui"
import 'vuestic-ui/css'
import Overview from './pages/Overview.vue';
import Block from './pages/Block.vue';
import Transaction from './pages/Transaction.vue';
import Address from './pages/Address.vue';
import {createRouter, createWebHistory} from "vue-router";
import hljsVuePlugin from "@highlightjs/vue-plugin";

const routes = [
    {path: '/', component: Overview},
    {path: '/block/:height', component: Block, meta: {title: 'Koinosblocks.com - block details'}},
    {path: '/tx/:id', component: Transaction, meta: {title: 'Koinosblocks.com - transaction details'}},
    {path: '/address/:address', component: Address, meta: {title: 'Koinosblocks.com - address details'}},
]

const router = createRouter({history: createWebHistory(), routes});

router.beforeEach((to, from, next) => {
    // @ts-ignore
    document.title = to?.meta?.title ?? 'Koinosblocks.com - Koinos blockchain Explorer';
    next();
});

const app = createApp(App)
app.use(router)
app.use(createVuestic())
app.use(hljsVuePlugin)
app.mount("#app")
