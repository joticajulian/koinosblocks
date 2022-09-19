<template>
  <div class="row">
    <div class="flex" style="width: 100%;">
      <Suspense>
        <SingleAddress :address="address" />
      </Suspense>
    </div>
  </div>
</template>

<script lang="ts">
import {useRoute} from 'vue-router'
import SingleTransaction from "../components/SingleTransaction.vue";
import SingleAddress from "../components/SingleAddress.vue";
import {ref} from "vue";

export default {
  name: 'Address',
  components: {SingleAddress, SingleTransaction},
  setup() {
    const route = useRoute();

    const address = ref(route.params.address);

    return {
      address
    }

  }
};

</script>
