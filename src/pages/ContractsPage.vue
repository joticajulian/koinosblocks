<template>
  <Suspense>
    <SystemContractsTable />
  </Suspense>
</template>

<script>
import SystemContractsTable from '../components/SystemContractsTable.vue';
export default {
  name: 'ContractsPage',
  components: { SystemContractsTable },
  setup() {
    return {
      id: 1,
    };
  },
};
</script>
