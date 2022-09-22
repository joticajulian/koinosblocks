<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3" stripe stripe-color="success">
      <va-card-title>Transaction details</va-card-title>
      <va-card-content>
        <ElementWithDescription v-if="transaction" element="Transaction ID" :description="transaction.transaction.id"
                                :link="toTransactionLink(transaction.transaction.id)"/>
        <ElementWithDescription v-if="transaction" element="Chain ID" :description="transaction.transaction.header.chain_id" />
        <ElementWithDescription v-if="transaction" element="RC limit" :description="transaction.transaction.header.rc_limit" />
        <ElementWithDescription v-if="transaction" element="Nonce" :description="transaction.transaction.header.nonce" />
        <ElementWithDescription v-if="transaction" element="Operation merkle root" :description="transaction.transaction.header.operation_merkle_root" />
        <ElementWithDescription v-if="transaction" element="Payer" :description="transaction.transaction.header.payer" :link="toAddressLink(transaction.transaction.header.payer) "/>
        <ElementWithDescription v-if="transaction" element="Containing blocks" :description="transaction.containing_blocks.join(', ')" />
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
import ElementWithDescription from "./ElementWithDescription.vue";
import RawData from "./RawData.vue";

export default {
  components: {RawData, ElementWithDescription, OperationsTable, EventsTable, TransactionsTable},
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
      toAddressLink: (address: string) => `/address/${address}`
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
