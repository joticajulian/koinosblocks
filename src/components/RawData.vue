<template>
  <span class="title" @click="toggle">Toggle raw data</span>
  <pre v-if="on">{{ JSON.stringify(data, null, 2) }}</pre>
</template>

<script>
import {ref} from 'vue';
export default {
  name: 'RawData',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup() {
    const on = ref(false)
    const toggle = () => {
      on.value = !on.value
      console.log('toggle');
    }
    return {
      toggle,
      on
    }
  }
}
</script>

<style scoped>
.title {
  cursor: pointer;
  color: #3f51b5;
  font-weight: bold;
}
pre {
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  overflow: scroll;
}
</style>
