<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3">
      <va-card-title>Transactions</va-card-title>
      <va-card-content>
        <table class="va-table va-table--hoverable va-table--striped" style="width: 100%;">
          <thead>
          <tr>
            <th>ID</th>
            <th>RC limit</th>
            <th>Payer</th>
            <th>Operations</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td>
              <router-link :to="transactionLink(transaction.id)">
                {{ transaction.id }}
              </router-link>
            </td>
            <td>{{ transaction.header.rc_limit }}</td>
            <td>
              <router-link :to="walletLink(transaction.header.payer)">
                {{ transaction.header.payer }}
              </router-link>
            </td>
            <td>{{ transaction.operations.length }}</td>
          </tr>
          </tbody>
        </table>
        <RawData :data="transactions"/>
      </va-card-content>
    </va-card>
  </va-inner-loading>
</template>

<script lang="ts">
import moment from "moment";
import RawData from "./RawData.vue";

export default {
  components: {RawData},
  props: {
    transactions: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },

  methods: {
    toRelativeTime: (timestamp: number) => {
      return moment.unix(timestamp / 1000).fromNow()
    },
    toDateTime: (timestamp: number) => {
      return moment.unix(timestamp / 1000).format("YYYY-MM-DD HH:mm:ss")
    },
    transactionLink: (txId: string) => `/tx/${txId}`,
    walletLink: (address: string) => `/address/${address}`
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
