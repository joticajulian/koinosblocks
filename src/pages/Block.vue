<template>
  <Suspense>
    <SingleBlock :id="id" />
  </Suspense>
</template>

<script>
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import SingleBlock from '../components/SingleBlock.vue';

export default {
  name: 'Block',
  components: { SingleBlock },
  setup() {
    const route = useRoute();
    const id = ref(route.params.id);

    watch(route, (route) => {
      id.value = route.params.id;
    });

    return {
      id,
    };
  },
};
</script>
