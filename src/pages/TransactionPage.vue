<template>
  <div class="row">
    <div class="flex" style="width: 100%">
      <Suspense>
        <SingleTransaction :tx-id="transactionId" />
      </Suspense>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';
import SingleTransaction from '../components/SingleTransaction.vue';

export default {
  name: 'TransactionPage',
  components: { SingleTransaction },
  setup() {
    const route = useRoute();
    return {
      transactionId: route.params.id,
    };
  },
};
</script>
