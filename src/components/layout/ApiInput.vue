<template>
  <va-input
      label="API node address"
      v-model="url"
      @keyup.enter="updateClientApi(url)"/>
  <va-button
      size="medium"
      @click="updateClientApi(url)">Set
  </va-button>
</template>

<script>
import {ref} from 'vue';
import {useClient} from "../../composable/useClient";
import {useNotification} from "../../composable/useNotification";

export default {
  name: 'ApiInput',
  setup() {
    const {updateApiAddress} = useClient();
    const {showSuccess} = useNotification();

    const url = ref(localStorage.getItem('api') || 'https://api.koinosblocks.com');

    return {
      url,
      updateClientApi: () => {
        const currentApi = localStorage.getItem('api');
        if (currentApi !== url.value) {
          localStorage.setItem('api', url.value);
          updateApiAddress(url.value)
          showSuccess('API node updated');
        }
      }
    }
  }
};
</script>

<style scoped>
button {
  margin-left: 5px;
}
</style>
