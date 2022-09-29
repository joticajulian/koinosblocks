<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3" stripe stripe-color="success">
      <va-card-title>Wallet {{ address }} details</va-card-title>
      <va-card-content>
        <ul v-if="balances.length">
          <li v-for="balance in balances">
            <span>{{ balance.amount }} {{balance.symbol}}</span>
          </li>
        </ul>
      </va-card-content>
    </va-card>
  </va-inner-loading>
  <Contract v-if="isContract" :address="address" :abi="meta.abi" :root="meta.root" :protos="meta.protos" :loading="loading"/>
</template>

<script lang="ts">
import {computed, ref, watch} from 'vue'
import TransactionsTable from "./transaction/TransactionsTable.vue";
import EventsTable from "./transaction/EventsTable.vue";
import Contract from "./contract/Contract.vue";
import {useToken} from "../composable/useToken";
import {ContractMeta, useContract} from "../composable/useContract";

export default {
  components: {Contract, EventsTable, TransactionsTable},
  props: {
    address: {
      type: String,
      required: true
    }
  },

  async setup(props: any) {

    const tokens = ['19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ', '1JZqj7dDrK5LzvdJgufYBJNUFo88xBoWC8']

    const meta = ref<ContractMeta>({root: null, abi: null});
    const loading = ref(true);
    const balances = ref<{amount: number, symbol: string}[]>([]);

    const {createToken} = useToken();
    const {fetchContractMeta} = useContract();

    const getTokenValue = async (contractId: string, address: string) => {
      try {
        const koin = await createToken(contractId)
        const precision = await koin.getPrecision()
        const balance = await koin.getBalance(address, true)
        const symbol = await koin.getSymbol()
        const amount = Number(balance) / Math.pow(10, precision)
        balances.value.push({amount, symbol})
      } catch (e) {
        console.error(e)
      }
    };

    const refreshData = async (address: string) => {
      try {
        loading.value = true;
        balances.value = [];
        meta.value = await fetchContractMeta(address);
        await Promise.all(tokens.map(async (token) => getTokenValue(token, address)));
      } finally {
        loading.value = false;
      }
    }

    watch(() => props.address, refreshData);

    setTimeout(() => refreshData(props.address),1);

    return {
      isContract: computed(() => meta.value?.abi && meta.value?.root),
      meta,
      loading,
      balances: computed(() => balances.value.sort((a, b) => a.symbol.localeCompare(b.symbol)))
    }
  }
}

</script>
