<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3" stripe stripe-color="success">
      <va-card-title>Wallet {{ address }} details</va-card-title>
      <va-card-content>
        Wallet details incoming
      </va-card-content>
    </va-card>
  </va-inner-loading>
  <Contract v-if="isContract" :address="address" :abi="abi" :loading="loading"/>
</template>

<script lang="ts">
import {computed, Ref, ref, watch} from 'vue'
import TransactionsTable from "./transaction/TransactionsTable.vue";
import EventsTable from "./transaction/EventsTable.vue";
import {Methods} from "../types/Method";``
import * as koinosPbToProto from "@roamin/koinos-pb-to-proto";
import Contract from "./contract/Contract.vue";
import {useClient} from "../composable/useClient";

export default {
  components: {Contract, EventsTable, TransactionsTable},
  props: {
    address: {
      type: String,
      required: true
    }
  },

  async setup(props: any) {

    const meta: Ref<any | null> = ref(null);
    const protos: Ref<koinosPbToProto.ProtoDescriptor[] | null> = ref(null)
    const loading = ref(true);

    const {client} = useClient();

    const getContractMeta = async (address: string) => {
      loading.value = true;
      meta.value = null;
      try {
        const {meta: receivedMeta} = await client.contractMetaStore.getContractMeta(address);

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

    watch(() => props.address, (address) => {
      getContractMeta(address).then(() => {
        console.log("done");
      }).catch((e) => {
        console.error(e);
      });
    });

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
