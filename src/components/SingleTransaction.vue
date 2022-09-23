<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3" stripe stripe-color="success">
      <va-card-title>Transaction details</va-card-title>
      <va-card-content>
        <DescriptionRow v-if="transaction" description="Transaction ID" :data="transaction.transaction.id"
                                :link="toTransactionLink(transaction.transaction.id)"/>
        <DescriptionRow v-if="transaction" description="Chain ID" :data="transaction.transaction.header.chain_id" />
        <DescriptionRow v-if="transaction" description="RC limit" :data="transaction.transaction.header.rc_limit" />
        <DescriptionRow v-if="transaction" description="Nonce" :data="transaction.transaction.header.nonce" />
        <DescriptionRow v-if="transaction" description="Operation merkle root" :data="transaction.transaction.header.operation_merkle_root" />
        <DescriptionRow v-if="transaction" description="Payer" :data="transaction.transaction.header.payer" :link="toAddressLink(transaction.transaction.header.payer) "/>
        <DescriptionRow v-if="transaction" description="Containing blocks" :data="prepareBlocks(transaction.containing_blocks)" />
        <RawData :data="transaction"/>
      </va-card-content>
    </va-card>
    <OperationsTable :operations="operations" :loading="loading"/>
  </va-inner-loading>
</template>

<script lang="ts">
import {ref} from 'vue'
import TransactionsTable from "./TransactionsTable.vue";
import EventsTable from "./EventsTable.vue";
import OperationsTable from "./OperationsTable.vue";
import {useClient} from "../composable/useClient";
import DescriptionRow from "./DescriptionRow.vue";
import RawData from "./RawData.vue";

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

    let transaction = ref(null);
    let operations = ref(null);
    const loading = ref(true);

    const getTransaction = async (txId: number) => {
      const {transactions} = await client.transactionStore.getTransactionsById([txId]);
      transaction.value = transactions[0]
      operations.value = transactions[0].transaction.operations
      loading.value = false;
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
      toTransactionLink: (id: string) => `/tx/${id}`,
      toAddressLink: (address: string) => `/address/${address}`,
      prepareBlocks: (blocks: string[]) => blocks.map((b)=>({
        line: b,
        link: `/block/${b}`
      }))
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
