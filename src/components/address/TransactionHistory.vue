<template>
  <va-inner-loading v-if="transactions.length" :loading="loading">
    <va-card class="offset--sm row ma-3">
      <va-card-title>Account history</va-card-title>
      <va-card-content>
        <div class="row">
          <div style="height: 400px" class="flex md12 lg12">
            <va-infinite-scroll :load="fetchTransactions">
              <TransactionHistoryRow
                v-for="row in transactions"
                :key="row.id"
                :row="row"
                :address="address"
              />
            </va-infinite-scroll>
          </div>
        </div>
        <RawData :data="transactions" />
      </va-card-content>
    </va-card>
  </va-inner-loading>
</template>

<script lang="ts">
import { useClient } from '../../composable/useClient.js';
import { ref } from 'vue';
import RawData from '../common/RawData.vue';
import TransactionHistoryRow from './TransactionHistoryRow.vue';

export default {
  name: 'TransactionHistory',
  components: { TransactionHistoryRow, RawData },
  props: {
    address: {
      type: String,
      required: true,
    },
  },

  setup(props: any) {
    const loading = ref(true);
    const transactions = ref<any>([]);
    const seq_num = ref<number | null>(null);
    const fetchTransactions = async () => {
      try {
        console.log(' seq_num.value ', seq_num.value);
        if (seq_num.value === null || seq_num.value > 0) {
          const { client } = useClient();
          const { values } = await client.call(
            'account_history',
            'get_account_history',
            {
              address: props.address,
              seq_num: seq_num.value,
              limit: 30,
              ascending: false,
              irreversible: false,
            },
          );
          console.log(values);
          if (values[values.length - 1].seq_num - 1 >= 0) {
            console.log(
              'values[values.length - 1].seq_num - 1',
              values[values.length - 1].seq_num - 1,
            );
            seq_num.value = values[values.length - 1].seq_num - 1;
          } else {
            seq_num.value = 0;
          }
          transactions.value.push(...values);
        }
      } catch (e) {
        console.error(e);
      } finally {
        loading.value = false;
      }
    };

    fetchTransactions().then();

    return {
      loading,
      transactions,
      fetchTransactions,
    };
  },
};
</script>
