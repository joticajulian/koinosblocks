<template>
  <dd class="line" v-if="!link">{{ text }}</dd>
  <dd class="line" v-if="link">
    <router-link :to="link">{{ text }}</router-link>
  </dd>
</template>

<script lang="ts">
export default {
  props: {
    link: {
      type: String,
      required: false
    },
    text: {
      type: String,
      required: true
    }
  }
}
</script>
