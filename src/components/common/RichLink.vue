<template>
  <dd v-if="!link" class="line">
    {{ text }}
  </dd>
  <dd v-if="link" class="line">
    <router-link :to="link">
      {{ text }}
    </router-link>
  </dd>
</template>

<script lang="ts">
export default {
  props: {
    link: {
      type: String,
      required: false,
    },
    text: {
      type: String,
      required: true,
    },
  },
};
</script>
