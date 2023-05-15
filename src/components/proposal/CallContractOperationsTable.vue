<template>
  <table
    class="va-table va-table--hoverable va-table--striped"
    style="width: 100%"
  >
    <thead>
      <tr>
        <th>Type</th>
        <th>Contract ID</th>
        <th>Entrypoint</th>
        <th>Args</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <OperationRow
        v-for="operation in operations"
        :key="operation.id"
        :operation="operation"
      />
    </tbody>
  </table>
</template>
<script lang="ts">
import { utils } from 'koilib';
import OperationRow from '../transaction/OperationRow.vue';

export default {
  components: { OperationRow },
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
      utils.encodeBase58(utils.decodeBase64(address)),
  },
};
</script>

<style scoped>
table {
  margin-top: 3rem;
}
</style>
