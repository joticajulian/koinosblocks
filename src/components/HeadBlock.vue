<template>
  <va-inner-loading :loading="loading">
    <va-card>
      <va-card-title>Head info</va-card-title>
      <va-card-content v-if="topology">
        <pre>{{ JSON.stringify(topology, null, 2) }}</pre>
        <!--        <dl class="row">-->
        <!--          <dt class="flex md6">Id</dt>-->
        <!--          <dd class="flex md6">{{topology?.id}}</dd>-->
        <!--          <dt class="flex md6">Height</dt>-->
        <!--          <dd class="flex md6">{{topology?.height}}</dd>-->
        <!--          <dt class="flex md6">Previous</dt>-->
        <!--          <dd class="flex md6">{{topology?.previous}}</dd>-->
        <!--        </dl>-->
      </va-card-content>
    </va-card>
  </va-inner-loading>
</template>

<script lang="ts">
import {onBeforeUnmount, Ref, ref} from 'vue'
import {BlockTopology} from "koinos-rpc/dist/service/Chain";
import {useClient} from "../composable/useClient";

export default {
  async setup() {

    let topology: Ref<BlockTopology | null> = ref(null);
    const loading = ref(true);

    const updateBlocks = async () => {
      const {client} = useClient();
      const res = await client.blockStore.getHighestBlock();
      console.log(res.topology);
      topology.value = res.topology;
      loading.value = false;
    }

    const intervalHandle = setInterval(updateBlocks, 1000);

    onBeforeUnmount(() => {
      clearInterval(intervalHandle);
    });

    return {
      topology,
      loading,
    }
  }
}

</script>

<style scoped>
a {
  color: #34495e;
}

a:hover {
  text-decoration: underline;
}
</style>
