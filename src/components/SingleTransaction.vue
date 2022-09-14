<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3">
      <va-card-title>Transaction details</va-card-title>
      <va-card-content>
        <pre>{{ JSON.stringify(transaction, null, 2) }}</pre>
      </va-card-content>
    </va-card>
    <OperationsTable :operations="operations" :loading="loading"/>
  </va-inner-loading>
</template>

<script lang="ts">
import {ref} from 'vue'
import {Client} from "koinos-rpc";
import TransactionsTable from "./TransactionsTable.vue";
import EventsTable from "./EventsTable.vue";
import OperationsTable from "./OperationsTable.vue";

export default {
  components: {OperationsTable, EventsTable, TransactionsTable},
  props: {
    client: {
      type: Client,
      required: true
    },
    txId: {
      type: String,
      required: true
    }
  },

  async setup(props: any) {

    let transaction = ref(null);
    let operations = ref(null);
    const loading = ref(true);

    const getTransaction = async (txId: number) => {
      console.log('Asking for transaction', txId);
      const {transactions} = await props.client.transactionStore.getTransactionsById([txId]);
      console.log(transactions);
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
