<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3" stripe stripe-color="success">
      <va-card-title>Wallet {{ address }} details</va-card-title>
      <va-card-content>
        <ul v-if="!isEmpty">
          <li v-for="balance in balances">
            <span>{{ balance.amount }} {{ balance.symbol }}</span>
          </li>
        </ul>
        <p v-if="isEmpty && !loading">This wallet is empty</p>
      </va-card-content>
    </va-card>
  </va-inner-loading>
  <Contract v-if="isContract" :address="address" :abi="meta.abi" :root="meta.root" :protos="meta.protos"
            :loading="loading"/>
</template>

<script lang="ts">
import {computed, ref, watch} from 'vue'
import TransactionsTable from "./transaction/TransactionsTable.vue";
import EventsTable from "./transaction/EventsTable.vue";
import Contract from "./contract/Contract.vue";
import {useToken} from "../composable/useToken";
import {ContractMeta, useContract} from "../composable/useContract";
import {useClient} from "../composable/useClient";

interface TokenBalance {
  amount: number,
  symbol: string
}

export default {
  components: {Contract, EventsTable, TransactionsTable},
  props: {
    address: {
      type: String,
      required: true
    }
  },

  async setup(props: any) {

    const tokens = ['15DJN4a8SgrbGhhGksSBASiSYjGnMU8dGL', '1AdzuXSpC6K9qtXdCBgD5NUpDNwHjMgrc9']

    const meta = ref<ContractMeta>({root: null, abi: null, protos: null});
    const loading = ref(true);
    const balances = ref<TokenBalance[]>([]);

    const {client} = useClient();
    const {createToken} = useToken();
    const {fetchContractMeta} = useContract();

    const getTokenValue = async (contractId: string, address: string): Promise<void> => {
      try {
        const token = await createToken(contractId)
        const precision = await token.getPrecision()
        const balance = await token.getBalance(address, true)
        const symbol = await token.getSymbol()
        const amount = Number(balance) / Math.pow(10, precision)
        balances.value.push({amount, symbol})
      } catch (e) {
        console.error(e)
      }
    };


    const getMana = async (address: string): Promise<void> => {
      try {
        const {rc} = await client.chain.getAccountRC(address);
        if (rc) {
          balances.value.push({
            amount: Number(rc) / 10 ** 8,
            symbol: 'MANA'
          });
        }
      } catch (e) {
        console.error(e)
      }
    }

    const refreshData = async (address: string) => {
      try {
        loading.value = true;
        balances.value = [];
        meta.value = await fetchContractMeta(address);
        await getMana(address);
        await Promise.all(tokens.map(async (token) => getTokenValue(token, address)));
      } finally {
        loading.value = false;
      }
    }

    watch(() => props.address, refreshData);

    setTimeout(() => refreshData(props.address), 1);

    return {
      isContract: computed(() => meta.value?.abi && meta.value?.root),
      meta,
      loading,
      balances: computed(() => balances.value.sort((a, b) => a.symbol.localeCompare(b.symbol))),
      isEmpty: computed(() => !balances.value.length)
    }
  }
}

</script>
