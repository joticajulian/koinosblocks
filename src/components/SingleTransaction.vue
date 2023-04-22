<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3" stripe stripe-color="success">
      <va-card-title>Transaction details</va-card-title>
      <va-card-content v-if="!loading && !transactionExists">
        <va-alert
          color="info"
          :title="'Transaction not found'"
          center
          class="mb-4 mt-4"
        >
          Looks like the transaction you're looking for does not exists or is
          not included in a block yet. Please note that it takes some time to
          include transaction in a block. If you believe this transaction ID is
          valid, please try again in few minutes.
        </va-alert>
      </va-card-content>
      <va-card-content v-if="transactionExists">
        <va-alert v-if="wasReverted" color="danger" center class="mb-4 mt-4">
          This transaction was reverted
        </va-alert>
        <DescriptionRow
          v-if="transaction"
          description="Transaction ID"
          :data="prepareTransactions([transaction.transaction.id])"
        />
        <DescriptionRow
          v-if="transaction"
          description="Chain ID"
          :data="transaction.transaction.header.chain_id"
        />
        <DescriptionRow
          v-if="transaction"
          description="Payer"
          :data="preparePayers([transaction.transaction.header.payer])"
        />
        <DescriptionRow
          v-if="transaction && transaction.receipt"
          description="Max payer RC"
          :data="transaction.receipt.max_payer_rc ?? 0"
        />
        <DescriptionRow
          v-if="transaction"
          description="RC limit"
          :data="transaction.transaction.header.rc_limit"
        />
        <DescriptionRow
          v-if="transaction && transaction.receipt"
          description="RC used"
          :data="transaction.receipt.rc_used ?? 0"
        />
        <DescriptionRow
          v-if="transaction && transaction.receipt"
          description="Disk storage used"
          :data="transaction.receipt.disk_storage_used ?? 0"
        />
        <DescriptionRow
          v-if="transaction && transaction.receipt"
          description="Network bandwidth used"
          :data="transaction.receipt.network_bandwidth_used ?? 0"
        />
        <DescriptionRow
          v-if="transaction && transaction.receipt"
          description="Compute bandwidth used"
          :data="transaction.receipt.compute_bandwidth_used ?? 0"
        />
        <DescriptionRow
          v-if="transaction"
          description="Nonce"
          :data="transaction.transaction.header.nonce"
        />
        <DescriptionRow
          v-if="transaction"
          description="Operation merkle root"
          :data="transaction.transaction.header.operation_merkle_root"
        />
        <DescriptionRow
          v-if="transaction && transaction.transaction"
          description="Signatures"
          :data="transaction.transaction.signatures.join(', ')"
        />
        <DescriptionRow
          v-if="transaction"
          description="Containing blocks"
          :data="prepareBlocks(transaction.containing_blocks)"
        />
        <RawData v-if="transaction" :data="transaction" />
      </va-card-content>
    </va-card>
  </va-inner-loading>
  <OperationsTable
    v-if="operations"
    :operations="operations"
    :loading="loading"
  />
  <EventsTable
    v-if="events && events.length"
    :loading="loading"
    :events="events"
  />
</template>

<script lang="ts">
import { computed, ref } from 'vue';
import EventsTable from './transaction/EventsTable.vue';
import OperationsTable from './transaction/OperationsTable.vue';
import { useClient } from '../composable/useClient';
import DescriptionRow, { LinkedRow } from './common/DescriptionRow.vue';
import RawData from './common/RawData.vue';

export default {
  components: {
    RawData,
    DescriptionRow,
    OperationsTable,
    EventsTable,
  },
  props: {
    txId: {
      type: String,
      required: true,
    },
  },

  async setup(props: any) {
    const { client } = useClient();

    const transaction = ref<any | null>(null);
    const operations = ref(null);
    const loading = ref(true);

    const getTransaction = async (txId: number) => {
      transaction.value = null;
      try {
        const { transactions } =
          await client.transactionStore.getTransactionsById([txId]);
        if (!transactions) {
          return;
        }
        transaction.value = transactions[0];
        operations.value = transactions[0].transaction.operations;
        transaction.value.receipt = await getReceipt(
          transactions[0].containing_blocks[0],
          transactions[0].transaction.id,
        );
      } catch (e) {
        console.error(e);
      } finally {
        loading.value = false;
      }
    };

    const getReceipt = async (blockId: string, txId: string) => {
      const { block_items } = await client.blockStore.getBlocksById([blockId]);
      return block_items[0].receipt.transaction_receipts.find(
        (event: any) => event.id === txId,
      );
    };

    getTransaction(props.txId)
      .then(() => {
        console.log('done');
      })
      .catch((e) => {
        console.error(e);
      });

    return {
      transaction,
      operations,
      events: computed(() => transaction.value?.receipt?.events),
      loading,
      prepareBlocks: (blocks: string[]): LinkedRow[] =>
        blocks.map((b) => ({ text: b, link: `/block/${b}` })),
      preparePayers: (payers: string[]): LinkedRow[] =>
        payers.map((p) => ({ text: p, link: `/address/${p}` })),
      prepareTransactions: (transactions: string[]): LinkedRow[] =>
        transactions.map((t) => ({ text: t, link: `/tx/${t}` })),
      transactionExists: computed(() => !loading.value && transaction.value),
      wasReverted: computed(
        () => transaction.value?.receipt?.reverted === true,
      ),
    };
  },
};
</script>
