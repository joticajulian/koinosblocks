<template>
  <div class="row entry">
    <span class="ent">{{row.seq_num ?? 0}}</span>
    <span class="ent" v-if="isTransaction(row)">Transaction</span>
    <span class="ent" v-if="isBlock(row) && !isProducer(row)">Impacted in block</span>
    <span class="ent" v-if="isBlock(row) && isProducer(row)">Produced block</span>
    <span class="ent">
      <router-link :to="link(row)">{{row.trx ? row.trx.transaction.id : row.block.receipt.id}}</router-link>
    </span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TransactionHistoryRow',
  props: {
    row: {
      type: Object,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  setup(props: any) {
    const isTransaction = (row: any) => row.trx !== undefined;
    const isBlock = (row: any) => row.block !== undefined;
    const isProducer = (row: any) => row.block?.header?.signer == props.address;
    const toTransactionLink = (id: string) => `/tx/${id}`;
    const toBlockLink = (id: string) => `/block/${id}`;
    const link = (row: any) => isTransaction(row) ? toTransactionLink(row.trx.transaction.id) : toBlockLink(row.block.receipt.id);
    return {
      isTransaction,
      isBlock,
      isProducer,
      link
    }
  }
}
</script>

<style scoped>
.entry {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0.3rem 0;
  margin-bottom: 0.5rem;
}
.ent {
  text-align: left;
  padding: 0 0.5rem;
}
</style>
