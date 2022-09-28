<template>
  <va-input
      label="API node address"
      v-model="api"/>
  <va-button size="medium" @click="updateClientApi(api)">Set</va-button>
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

    const api = ref(localStorage.getItem('api') || 'https://api.koinosblocks.com');

    return {
      api,
      updateClientApi: () => {
        localStorage.setItem('api', api.value);
        updateApiAddress(api.value)

        showSuccess('API node updated');
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
