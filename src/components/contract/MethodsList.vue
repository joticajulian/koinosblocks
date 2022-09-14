<template>
  <SingleMethod v-for="method in listOfMethods" :name="method.name" :details="method.details" :protos="protos"/>
</template>

<script lang="ts">
import SingleMethod from "./SingleMethod.vue";
import {computed, unref} from "vue";

export default {
  components: {SingleMethod},
  props: {
    methods: {
      type: Object,
      required: true
    },
    protos: {
      type: Array,
      required: true
    }
  },

  setup(props: any) {
    const listOfMethods = computed(() => {
      const keys = Object.keys(unref(props.methods));
      return keys.map((key) => ({name: key, details: props.methods[key]}));
    });

    return {
      listOfMethods
    }
  }
}
</script>
