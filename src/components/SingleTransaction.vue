<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3" stripe stripe-color="success">
      <va-card-title>Transaction details</va-card-title>
      <va-card-content v-if="!loading && !transactionExists">
        <va-alert color="info" :title="'Transaction not found'" center class="mb-4 mt-4">
          Looks like the transaction you're looking for does not exists or is not included in a block yet. Please note that it takes some time to include transaction in a block. If you believe this
          transaction ID is valid, please try again in few minutes.
        </va-alert>
      </va-card-content>
      <va-card-content v-if="transactionExists">
        <DescriptionRow v-if="transaction" description="Transaction ID"
                        :data="prepareTransactions([transaction.transaction.id])"/>
        <DescriptionRow v-if="transaction" description="Chain ID" :data="transaction.transaction.header.chain_id"/>
        <DescriptionRow v-if="transaction" description="RC limit" :data="transaction.transaction.header.rc_limit"/>
        <DescriptionRow v-if="transaction" description="Nonce" :data="transaction.transaction.header.nonce"/>
        <DescriptionRow v-if="transaction" description="Operation merkle root"
                        :data="transaction.transaction.header.operation_merkle_root"/>
        <DescriptionRow v-if="transaction" description="Payer"
                        :data="preparePayers([transaction.transaction.header.payer])"/>
        <DescriptionRow v-if="transaction" description="Containing blocks"
                        :data="prepareBlocks(transaction.containing_blocks)"/>
        <RawData v-if="transaction" :data="transaction"/>
      </va-card-content>
    </va-card>
  </va-inner-loading>
  <OperationsTable v-if="operations" :operations="operations" :loading="loading"/>
</template>

<script lang="ts">
import {computed, ref} from 'vue'
import TransactionsTable from "./transaction/TransactionsTable.vue";
import EventsTable from "./transaction/EventsTable.vue";
import OperationsTable from "./transaction/OperationsTable.vue";
import {useClient} from "../composable/useClient";
import DescriptionRow from "./common/DescriptionRow.vue";
import RawData from "./common/RawData.vue";

export default {
  components: {RawData, DescriptionRow, OperationsTable, EventsTable, TransactionsTable},
  props: {
    txId: {
      type: String,
      required: true
    }
  },

  async setup(props: any) {

    const {client} = useClient();

    const transaction = ref<any | null>(null);
    const operations = ref(null);
    const loading = ref(true);

    const getTransaction = async (txId: number) => {
      transaction.value = null;
      try {
        const {transactions} = await client.transactionStore.getTransactionsById([txId]);
        if (!transactions) {
          return;
        }
        transaction.value = transactions[0]
        operations.value = transactions[0].transaction.operations
      } catch (e) {
        console.error(e);
      } finally {
        loading.value = false;
      }

    }

    getTransaction(props.txId).then(() => {
      console.log("done");
    }).catch((e) => {
      console.error(e);
    });

    return {
      transaction,
      operations,
      loading,
      prepareBlocks: (blocks: string[]) => blocks.map((b) => ({line: b, link: `/block/${b}`})),
      preparePayers: (payers: string[]) => payers.map((p) => ({line: p, link: `/address/${p}`})),
      prepareTransactions: (transactions: string[]) => transactions.map((t) => ({line: t, link: `/tx/${t}`})),
      transactionExists: computed(() => !loading.value && transaction.value)
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
