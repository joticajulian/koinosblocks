<template>
<!--  <div class="row">-->
<!--    <div class="offset&#45;&#45;sm row ma-3" style="width: 100%;">-->
<!--      <MarketcapInfo />-->
<!--    </div>-->
<!--  </div>-->
  <div class="row">
    <div class="offset--sm row ma-3" style="width: 100%;">
      <SearchBar />
    </div>
  </div>
  <div class="row">
    <div class="offset--sm row ma-3" style="width: 100%;">
      <HeadBlock />
    </div>
  </div>
  <div class="row">
    <div class="offset--sm row ma-3" style="width: 100%;">
      <RecentBlocks />
    </div>
  </div>
</template>

<script>
import RecentBlocks from "../components/block/RecentBlocks.vue";
import Navbar from "../components/layout/Navbar.vue";
import HeadBlock from "../components/block/HeadBlock.vue";
import SearchBar from "../components/layout/SearchBar.vue";
import MarketcapInfo from "../components/common/MarketcapInfo.vue";
export default {
  components: {MarketcapInfo, SearchBar, HeadBlock, Navbar, RecentBlocks},
}

</script>
