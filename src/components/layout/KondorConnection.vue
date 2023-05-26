<template>
  <va-button v-if="accounts.length == 0" size="medium" @click="requestAccounts">
    Connect Kondor
  </va-button>
  <va-button-dropdown v-else size="medium" :label="authorizedAccount">
    <va-list>
      <va-list-item
        class="item"
        v-for="account in accounts"
        :key="account.address"
        :to="toAddressLink(account.address)"
      >
        <va-list-item-section>
          <va-list-item-label>
            {{ account.name }}
          </va-list-item-label>
          <va-list-item-label caption>
            {{ account.address }}
          </va-list-item-label>
        </va-list-item-section>
      </va-list-item>
      <va-list-item class="item logout">
        <va-button
          preset="secondary"
          border-color="primary"
          class="mr-6 mb-2"
          @click="logout"
        >
          Logout
        </va-button>
      </va-list-item>
    </va-list>
  </va-button-dropdown>
</template>

<script setup lang="ts">
import { useKondor } from '../../composable/useKondor';
import { computed } from 'vue';
const { accounts, requestAccounts, logout } = useKondor();

const toAddressLink = (address: string) => `/address/${address}`;
const authorizedAccount = computed(() => {
  const account = accounts.value[0];
  if (!account) return '';
  return `${account.address.slice(0, 5)}...${account.address.slice(-5)}`;
});
</script>

<style scoped>
.item {
  margin-top: 10px;
}
</style>
