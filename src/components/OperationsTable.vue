<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3">
      <va-card-title>Operations</va-card-title>
      <va-card-content>
        <table class="va-table va-table--hoverable va-table--striped" style="width: 100%;">
          <thead>
          <tr>
            <th>Type</th>
            <th>Contract</th>
            <th>Entrypoint</th>
            <th>Args</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="operation in operations" :key="operation">
            <td>{{ Object.keys(operation)[0] }}</td>
            <td>
              <router-link :to="walletLink(operation[Object.keys(operation)[0]].contract_id)">
                {{ operation[Object.keys(operation)[0]].contract_id }}
              </router-link>
            </td>
            <td>{{ operation[Object.keys(operation)[0]].entry_point }}</td>
            <td>{{ operation[Object.keys(operation)[0]].args }}</td>
          </tr>
          </tbody>
        </table>
        <RawData :data="operations"/>
      </va-card-content>
    </va-card>
  </va-inner-loading>
</template>

<script lang="ts">

import RawData from "./RawData.vue";
export default {
  components: {RawData},
  props: {
    operations: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },
  methods: {
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
