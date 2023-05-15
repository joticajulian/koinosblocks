<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3">
      <va-card-title>Operations</va-card-title>
      <va-card-content>
        <SetSystemCallTable
          v-if="setSystemCallOperations().length > 0"
          :operations="setSystemCallOperations()"
          :loading="loading"
        />
        <SetSystemContractTable
          v-if="setSystemContractOperations().length > 0"
          :loading="loading"
          :operations="setSystemContractOperations()"
        />
        <CallContractOperationsTable
          v-if="callContractsOperations().length > 0"
          :loading="loading"
          :operations="callContractsOperations()"
        />
      </va-card-content>
    </va-card>
  </va-inner-loading>
</template>
<script lang="ts">
import SetSystemContractTable from './SetSystemContractTable.vue';
import SetSystemCallTable from './SetSystemCallTable.vue';
import CallContractOperationsTable from './CallContractOperationsTable.vue';
import { utils } from 'koilib';
export default {
  components: {
    CallContractOperationsTable,
    SetSystemContractTable,
    SetSystemCallTable,
  },
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
  setup(props: any) {
    return {
      setSystemCallOperations: () =>
        props.operations.filter((operation: any) => operation.set_system_call),
      setSystemContractOperations: () =>
        props.operations.filter(
          (operation: any) => operation.set_system_contract,
        ),
      callContractsOperations: () => {
        const filtered = props.operations.filter(
          (operation: any) => operation.call_contract,
        );
        return filtered.map((operation) => {
          return {
            call_contract: {
              ...operation.call_contract,
              contract_id: utils.encodeBase58(
                utils.decodeBase64(operation.call_contract.contract_id),
              ),
            },
          };
        });
      },
    };
  },
};
</script>

<style scoped>
table {
  margin-top: 3rem;
}
</style>
