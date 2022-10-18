<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3" stripe stripe-color="success">
      <va-card-title>Block details</va-card-title>
      <va-card-content>
        <div v-if="block_topology">
          <DescriptionRow description="Block ID" :data="prepareBlocks([block_topology.block_id])"/>
          <DescriptionRow description="Block height" :data="prepareBlocks([block_topology.block_height])"/>
          <DescriptionRow description="Created at" :data="toDateTime(block_topology.block.header.timestamp)"/>
          <DescriptionRow description="Previous block" :data="prepareBlocks([block_topology.block.header.previous])"/>
          <DescriptionRow description="Number of transactions" :data="transactions?.length ?? '0' "/>
          <DescriptionRow description="Number of events" :data="events?.length ?? '0' "/>
          <DescriptionRow description="Compute bandwidth used"
                          :data="block_topology.receipt.compute_bandwidth_used ?? '0'"/>
          <DescriptionRow description="Disk storage used" :data="block_topology.receipt.disk_storage_used ?? '0'"/>
          <DescriptionRow description="Network bandwidth used"
                          :data="block_topology.receipt.network_bandwidth_used ?? '0' "/>
          <DescriptionRow description="Transaction merkle root" :data="block_topology.block.header.transaction_merkle_root"/>
          <DescriptionRow description="Producer" :data="prepareProducers([block_topology.block.header.signer])" />
          <DescriptionRow description="Signature" :data="block_topology.block.signature"/>
          <DescriptionRow v-if="block_topology.block.header.approved_proposals" description="Approved proposals"
                          :data="prepareProposals(block_topology.block.header.approved_proposals)"/>
        </div>
        <RawData :data="block_topology"/>
      </va-card-content>
    </va-card>
  </va-inner-loading>
  <TransactionsTable v-if="transactions" :loading="loading" :transactions="transactions"/>
  <EventsTable v-if="events && events.length" :loading="loading" :events="events"/>

</template>

<script lang="ts">
import {computed, ref, watch} from 'vue'
import TransactionsTable from "./transaction/TransactionsTable.vue";
import EventsTable from "./transaction/EventsTable.vue";
import {useClient} from "../composable/useClient";
import DescriptionRow, {LinkedRow} from "./common/DescriptionRow.vue";
import RawData from "./common/RawData.vue";
import moment from "moment/moment";
import {Block, Transaction} from "koinos-rpc";

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

    let block_topology = ref<Block | null>(null);
    const loading = ref(true);

    const getBlock = async (id: string | string) => {
      loading.value = true;
      const {topology} = await client.blockStore.getHighestBlock();
      if (id.startsWith('0x')) {
        const {block_items} = await client.blockStore.getBlocksById([id]);
        block_topology.value = block_items[0];
      } else {
        const {block_items} = await client.blockStore.getBlocksByHeight(topology.id, Number(id), 1);
        block_topology.value = block_items[0];
      }
      loading.value = false;
    }

    getBlock(props.id).catch((e) => {
      console.error(e);
    });

    watch(() => props.id, async () => {
      await getBlock(props.id);
    });

    const transactions = computed(() => {
      return block_topology.value?.block?.transactions;
    })

    const events = computed(() => {
      const events = [];
      if (block_topology.value?.receipt?.events) {
        events.push(...block_topology.value?.receipt?.events!);
      }
      if (block_topology.value?.receipt?.transaction_receipts) {
        block_topology.value.receipt?.transaction_receipts.reduce((acc, cur) => {
          if (!cur.events) {
            return acc;
          }
          acc.push(...cur.events);
          return acc;
        }, events);
      }
      return events;
    })


    return {
      block_topology,
      transactions,
      events,
      loading,
      toBlockLink: (blockId: string) => `/block/${blockId}`,
      toAddressLink: (address: string) => `/address/${address}`,
      prepareProducers: (producers: string[]): LinkedRow[] => producers.map((p) => ({
        text: p,
        link: `/address/${p}`
      })),
      prepareBlocks: (blocks: any[]): LinkedRow[] => blocks.map((block: any) => ({
        text: block,
        link: `/block/${block}`
      })),
      prepareProposals: (proposals: string[]): LinkedRow[] => proposals.map((p) => ({
        text: p,
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
