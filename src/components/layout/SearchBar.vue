<template>
  <div class="search-bar">
    <va-input
        class="search"
        placeholder="Search by block, transaction or address"
        :error="error"
        :error-messages="errorMessage"
        v-model="input">
      <template #prependInner>
        <va-icon name="search"/>
      </template>
    </va-input>
    <va-button size="medium" @click="search()">Search</va-button>
  </div>
</template>

<script lang="ts">
import {ref} from "vue";
import {useClient} from "../../composable/useClient";
import {utils} from "koilib";
import {useKAP} from "../../composable/useKAP";

export default {
  setup() {
    const input = ref("");
    const error = ref(false);
    const errorMessage = ref("");
    const {client} = useClient();
    const {getKAPOwnerAddress} = useKAP();

    const isTransactionId = (input: string) => {
      if (!input.startsWith('0x1220') || input.length !== 70) {
        return false;
      }
      const regexp = /0x[0-9A-Fa-f]{68}/g;
      return regexp.test(input);
    }

    const isAddress = (input: string) => {
      if (input.length !== 34) {
        return false;
      }

      try {
        utils.decodeBase58(input);
        return true;
      } catch (e) {
        return false;
      }
    }

    const blockExists = async (blockId: string) => {
      try {
        const {block_items} = await client.blockStore.getBlocksById([input.value]);
        if (block_items.length > 0 && block_items[0].block_id) {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    }

    const transactionExist = async (transactionId: string) => {
      try {
        const {transactions} = await client.transactionStore.getTransactionsById([input.value]);
        if (transactions && transactions.length > 0) {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    }

    const KAPExists = async (address: string): string | undefined => {
        try {
            return await getKAPOwnerAddress(address);
        } catch (e) {
            return;
        }
    }

    const gotoLink = (type: 'block' | 'tx' | 'address', id: string): string => {
      window.location.href = `/${type}/${id}`;
    }

    const search = async () => {
      error.value = false;
      errorMessage.value = "";
      if (isTransactionId(input.value)) {
        if (await blockExists(input.value)) {
          gotoLink('block', input.value);
        } else if (await transactionExist(input.value)) {
          gotoLink('tx', input.value);
        } else {
          error.value = true;
          errorMessage.value = 'Could not find transaction or block with specified ID';
        }
      } else if (isAddress(input.value)) {
        gotoLink('address', input.value);
      } else if (Number(input.value).toString() === input.value) {
        try {
          const {topology} = await client.blockStore.getHighestBlock();
          const {block_items} = await client.blockStore.getBlocksByHeight(topology.id, Number(input.value), 1);
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
          const address = await KAPExists(input.value);
          if (address) {
            gotoLink('address', address);
          } else {
              errorMessage.value = 'Invalid input';
              error.value = true;
          }
      }
    };

    return {
      input,
      error,
      errorMessage,
      search
    }
  }
}
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
