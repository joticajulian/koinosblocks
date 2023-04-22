<template>
  <div class="row">
    <div class="flex" style="width: 100%">
      <Suspense>
        <SingleAddress :address="address" />
      </Suspense>
    </div>
  </div>
</template>

<script lang="ts">
import { useRoute } from 'vue-router';
import SingleAddress from '../components/SingleAddress.vue';
import { ref, watch } from 'vue';

export default {
  name: 'AddressPage',
  components: { SingleAddress },
  setup() {
    const route = useRoute();
    const address = ref(route.params.address);

    watch(route, (route) => {
      address.value = route.params.address;
    });

    return {
      address,
    };
  },
};
</script>
