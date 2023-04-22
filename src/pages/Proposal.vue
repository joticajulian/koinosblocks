<template>
  <Suspense>
    <SingleProposal :id="id" />
  </Suspense>
</template>

<script>
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import SingleProposal from '../components/SingleProposal.vue';

export default {
  name: 'Proposal',
  components: { SingleProposal },
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
