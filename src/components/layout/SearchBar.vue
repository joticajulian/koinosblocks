<template>
  <div class="search-bar">
    <va-input
      v-model="input"
      :loading="loading"
      class="search"
      placeholder="Search by block, transaction, address, KAP or @nickname"
      :error="error"
      :error-messages="errorMessage"
      @keyup.enter="search()"
    >
      <template #prependInner>
        <va-icon name="search" />
      </template>
    </va-input>
    <va-button size="medium" @click="search()"> Search </va-button>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useClient } from '../../composable/useClient';
import { utils } from 'koilib';
import { useKAP } from '../../composable/useKAP';
import { useNicknames } from '../../composable/useNicknames';

export default {
  setup() {
    const input = ref('');
    const error = ref(false);
    const errorMessage = ref('');
    const loading = ref(false);
    const { client } = useClient();
    const { getKAPOwnerAddress } = useKAP();
    const { getNicknameOwner } = useNicknames();

    const isTransactionId = (input: string) => {
      if (!input.startsWith('0x1220') || input.length !== 70) {
        return false;
      }
      const regexp = /0x[0-9A-Fa-f]{68}/g;
      return regexp.test(input);
    };

    const isAddress = (input: string) => {
      if (input.length < 26 || input.length > 35) {
        return false;
      }

      try {
        utils.decodeBase58(input);
        return true;
      } catch (e) {
        return false;
      }
    };

    const blockExists = async () => {
      try {
        const { block_items } = await client.blockStore.getBlocksById([
          input.value,
        ]);
        if (block_items.length > 0 && block_items[0].block_id) {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    };

    const transactionExist = async () => {
      try {
        const { transactions } =
          await client.transactionStore.getTransactionsById([input.value]);
        return transactions && transactions.length > 0;
      } catch (e) {
        return false;
      }
    };

    const KAPExists = async (address: string): string | undefined => {
      try {
        return await getKAPOwnerAddress(address);
      } catch (e) {
        return;
      }
    };

    const nicknameExists = async (nickname: string): string | undefined => {
      try {
        return await getNicknameOwner(nickname);
      } catch (e) {
        return;
      }
    };

    const gotoLink = (type: 'block' | 'tx' | 'address', id: string): string => {
      window.location.href = `/${type}/${id}`;
    };

    const search = async () => {
      loading.value = true;
      error.value = false;
      errorMessage.value = '';
      if (isTransactionId(input.value)) {
        if (await blockExists(input.value)) {
          gotoLink('block', input.value);
        } else if (await transactionExist(input.value)) {
          gotoLink('tx', input.value);
        } else {
          error.value = true;
          errorMessage.value =
            'Could not find transaction or block with specified ID';
        }
      } else if (isAddress(input.value)) {
        gotoLink('address', input.value);
      } else if (Number(input.value).toString() === input.value) {
        try {
          const { topology } = await client.blockStore.getHighestBlock();
          const { block_items } = await client.blockStore.getBlocksByHeight(
            topology.id,
            Number(input.value),
            1,
          );
          if (block_items.length > 0 && block_items[0]?.block_id) {
            gotoLink('block', input.value);
          } else {
            errorMessage.value = 'Could not find block with specified height';
            error.value = true;
          }
        } catch (e) {
          errorMessage.value = 'Could not find block with specified height';
          error.value = true;
        }
      } else {
        const address =
          (await KAPExists(input.value)) || (await nicknameExists(input.value));
        if (address) {
          gotoLink('address', address);
        } else {
          errorMessage.value = 'Invalid input';
          error.value = true;
        }
      }
      loading.value = false;
    };

    return {
      input,
      error,
      errorMessage,
      loading,
      search,
    };
  },
};
</script>

<style scoped>
.search {
  width: 40%;
  margin-right: 10px;
}

.search-bar {
  width: 50%;
  margin: 40px 0 40px 0;
  align-content: center;
  justify-content: center;
  display: flex;
}
</style>
