<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3" stripe stripe-color="success">
      <va-card-title>Block #{{ height }} details</va-card-title>
      <va-card-content>
        <pre>{{ JSON.stringify(block_topology, null, 2) }}</pre>
      </va-card-content>
    </va-card>
    <TransactionsTable v-if="transactions" :loading="loading" :transactions="transactions"/>
    <EventsTable v-if="events" :loading="loading" :events="events"/>
    <va-card v-if="transactions" class="offset--sm row ma-3">
      <va-card-title>Transactions raw</va-card-title>
      <va-card-content>
        <pre>{{ JSON.stringify(transactions, null, 2) }}</pre>
      </va-card-content>
    </va-card>
    <va-card v-if="events" class="offset--sm row ma-3">
      <va-card-title>Events raw</va-card-title>
      <va-card-content>
        <pre>{{ JSON.stringify(events, null, 2) }}</pre>
      </va-card-content>
    </va-card>
  </va-inner-loading>
</template>

<script lang="ts">
import {ref} from 'vue'
import TransactionsTable from "./TransactionsTable.vue";
import EventsTable from "./EventsTable.vue";
import {useClient} from "../composable/useClient";

export default {
  components: {EventsTable, TransactionsTable},
  props: {
    height: {
      type: Number,
      required: true
    }
  },

  async setup(props: any) {

    const {client} = useClient();

    let block_topology = ref(null);
    let transactions = ref([]);
    let events = ref([]);
    const loading = ref(true);

    const getBlock = async (height: number) => {
      const {topology} = await client.blockStore.getHighestBlock();
      const {block_items} = await client.blockStore.getBlocksByHeight(topology.id, height, 1);
      console.log(block_items);
      block_topology.value = {
        block_height: block_items[0].block_height,
        block_id: block_items[0].block_id,
        header: block_items[0].block.header,
      }
      transactions.value = block_items[0].block.transactions;
      events.value = block_items[0].receipt.events;
      loading.value = false;
    }

    getBlock(props.height).then(() => {
      console.log("done");
    }).catch((e) => {
      console.error(e);
    });

    return {
      block_topology,
      transactions,
      events,
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
