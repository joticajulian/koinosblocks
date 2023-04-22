<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3" stripe stripe-color="success">
      <va-card-title>
        <p class="mr-3">Wallet details</p>
        <a
          v-for="kap in kaps"
          v-if="kaps.length"
          class="mr-3"
          :href="kapLink(kap)"
          target="_blank"
          rel="noopener noreferrer"
        >
          <va-popover
            message="Koinos Account Protocol name owner"
            color="warning"
            class="popover"
          >
            <va-badge :text="kap" color="warning" />
          </va-popover>
        </a>
      </va-card-title>
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
  <Contract
    v-if="isContract"
    :address="address"
    :abi="meta.abi"
    :root="meta.root"
    :protos="meta.protos"
    :loading="loading"
  />
  <TransactionHistory :address="address" />
</template>

<script lang="ts">
import { computed, ref, watch } from 'vue';
import Contract from './contract/Contract.vue';
import { useToken } from '../composable/useToken';
import { ContractMeta, useContract } from '../composable/useContract';
import { useClient } from '../composable/useClient';
import TransactionHistory from './address/TransactionHistory.vue';
import { useNameService } from '../composable/useNameService';
import { useKAP } from '../composable/useKAP';

interface TokenBalance {
  amount: number;
  symbol: string;
}

export default {
  components: { TransactionHistory, Contract },
  props: {
    address: {
      type: String,
      required: true,
    },
  },

  async setup(props: any) {
    const tokens = ref<string[]>([]);
    const kaps = ref<string[]>([]);

    const meta = ref<ContractMeta>({ root: null, abi: null, protos: null });
    const loading = ref(true);
    const balances = ref<TokenBalance[]>([]);

    const { client } = useClient();
    const { createToken } = useToken();
    const { fetchContractMeta } = useContract();
    const { getSystemContractAddress } = useNameService();
    const { getKAPNames } = useKAP();

    const VAPOR_TOKEN_ADDRESS = '1KTasVrqvMBofMANKMCT3HMya16sfZPLFB';

    const getTokensAddresses = async () => {
      const customTokens = [VAPOR_TOKEN_ADDRESS];
      const names = ['koin', 'vhp'];
      const systemContractAddresses = await Promise.all(
        names.map(getSystemContractAddress),
      );
      return systemContractAddresses.concat(customTokens);
    };

    const getTokenValue = async (
      tokenContractId: string,
      address: string,
    ): Promise<void> => {
      try {
        const token = await createToken(tokenContractId);
        const precision = await token.getPrecision();
        const balance = await token.getBalance(address, true);
        const symbol = await token.getSymbol();
        const amount = Number(balance) / Math.pow(10, precision);
        balances.value.push({ amount, symbol });
      } catch (e) {
        console.error(e);
      }
    };

    const getMana = async (address: string): Promise<void> => {
      try {
        const { rc } = await client.chain.getAccountRC(address);
        if (rc) {
          balances.value.push({
            amount: Number(rc) / 10 ** 8,
            symbol: 'MANA',
          });
        }
      } catch (e) {
        console.error(e);
      }
    };

    const refreshData = async (address: string) => {
      try {
        loading.value = true;
        balances.value = [];
        meta.value = await fetchContractMeta(address);
        tokens.value = await getTokensAddresses();
        kaps.value = await getKAPNames(address);
        await getMana(address);
        await Promise.all(
          tokens.value.map(async (token) => getTokenValue(token, address)),
        );
      } finally {
        loading.value = false;
      }
    };

    watch(() => props.address, refreshData);

    setTimeout(() => refreshData(props.address), 1);

    return {
      isContract: computed(() => meta.value?.abi && meta.value?.root),
      meta,
      loading,
      balances: computed(() =>
        balances.value.sort((a, b) => a.symbol.localeCompare(b.symbol)),
      ),
      isEmpty: computed(() => !balances.value.length),
      kapLink: (kap: any) => `https://kap.plus/${kap}`,
      kaps,
    };
  },
};
</script>

<style scoped lang="scss">
a {
  --va-popover-content-font-size: 0.65rem;
}
</style>
