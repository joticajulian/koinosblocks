<template>
  <table
    class="va-table va-table--hoverable va-table--striped"
    style="width: 100%"
  >
    <thead>
      <tr>
        <th>Type</th>
        <th>Contract ID</th>
        <th>System contract</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="operation in operations" :key="operation">
        <td>{{ Object.keys(operation)[0] }}</td>
        <td>
          <router-link
            :to="
              walletLink(
                decodeAddress(operation[Object.keys(operation)[0]].contract_id),
              )
            "
          >
            {{ decodeAddress(operation?.set_system_contract?.contract_id) }}
          </router-link>
        </td>
        <td>{{ operation[Object.keys(operation)[0]].system_contract }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts">
import { utils } from 'koilib';

export default {
  props: {
    operations: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    walletLink: (address: string) => `/address/${address}`,
    decodeAddress: (address: string) =>
      utils.encodeBase58(utils.decodeBase64url(address)),
  },
};
</script>

<style scoped>
table {
  margin-top: 3rem;
}
</style>
