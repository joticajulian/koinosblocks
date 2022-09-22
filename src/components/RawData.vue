<template>
  <div class="data">
    <span class="title" @click="toggle">{{on ? "Hide" : "Show"}} raw data</span>
    <pre v-if="on">{{ JSON.stringify(data, null, 2) }}</pre>
  </div>
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
  margin: 1em 0;
}
pre {
  margin-top: 1em;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  overflow: scroll;
  max-width: 100%;
  max-height: 500px;
  white-space: pre-wrap;
}
.data {
  margin: 1em 0
}
</style>
