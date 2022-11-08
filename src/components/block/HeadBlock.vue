<template>
  <va-inner-loading :loading="loading">
    <va-card class="square" outlined>
      <va-card-content v-if="headInfo" class="square">
        <div v-if="headInfo.head_topology" class="info">
          <!-- <div class="data-row">
            <DescriptionRow
              description="Time"
              :data="toDateTime(headInfo.head_block_time)"
            />
            </div> -->
            <div class="data-row">
              <DescriptionRow
              description="Head block height"
              :data="headInfo.head_topology.height.toString()"
            />
            </div>
            <div class="data-row">
            <DescriptionRow
              description="Last irreversible block"
              :data="headInfo.last_irreversible_block"
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
.square {
  border: none;
  padding: 0;
}

.info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 60%;
  margin: 0 auto;  
}
.data-row {
  width: 100%
}
</style>
