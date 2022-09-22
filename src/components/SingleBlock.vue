<template>
  <va-inner-loading :loading="loading">
  <va-card class="offset--sm row ma-3" stripe stripe-color="success">
    <va-card-title>Block details</va-card-title>
    <va-card-content>
      <div v-if="block_topology">
        <ElementWithDescription element="Block ID" :description="block_topology.id"
                                :link="toBlockLink(block_topology.id)"/>
        <ElementWithDescription element="Block height" :description="block_topology.block_height"
                                :link="toBlockLink(block_topology.block_height)"/>
        <ElementWithDescription element="Created at" :description="toDateTime(block_topology.header.timestamp)"/>
        <ElementWithDescription element="Previous block" :description="block_topology.header.previous"
                                :link="toBlockLink(block_topology.header.previous)"/>
        <ElementWithDescription element="Compute bandwidth used" :description="block_topology.receipt.compute_bandwidth_used ?? '0'" />
        <ElementWithDescription element="Disk storage used" :description="block_topology.receipt.disk_storage_used ?? '0'" />
        <ElementWithDescription element="Network bandwidth used" :description="block_topology.receipt.network_bandwidth_used ?? '0' "/>
        <ElementWithDescription element="Transaction merkle root" :description="block_topology.header.transaction_merkle_root"/>
        <ElementWithDescription element="Producer" :description="block_topology.header.signer"
                                :link="toAddressLink(block_topology.header.signer)"/>
        <ElementWithDescription element="Signature" :description="block_topology.signature"/>
        <ElementWithDescription v-if="block_topology.header.approved_proposals" element="Approved proposals" :description="block_topology.header.approved_proposals.join(', ')" :link="toProposalLink(block_topology.header.approved_proposals[0])"/>
      </div>
      <RawData :data="block_topology"/>
    </va-card-content>
  </va-card>
  </va-inner-loading>
  <TransactionsTable v-if="transactions" :loading="loading" :transactions="transactions"/>
  <EventsTable v-if="events" :loading="loading" :events="events"/>

</template>

<script lang="ts">
import {ref, watch} from 'vue'
import TransactionsTable from "./TransactionsTable.vue";
import EventsTable from "./EventsTable.vue";
import {useClient} from "../composable/useClient";
import ElementWithDescription from "./ElementWithDescription.vue";
import RawData from "./RawData.vue";
import {Transaction} from "koinos-rpc/dist/service/TransactionStore";
import moment from "moment/moment";

export default {
  components: {RawData, ElementWithDescription, EventsTable, TransactionsTable},
  props: {
    id: {
      type: Number,
      required: true
    }
  },

  async setup(props: any) {

    const {client} = useClient();

    let block_topology = ref(null);
    let transactions = ref<Transaction[]>([]);
    let events = ref<any[]>([]);
    const loading = ref(true);

    watch(() => props.id, async () => {
      await getBlock(props.id);
    });

    const getBlock = async (id: string | string) => {
      loading.value = true;
      let res;
      const {topology} = await client.blockStore.getHighestBlock();
      if (id.startsWith('0x')) {
        res = await client.blockStore.getBlocksById([id]);
      } else {
        res = await client.blockStore.getBlocksByHeight(topology.id, Number(id), 1);
      }

      console.log( res.block_items[0]);

      block_topology.value = {
        block_height: res.block_items[0].block_height,
        block_id: res.block_items[0].block_id,
        header: res.block_items[0].block.header,
        id: res.block_items[0].block.id,
        receipt: res.block_items[0].receipt,
        signature: res.block_items[0].block.signature, // TODO fix type in koinos-rpc
      }
      transactions.value = res.block_items[0].block.transactions;
      events.value = res.block_items[0].receipt.events;
      loading.value = false;
    }

    getBlock(props.id).then(() => {
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
      toProposalLink: (proposalId: string) => `/proposal/${proposalId}`,
      toRelativeTime: (timestamp: number) => {
        return moment.unix(timestamp / 1000).fromNow()
      },
      toDateTime: (timestamp: number) => {
        return moment.unix(timestamp / 1000).format("YYYY-MM-DD HH:mm:ss")
      },
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
