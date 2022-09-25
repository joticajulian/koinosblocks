<template>
  <div class="text--right mt-3" v-if="accounts.length">
    <p><strong>Authorized accounts:</strong></p>
    <ul>
      <li v-for="account in accounts">
        {{ account.name }} - <router-link :to="toAddressLink(account.address)">{{ account.address }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">

export default {
  name: 'AuthorizedAccounts',
  props: {
    accounts: {
      type: Array,
      required: true
    }
  },
  setup() {
    return {
      toAddressLink: (address: string) => `/address/${address}`
    }
  }
}
</script>

<style scoped>
</style>
