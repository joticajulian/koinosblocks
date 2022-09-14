<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3">
      <va-card-title>Wallet {{ address }} details</va-card-title>
      <va-card-content>
        Wallet details incoming
      </va-card-content>
    </va-card>
  </va-inner-loading>
  <Contract v-if="isContract" :client="client" :address="address" :abi="abi"/>
</template>

<script lang="ts">
import {computed, Ref, ref} from 'vue'
import {Client} from "koinos-rpc";
import TransactionsTable from "./TransactionsTable.vue";
import EventsTable from "./EventsTable.vue";
import {Methods} from "../types/Method";
import MethodsList from "./contract/MethodsList.vue";
import * as koinosPbToProto from "@roamin/koinos-pb-to-proto";
import Contract from "./contract/Contract.vue";

export default {
  components: {Contract, MethodsList, EventsTable, TransactionsTable},
  props: {
    client: {
      type: Client,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },

  async setup(props: any) {

    let meta: Ref<any | null> = ref(null);
    let protos: Ref<koinosPbToProto.ProtoDescriptor[] | null> = ref(null)
    const loading = ref(true);

    const getContractMeta = async (address: string) => {
      try {
        const {meta: receivedMeta} = await props.client.contractMetaStore.getContractMeta(address);

        if (!receivedMeta) {
          return;
        }

        meta.value = receivedMeta;
        try {
          const abi = JSON.parse(receivedMeta.abi);
          protos.value = koinosPbToProto.convert(abi.types);
        } catch (e) {
          console.error(e);
        }
      } catch (e) {
        console.error(e);
      } finally {
        loading.value = false;
      }
    }

    getContractMeta(props.address).then(() => {
      console.log("done");
    }).catch((e) => {
      console.error(e);
    });


    const methods = computed((): Methods | undefined => {
      if (!meta.value) {
        return {};
      }
      // @ts-ignore
      return JSON.parse(meta.value.abi).methods;
    });

    return {
      isContract: computed(() => meta.value),
      meta,
      // @ts-ignore
      abi: computed(() => {
        if (!meta.value?.abi) {
          return null;
        }
        try {
          return JSON.parse(meta.value.abi);
        } catch (e) {
          console.error(e);
          return null;
        }
      }),
      protos,
      methods,
      loading,
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
