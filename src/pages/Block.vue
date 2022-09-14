<template>
  <Suspense>
    <SingleBlock :client="client" :height="block" />
  </Suspense>
</template>

<script>
import {useRoute} from 'vue-router'
import {ref} from "vue";
import SingleBlock from "../components/SingleBlock.vue";
import {Client} from "koinos-rpc";

export default {
  name: 'Block',
  components: {SingleBlock},
  data() {
    return {
      client: new Client(["https://api.koinosblocks.com"])
    }
  },
  setup() {
    const route = useRoute();

    const block = ref(Number(route.params.height));

    return {
      block
    }

  }
};

</script>
