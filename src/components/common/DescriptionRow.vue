<template>
  <dl>
    <dt>{{ description }}</dt>
    <dd>
    <template v-for="l in lines">
      <dd class="line" v-if="!l.link">{{ l.line }}</dd>
      <dd class="line" v-if="l.link">
        <router-link :to="l.link">{{l.line}}</router-link>
      </dd>
    </template>
    </dd>
  </dl>
</template>
<script lang="ts">
export default {
  name: 'DescriptionRow',
  props: {
    description: {
      type: String,
      required: true
    },
    data: {
      type: [String, Array<{line: string, link?: string}>],
      required: true
    }
  },
  computed: {
    lines: function (): {line: string, link?: string}[] {
      if (typeof this.data === 'string') {
        return [{line: this.data}];
      }
      return this.data;
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
