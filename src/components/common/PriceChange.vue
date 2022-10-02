<template>
  <span v-if="this.value > 0" class="positive">({{sign}}{{formattedValue}}%)</span>
  <span v-if="this.value < 0" class="negative">({{sign}}{{formattedValue}}%)</span>
</template>
<script>
export default {
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  computed: {
    formattedValue() {
      return Math.abs(this.value).toFixed(2);
    },
    sign() {
      return this.value > 0 ? '+' : '-';
    }
  }
}
</script>
<style scoped>
.positive {
  color: #00b300;
}
.negative {
  color: #ff0000;
}
</style>
