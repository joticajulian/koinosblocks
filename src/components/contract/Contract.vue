<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3" stripe stripe-color="info">
      <va-card-title>Contract {{ address }} details</va-card-title>
      <va-card-content>
        <div class="text--right">
          <va-button @click="requestAccounts()">Connect Kondor</va-button>
        </div>
        <AuthorizedAccounts :accounts="accounts"/>
        <h1 v-if="readOnlyMethods.length">Read only methods</h1>
        <SingleMethod v-for="method in readOnlyMethods" :key="method.name" :name="method.name" :details="method.details"
                      :protos="protos" :address="address" :abi="abis"
                      :signers="authorizedSigners"/>
        <h1 v-if="writableMethods.length" class="mt-2">Writable methods</h1>
        <SingleMethod v-for="method in writableMethods" :key="method.name" :name="method.name" :details="method.details"
                      :protos="protos" :address="address" :abi="abis"
                      :signers="authorizedSigners"/>
        <br/>
        <h1>Proto files</h1>
        <Proto v-for="proto in protos" :key="proto.name" :proto="proto"/>
      </va-card-content>
    </va-card>
  </va-inner-loading>
</template>

<script lang="ts">
import {computed, ref} from "vue";
import * as koinosPbToProto from "@roamin/koinos-pb-to-proto";
import {ProtoDescriptor} from "@roamin/koinos-pb-to-proto";
import SingleMethod from "./SingleMethod.vue";
import Proto from "./Proto.vue";
import {useKondor} from "../../composable/useKondor";
import AuthorizedAccounts from "./components/AuthorizedAccounts.vue";


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
  components: {AuthorizedAccounts, Proto, SingleMethod},
  props: {
    address: {
      type: String,
      required: true
    },
    abi: {
      type: Object,
      required: false
    },
    loading: {
      type: Boolean,
      required: true
    }
  },

  setup(props: any) {

    const {accounts, requestAccounts} = useKondor();

    const authorizedSigners = computed(() => {
      return accounts.value.map(account => account.address);
    });

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
      console.log('abi', abi);
      if (!abi) {
        return [];
      }
      return koinosPbToProto.convert(abi.types)
    };

    return {
      methods: computed(() => extractMethods(props.abi)),
      readOnlyMethods: computed(() => extractMethods(props.abi).filter((method: Method) => method.details['read-only'])),
      writableMethods: computed(() => extractMethods(props.abi).filter((method: Method) => !method.details['read-only'])),
      protos: computed(() => decodeProtos(props.abi)),
      accounts,
      authorizedSigners,
      requestAccounts,
      abis: props.abi
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

pre {
  overflow: scroll;
  max-width: 100%;
  max-height: 500px;
}
</style>
