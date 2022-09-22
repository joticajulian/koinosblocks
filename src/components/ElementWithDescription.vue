<template>
  <dl>
    <dt>{{ element }}</dt>
    <dd v-if="!link">{{ description }}</dd>
    <dd v-if="link"><router-link :to="link">{{description}}</router-link></dd>
  </dl>
</template>
<script>
export default {
  name: 'ElementWithDescription',
  props: {
    description: {
      type: String,
      required: true
    },
    element: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: false
    }
  }
}
</script>

<style scoped>

a {
  color: #34495e;
}

a:hover {
  text-decoration: underline;
}

dt {
  font-weight: bold;
  margin-bottom: 0;
  min-width: 20%;
  overflow-wrap: anywhere;
}

dd {
  margin-top: 0;
  overflow-wrap: anywhere;
}


dl {
  display: flex;
  flex-direction: row;
  margin: 0.75em 0
}
</style>
