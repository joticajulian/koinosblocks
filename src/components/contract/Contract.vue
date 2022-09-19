<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3">
      <va-card-title>Contract {{ address }} details</va-card-title>
      <va-card-content>
        <SingleMethod v-for="method in methods" :key="method.name" :name="method.name" :details="method.details"
                      :protos="protos" :address="address"/>
        <Proto v-for="proto in protos" :key="proto.name" :proto="proto"/>
      </va-card-content>
    </va-card>
  </va-inner-loading>
</template>

<script lang="ts">
import MethodsList from "./MethodsList.vue";
import {computed} from "vue";
import * as koinosPbToProto from "@roamin/koinos-pb-to-proto";
import {ProtoDescriptor} from "@roamin/koinos-pb-to-proto";
import SingleMethod from "./SingleMethod.vue";
import Proto from "./Proto.vue";

interface Abi {
  methods: {
    [name: string]: MethodDetails
  },
  types: string;
}

interface MethodDetails {
  argument: string;
  return: string;
  'entry-point': string;
  description: string;
  'read-only': boolean
}

interface Method {
  name: string;
  details: MethodDetails
}

export default {
  components: {Proto, SingleMethod, MethodsList},
  props: {
    address: {
      type: String,
      required: true
    },
    abi: {
      type: Object,
      required: false
    }
  },

  setup(props: any) {

    const extractMethods = (abi: Abi | null): Method[] => {
      if (!abi) {
        return [];
      }
      return Object.keys(abi.methods).map((name) => {
        return {
          name,
          details: abi.methods[name]
        }
      })
    }

    const decodeProtos = (abi: Abi | null): ProtoDescriptor[] => {
      if (!abi) {
        return [];
      }
      return koinosPbToProto.convert(abi.types)
    };

    return {
      methods: computed(() => extractMethods(props.abi)),
      protos: computed(() => decodeProtos(props.abi))
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
</style>
