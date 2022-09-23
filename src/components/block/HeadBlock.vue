<template>
  <va-inner-loading :loading="loading">
    <va-card color="primary" gradient>
      <va-card-title>Chain info</va-card-title>
      <va-card-content v-if="headInfo">
        <div v-if="headInfo.head_topology">
          <DescriptionRow description="Head block time"  :data="toDateTime(headInfo.head_block_time)"/>
          <DescriptionRow description="Head block height" :data="headInfo.head_topology.height.toString()"/>
          <DescriptionRow description="Last irreversible block" :data="headInfo.last_irreversible_block"/>
          <DescriptionRow description="Head state merkle root"  :data="headInfo.head_state_merkle_root"/>
          <DescriptionRow description="Head block ID" :data="headInfo.head_topology.id"/>
          <DescriptionRow description="Previous block" :data="headInfo.head_topology.previous"/>
        </div>
      </va-card-content>
    </va-card>
  </va-inner-loading>
</template>

<script lang="ts">
import {onBeforeUnmount, Ref, ref} from 'vue'
import {useClient} from "../../composable/useClient";
import DescriptionRow from "../common/DescriptionRow.vue";
import moment from "moment";

export default {
  components: {DescriptionRow},
  async setup() {

    let headInfo = ref<any>(null);
    const loading = ref(true);

    const updateBlocks = async () => {
      const {client} = useClient();
      const res = await client.chain.getHeadInfo();
      console.log(res);
      headInfo.value = res;
      loading.value = false;
    }

    const intervalHandle = setInterval(updateBlocks, 1000);

    onBeforeUnmount(() => {
      clearInterval(intervalHandle);
    });

    return {
      headInfo,
      loading,
      toBlockLink: (id: string) => `/block/${id}`,
      toDateTime: (timestamp: number) => moment.unix(timestamp / 1000).format("YYYY-MM-DD HH:mm:ss"),
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
