<template>
  <va-card class="offset--sm row ma-3" stripe stripe-color="success">
    <va-card-title>Block #{{ height }} details</va-card-title>
    <va-card-content>
      <div v-if="block_topology">
        <ElementWithDescription element="Block ID" :description="block_topology.id"
                                :link="toBlockLink(block_topology.id)"/>
        <ElementWithDescription element="Block height" :description="block_topology.block_height"
                                :link="toBlockLink(block_topology.block_height)"/>
        <ElementWithDescription element="Previous block" :description="block_topology.header.previous"
                                :link="toBlockLink(block_topology.header.previous)"/>
        <ElementWithDescription element="Timestamp" :description="block_topology.header.timestamp"/>
        <ElementWithDescription element="Signer" :description="block_topology.header.signer"
                                :link="toAddressLink(block_topology.header.signer)"/>
        <ElementWithDescription element="Signature" :description="block_topology.signature"/>
      </div>
      <RawData :data="block_topology"/>
    </va-card-content>
  </va-card>
  <TransactionsTable v-if="transactions" :loading="loading" :transactions="transactions"/>
  <EventsTable v-if="events" :loading="loading" :events="events"/>
  <va-card v-if="transactions && transactions.length" class="offset--sm row ma-3">
    <va-card-title>Transactions raw</va-card-title>
    <va-card-content>
      <pre>{{ JSON.stringify(transactions, null, 2) }}</pre>
    </va-card-content>
  </va-card>
  <va-card v-if="events && events.length" class="offset--sm row ma-3">
    <va-card-title>Events raw</va-card-title>
    <va-card-content>
      <pre>{{ JSON.stringify(events, null, 2) }}</pre>
    </va-card-content>
  </va-card>
</template>

<script lang="ts">
import {ref} from 'vue'
import TransactionsTable from "./TransactionsTable.vue";
import EventsTable from "./EventsTable.vue";
import {useClient} from "../composable/useClient";
import ElementWithDescription from "./ElementWithDescription.vue";
import RawData from "./RawData.vue";

export default {
  components: {RawData, ElementWithDescription, EventsTable, TransactionsTable},
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
        id: block_items[0].block.id,
        signature: block_items[0].block.signature, // TODO fix type in koinos-rpc
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
      toBlockLink: (blockId: string) => `/block/${blockId}`,
      toAddressLink: (address: string) => `/address/${address}`,
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
