<template>
  <div class="node-address">
    <va-select
      v-model="url"
      :options="availableApiUrls"
      allow-create="unique"
      label="API node address"
      search-placeholder-text="Search or enter new API url"
      @select="updateClientApi(url)"
      @create-new="addNewNodeUrl"
    />
    <va-button size="medium" @click="updateClientApi(url)"> Set </va-button>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useClient } from '../../composable/useClient';
import { useNotification } from '../../composable/useNotification';
import * as isUrl from 'is-url';
import { Client } from 'koinos-rpc';
import { config } from '../../config';

export default {
  name: 'ApiInput',
  setup() {
    const { updateApiAddress } = useClient();
    const { showSuccess, showError } = useNotification();

    // TEMPORARY: Remove old API URLs
    if (!localStorage.getItem('migrated')) {
      localStorage.removeItem('api');
      localStorage.removeItem('availableApiUrls');
      localStorage.setItem('migrated', 'true');
    }

    let savedApis = localStorage.getItem('availableApiUrls');

    const availableApiUrls = ref(
      savedApis ? JSON.parse(savedApis) : config.DEFAULT_API_NODES,
    );

    const url = ref(localStorage.getItem('api') ?? availableApiUrls.value[0]);

    console.log('availableApiUrls[0]', availableApiUrls[0]);
    console.log('url', url);

    const updateClientApi = () => {
      const currentApi = localStorage.getItem('api');
      if (currentApi !== url.value) {
        localStorage.setItem('api', url.value);
        updateApiAddress(url.value);
        showSuccess('API node updated');
      }
    };

    const addNewNodeUrl = async (url) => {
      if (!isUrl(url)) {
        showError('Invalid URL');
        return;
      }
      if (!(await validateChainId(url))) {
        showError('Looks like the node you entered is on a different chain');
        return;
      }

      availableApiUrls.value.push(url);
      localStorage.setItem(
        'availableApiUrls',
        JSON.stringify(availableApiUrls.value),
      );
    };

    const validateChainId = async (url) => {
      try {
        const client = new Client(url);
        const response = await client.chain.getChainId();
        return response.chain_id === config.CHAIN_ID;
      } catch (e) {
        console.log(e);
        return false;
      }
    };

    watch(url, updateClientApi);

    return {
      url,
      availableApiUrls,
      updateClientApi,
      addNewNodeUrl,
    };
  },
};
</script>

<style scoped>
.node-address {
  --va-select-min-width: 300px;
}
button {
  margin-left: 5px;
}
</style>
