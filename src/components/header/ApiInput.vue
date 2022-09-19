<template>
  <va-input
      label="API node address"
      v-model="api"/>
  <va-button size="medium" @click="updateClientApi(api)">Set</va-button>
</template>
<script>
import {ref} from 'vue';
import {useClient} from "../../composable/useClient.ts";

export default {
  name: 'ApiInput',
  setup() {
    const api = ref('https://api.koinosblocks.com');
    const {updateApiAddress} = useClient();
    return {
      api,
      updateClientApi: () => updateApiAddress(api.value)
    }
  }
};
</script>

<style scoped>
button {
  margin-left: 5px;
}
</style>
