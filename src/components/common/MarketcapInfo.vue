<template>
  <div v-if="data">
    <p><strong>Price</strong>: ${{ data.current_price }} <PriceChange :value="data.price_change_percentage_24h" /></p>
    <p><strong>Marketcap</strong>: ${{ data.market_cap.toLocaleString() }}</p>
  </div>
</template>

<script lang="ts">
import {ref} from 'vue'
import {useInterval} from "../../composable/useInterval";
import PriceChange from "./PriceChange.vue";

export default {
  components: {PriceChange},
  setup() {
    const loading = ref(true);
    const data = ref(null);

    const {set} = useInterval();

    const getData = async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=koinos&order=market_cap_desc&per_page=100&page=1&sparkline=false');
      const [d] = await response.json();
      data.value = d;
    }

    getData();

    set(getData, 30000);

    return {
      loading,
      data
    }
  }
}
</script>
