<template>
  <div class="row">
    <div class="flex" style="width: 100%;">
      <Suspense>
        <SingleTransaction :client="client" :txId="transactionId" />
      </Suspense>
    </div>
  </div>
</template>

<script>
import {useRoute} from 'vue-router'
import {Client} from "koinos-rpc";
import SingleTransaction from "../components/SingleTransaction.vue";

export default {
  name: 'Transaction',
  components: {SingleTransaction},
  data() {
    return {
      client: new Client(["https://api.koinosblocks.com"])
    }
  },
  setup() {
    const route = useRoute();
    const transactionId = route.params.id;
    return {
      transactionId
    }

  }
};

</script>
