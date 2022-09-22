<template>
  <va-inner-loading :loading="loading">
    <va-card color="primary" gradient>
      <va-card-title>Head block info</va-card-title>
      <va-card-content v-if="topology">
        <div v-if="topology">
          <ElementWithDescription element="Block height" :description="topology.height.toString()" />
          <ElementWithDescription element="Block ID" :description="topology.id" />
          <ElementWithDescription element="Previous block" :description="topology.previous" />
        </div>
      </va-card-content>
    </va-card>
  </va-inner-loading>
</template>

<script lang="ts">
import {onBeforeUnmount, Ref, ref} from 'vue'
import {BlockTopology} from "koinos-rpc/dist/service/Chain";
import {useClient} from "../composable/useClient";
import ElementWithDescription from "./ElementWithDescription.vue";

export default {
  components: {ElementWithDescription},
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
