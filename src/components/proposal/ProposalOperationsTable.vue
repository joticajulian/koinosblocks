<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3">
      <va-card-title>Operations</va-card-title>
      <va-card-content>
        <SetSystemCallTable
          :operations="setSystemCallOperations()"
          :loading="loading"
        />
        <SetSystemContractTable
          :loading="loading"
          :operations="setSystemContractOperations()"
        />
      </va-card-content>
    </va-card>
  </va-inner-loading>
</template>
<script lang="ts">
import SetSystemContractTable from './SetSystemContractTable.vue';
import SetSystemCallTable from './SetSystemCallTable.vue';
export default {
  components: { SetSystemContractTable, SetSystemCallTable },
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
    };
  },
};
</script>

<style scoped>
table {
  margin-top: 3rem;
}
</style>
