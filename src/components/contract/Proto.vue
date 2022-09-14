<template>
  <pre class="filename">{{proto.file}}</pre>
  <pre class="code-snippet scrollable">{{proto.definition}}</pre>
  <pre></pre>
</template>

<script>

export default {
  props: {
    proto: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

.scrollable {
  max-height: 340px;
  overflow-y: scroll;
}
.filename {
  margin-bottom: 5px;
  margin-top: 20px;
}

</style>
