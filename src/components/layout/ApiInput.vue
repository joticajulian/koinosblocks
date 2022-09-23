<template>
  <va-input
      label="API node address"
      v-model="api"/>
  <va-button size="medium" @click="updateClientApi(api)">Set</va-button>
</template>
<script>
import {ref} from 'vue';
import {useClient} from "../../composable/useClient.ts";
import {useToast} from 'vuestic-ui'

export default {
  name: 'ApiInput',
  setup() {
    const {init} = useToast()
    const {updateApiAddress} = useClient();

    const api = ref(localStorage.getItem('api') || 'https://api.koinosblocks.com');

    return {
      api,
      updateClientApi: () => {
        localStorage.setItem('api', api.value);
        updateApiAddress(api.value)
        init({message: 'API node updated', position: 'bottom-right', color: 'success'})
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
