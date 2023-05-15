<template>
  <table
    class="va-table va-table--hoverable va-table--striped"
    style="width: 100%"
  >
    <thead>
      <tr>
        <th>Type</th>
        <th>Call ID</th>
        <th>Contract ID</th>
        <th>Entry point</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="operation in operations" :key="operation">
        <td>{{ Object.keys(operation)[0] }}</td>
        <td>
          {{ operation?.set_system_call?.call_id }}
        </td>
        <td>
          <router-link
            :to="
              walletLink(
                decodeAddress(
                  operation?.set_system_call?.target?.system_call_bundle
                    ?.contract_id,
                ),
              )
            "
          >
            {{
              decodeAddress(
                operation?.set_system_call?.target?.system_call_bundle
                  ?.contract_id,
              )
            }}
          </router-link>
        </td>
        <td>
          {{
            operation?.set_system_call?.target?.system_call_bundle?.entry_point
          }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts">
import { utils } from 'koilib';
export default {
  props: {
    operations: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    walletLink: (address: string) => `/address/${address}`,
    decodeAddress: (address: string) => utils.decodeBase64url(address),
  },
};

/**
 * TODO handle case without call_bundle
 *    oneof target {
 *       uint32 thunk_id = 1;
 *       contract_call_bundle system_call_bundle = 2;
 *    }
 *
 * */
</script>

<style scoped>
table {
  margin-top: 3rem;
}
</style>
