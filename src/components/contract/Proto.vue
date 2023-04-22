<template>
  <div class="proto">
    <span class="va-title filename" @click="toggle">{{ proto.file }}</span>
    <pre v-if="visible" class="va-code-snippet scrollable">{{
      proto.definition
    }}</pre>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {
    proto: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const visible = ref(false);

    return {
      visible,
      toggle: () => {
        visible.value = !visible.value;
      },
    };
  },
};
</script>

<style scoped>
.scrollable {
  max-height: 340px;
  overflow-y: scroll;
}
.filename {
  margin: 1em 1em;
  cursor: pointer;
}

.filename:hover {
  text-decoration: underline;
}

/* add indicator if it's shown or not, depends on toggle */
.filename::after {
  content: '▼';
  float: right;
  margin-right: 10px;
}
.proto {
  margin: 1em 1em;
}
</style>
