<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3" stripe stripe-color="success">
      <va-card-title>Block details</va-card-title>
      <va-card-content>
        <div v-if="block_topology">
          <DescriptionRow description="Block ID" :data="prepareBlocks([block_topology.id])"/>
          <DescriptionRow description="Block height" :data="prepareBlocks([block_topology.block_height])"/>
          <DescriptionRow description="Created at" :data="toDateTime(block_topology.header.timestamp)"/>
          <DescriptionRow description="Previous block" :data="prepareBlocks([block_topology.header.previous])"/>
          <DescriptionRow description="Compute bandwidth used"
                          :data="block_topology.receipt.compute_bandwidth_used ?? '0'"/>
          <DescriptionRow description="Disk storage used" :data="block_topology.receipt.disk_storage_used ?? '0'"/>
          <DescriptionRow description="Network bandwidth used"
                          :data="block_topology.receipt.network_bandwidth_used ?? '0' "/>
          <DescriptionRow description="Transaction merkle root" :data="block_topology.header.transaction_merkle_root"/>
          <DescriptionRow description="Producer" :data="prepareProducers([block_topology.header.signer])" />
          <DescriptionRow description="Signature" :data="block_topology.signature"/>
          <DescriptionRow v-if="block_topology.header.approved_proposals" description="Approved proposals"
                          :data="prepareProposals(block_topology.header.approved_proposals)"/>
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
import DescriptionRow from "./DescriptionRow.vue";
import RawData from "./RawData.vue";
import {Transaction} from "koinos-rpc/dist/service/TransactionStore";
import moment from "moment/moment";

export default {
  components: {RawData, DescriptionRow, EventsTable, TransactionsTable},
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

      console.log(res.block_items);

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
      prepareProducers: (producers: string[]) => producers.map((p) => ({
        line: p,
        link: `/address/${p}`
      })),
      prepareBlocks: (blocks: any[]) => blocks.map((block: any) => ({
        line: block,
        link: `/block/${block}`
      })),
      prepareProposals: (proposals: string[]) => proposals.map((p) => ({
        line: p,
        link: `/proposal/${p}`
      })),
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
