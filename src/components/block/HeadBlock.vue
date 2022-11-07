<template>
  <va-inner-loading :loading="loading">
    <va-card square outlined>
      <va-card-content v-if="headInfo">
        <div v-if="headInfo.head_topology" class="split-card">
          <div class="width-30">
            <DescriptionRow
              description="Time"
              :data="toDateTime(headInfo.head_block_time)"
            />
            <DescriptionRow
              description="Head block height"
              :data="headInfo.head_topology.height.toString()"
            />
            <DescriptionRow
              description="Last irreversible block"
              :data="headInfo.last_irreversible_block"
            />
          </div>
          <div class="width-70">
            <DescriptionRow
              description="Head state merkle root"
              :data="headInfo.head_state_merkle_root"
            />
            <DescriptionRow
              description="Head block ID"
              :data="headInfo.head_topology.id"
            />
            <DescriptionRow
              description="Previous block"
              :data="headInfo.head_topology.previous"
            />
          </div>
        </div>
      </va-card-content>
    </va-card>
  </va-inner-loading>
</template>

<script lang="ts">
import { ref } from "vue"
import { useClient } from "../../composable/useClient"
import DescriptionRow from "../common/DescriptionRow.vue"
import moment from "moment"
import { useInterval } from "../../composable/useInterval"

export default {
  components: { DescriptionRow },
  setup() {
    const { client } = useClient()
    const { set } = useInterval()

    let headInfo = ref<any>(null)
    const loading = ref(true)

    const updateBlocks = async () => {
      headInfo.value = await client.chain.getHeadInfo()
      loading.value = false
    }

    set(updateBlocks, 1000)

    return {
      headInfo,
      loading,
      toBlockLink: (id: string) => `/block/${id}`,
      toDateTime: (timestamp: number) =>
        moment.unix(timestamp / 1000).format("YYYY-MM-DD HH:mm:ss"),
    }
  },
}
</script>

<style scoped>
a {
  color: #34495e;
}

a:hover {
  text-decoration: underline;
}
.split-card {
  display: flex;
  justify-content: space-between;
}
</style>
