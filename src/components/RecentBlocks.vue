<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm" stripe stripe-color="success">
      <va-card-title>Recent blocks</va-card-title>
      <va-card-content>
        <table class="va-table va-table--hoverable  va-table--striped" style="width: 100%;">
          <thead>
          <tr>
            <th>Height</th>
            <th>Date</th>
            <th>ID</th>
            <th>Producer</th>
            <th>TXs</th>
            <th>Events</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="block in blocks" :key="block.block_id">
            <td>
              <router-link :to="blockLink(block.block_height)">
                {{ block.block_height }}
              </router-link>
            </td>
            <td :title="toRelativeTime(block.block.header.timestamp)">
              {{ toDateTime(block.block.header.timestamp) }}
            </td>
            <td>
              <router-link :to="blockLink(block.block_height)">
                {{ block.block_id }}
              </router-link>
            </td>
            <td>
              <router-link :to="walletLink(block.block.header.signer)">
                {{ block.block.header.signer }}
              </router-link>
            </td>
            <td>{{ block.block.transactions?.length ?? "0" }}</td>
            <td>{{ block.receipt.events.length }}</td>
          </tr>
          </tbody>
        </table>
      </va-card-content>
    </va-card>
  </va-inner-loading>
</template>

<script lang="ts">
import {onBeforeUnmount, ref} from 'vue'
import moment from "moment";
import {useClient} from "../composable/useClient";

export default {

  methods: {
    toRelativeTime: (timestamp: number) => {
      return moment.unix(timestamp / 1000).fromNow()
    },
    toDateTime: (timestamp: number) => {
      return moment.unix(timestamp / 1000).format("YYYY-MM-DD HH:mm:ss")
    },
    blockLink: (blockId: string) => `/block/${blockId}`,
    walletLink: (address: string) => `/address/${address}`
  },

  async setup() {

    let blocks = ref([]);
    const loading = ref(true);

    const updateBlocks = async () => {
      const {client} = useClient();
      const {topology} = await client.blockStore.getHighestBlock();
      const {block_items} = await client.blockStore.getBlocksByHeight(topology.id, topology.height - 20, 20);
      console.log(block_items);
      blocks.value = block_items.reverse();
      loading.value = false;
    }

    const intervalHandle = setInterval(updateBlocks, 1000);

    onBeforeUnmount(() => {
      clearInterval(intervalHandle);
    });

    return {
      blocks,
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
