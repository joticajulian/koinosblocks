<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3">
      <va-card-title>Operations</va-card-title>
      <va-card-content>
        <table
          class="va-table va-table--hoverable va-table--striped"
          style="width: 100%"
        >
          <thead>
            <tr>
              <th>Type</th>
              <th>Contract</th>
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
        <RawData :data="operations" />
      </va-card-content>
    </va-card>
  </va-inner-loading>
</template>

<script lang="ts">
import RawData from '../common/RawData.vue';
import OperationRow from './OperationRow.vue';
export default {
  components: { OperationRow, RawData },
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
};
</script>
