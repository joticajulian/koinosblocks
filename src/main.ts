import { createApp } from 'vue';
import App from './App.vue';
import { createVuestic } from 'vuestic-ui';
import 'vuestic-ui/css';
import Overview from './pages/OverviewPage.vue';
import BlockPage from './pages/BlockPage.vue';
import TransactionPage from './pages/TransactionPage.vue';
import AddressPage from './pages/AddressPage.vue';
import ProposalPage from './pages/ProposalPage.vue';
import Proposals from './pages/ProposalsPage.vue';
import ContractsPage from './pages/ContractsPage.vue';
import { createRouter, createWebHistory } from 'vue-router';
import hljsVuePlugin from '@highlightjs/vue-plugin';
import VueGtag from 'vue-gtag';

const routes = [
  { path: '/', component: Overview },
  {
    path: '/block/:id',
    component: BlockPage,
    meta: { title: 'Koinosblocks.com - block details' },
  },
  {
    path: '/tx/:id',
    component: TransactionPage,
    meta: { title: 'Koinosblocks.com - transaction details' },
  },
  {
    path: '/address/:address',
    component: AddressPage,
    meta: { title: `Koinosblocks.com - address details` },
  },
  {
    path: '/proposal/:id',
    component: ProposalPage,
    meta: { title: 'Koinosblocks.com - proposal details' },
  },
  {
    path: '/proposals',
    component: Proposals,
    meta: { title: 'Koinosblocks.com - proposals' },
  },
  {
    path: '/contracts',
    component: ContractsPage,
    meta: { title: 'Koinosblocks.com - system contracts' },
  },
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, from, next) => {
  document.title =
    to?.meta?.title ?? 'Koinosblocks.com - Koinos blockchain explorer';
  next();
});

const app = createApp(App);
app.use(router);
app.use(VueGtag, { config: { id: 'G-4T8BF134X6' } }, router);
app.use(
  createVuestic({
    config: {
      colors: {
        variables: {
          backgroundPrimary: '#ffffff',
        },
      },
    },
  }),
);
app.use(hljsVuePlugin);
app.mount('#app');
