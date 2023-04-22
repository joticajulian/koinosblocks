<template>
  <div class="row">
    <div class="offset--sm row ma-3" style="width: 100%">
      <MarketcapInfo />
    </div>
  </div>
  <div class="row">
    <div class="offset--sm row ma-3 search-bar">
      <SearchBar />
    </div>
  </div>
  <div class="row">
    <div class="offset--sm row ma-3">
      <HeadBlock />
    </div>
  </div>
  <div class="row">
    <div class="offset--sm row ma-3">
      <RecentBlocks />
    </div>
  </div>
</template>

<script>
import RecentBlocks from '../components/block/RecentBlocks.vue';
import HeadBlock from '../components/block/HeadBlock.vue';
import SearchBar from '../components/layout/SearchBar.vue';
import MarketcapInfo from '../components/common/MarketcapInfo.vue';
export default {
  components: { MarketcapInfo, SearchBar, HeadBlock, RecentBlocks },
};
</script>

<style scoped>
.search-bar {
  justify-content: center;
}
</style>
