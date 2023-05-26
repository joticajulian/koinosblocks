<template>
  <va-navbar color="#ffffff">
    <template #left>
      <va-navbar-item>
        <router-link to="/">
          <img id="logo" src="/koinosblocks.png" alt="koinosblocks Logo" />
        </router-link>
      </va-navbar-item>
    </template>
    <template #center>
      <va-navbar-item>
        <router-link to="/contracts"> Contracts </router-link>
      </va-navbar-item>
      <va-navbar-item>
        <a
          href="https://fogata.io/pools/13iFaqgdnsoqUTCwZC9GtRXwh8ZvdiiPwm"
          target="_blank"
          >Mining pool</a
        >
      </va-navbar-item>
      <va-navbar-item>
        <a :href="switchToNetworkUrl" target="_blank">{{
          switchToNetworkName
        }}</a>
      </va-navbar-item>
    </template>
    <template #right>
      <va-navbar-item>
        <ApiInput />
      </va-navbar-item>
      <va-navbar-item>
        <KondorConnection />
      </va-navbar-item>
    </template>
  </va-navbar>
</template>

<script>
import ApiInput from './ApiInput.vue';
import { config } from '../../config';
import KondorConnection from './KondorConnection.vue';

export default {
  name: 'NavigationBar',
  components: { KondorConnection, ApiInput },
  setup() {
    const switchToNetworkName = config.SWITCH_TO_NETWORK_NAME;
    const switchToNetworkUrl = config.SWITCH_TO_NETWORK_URL;
    return {
      switchToNetworkName,
      switchToNetworkUrl,
    };
  },
};
</script>

<style scoped>
#logo {
  max-width: 150px;
}
a {
  margin: 0.5rem;
}
</style>
