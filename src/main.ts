import {createApp} from "vue"
import App from "./App.vue"
import {createVuestic} from "vuestic-ui"
import 'vuestic-ui/css'
import Overview from './pages/Overview.vue';
import Block from './pages/Block.vue';
import Transaction from './pages/Transaction.vue';
import Address from './pages/Address.vue';
import Proposal from './pages/Proposal.vue';
import Proposals from './pages/Proposals.vue';
import Contracts from './pages/Contracts.vue';
import {createRouter, createWebHistory} from "vue-router";
import hljsVuePlugin from "@highlightjs/vue-plugin";
import VueGtag from "vue-gtag";

const routes = [
    {path: '/', component: Overview},
    {path: '/block/:id', component: Block, meta: {title: 'Koinosblocks.com - block details'}},
    {path: '/tx/:id', component: Transaction, meta: {title: 'Koinosblocks.com - transaction details'}},
    {path: '/address/:address', component: Address, meta: {title: `Koinosblocks.com - address details`}},
    {path: '/proposal/:id', component: Proposal, meta: {title: 'Koinosblocks.com - proposal details'}},
    {path: '/proposals', component: Proposals, meta: {title: 'Koinosblocks.com - proposals'}},
    {path: '/contracts', component: Contracts, meta: {title: 'Koinosblocks.com - system contracts'}},
]

const router = createRouter({history: createWebHistory(), routes});

router.beforeEach((to, from, next) => {
    // @ts-ignore
    document.title = to?.meta?.title ?? 'Koinosblocks.com - Koinos blockchain explorer';
    next();
});

const app = createApp(App)
app.use(router)
app.use(VueGtag, {config: {id: "G-4T8BF134X6"}}, router)
app.use(createVuestic())
app.use(hljsVuePlugin)
app.mount("#app")
