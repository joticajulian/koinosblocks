<template>
  <dl>
    <dt>{{ description }}</dt>
    <dd>
      <Link v-for="line in lines" :link="line.link" :text="line.text" />
    </dd>
  </dl>
</template>

<script lang="ts">
import { computed } from 'vue';
import RichLink from './RichLink.vue';

export interface LinkedRow {
  text: string;
  link?: string;
}

export default {
  name: 'DescriptionRow',
  components: { Link: RichLink },
  props: {
    description: {
      type: String,
      required: true,
    },
    data: {
      type: [String, Number, Array<LinkedRow>],
      required: true,
    },
  },

  setup(props: any) {
    const lines = computed((): LinkedRow[] => {
      if (Array.isArray(props.data)) {
        return props.data;
      } else {
        return [{ text: props.data.toString() }];
      }
    });

    return {
      lines,
    };
  },
};
</script>

<style scoped>
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
  margin: 0.75em 0;
}
</style>
