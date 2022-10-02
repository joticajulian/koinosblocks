<template>
  <div class="row">
    <div class="offset--sm row ma-3" style="width: 100%;">
      <Suspense>
        <SearchBar />
      </Suspense>
    </div>
  </div>
  <div class="row">
    <div class="offset--sm row ma-3" style="width: 100%;">
      <Suspense>
        <HeadBlock />
      </Suspense>
    </div>
  </div>
  <div class="row">
    <div class="offset--sm row ma-3" style="width: 100%;">
      <Suspense>
        <RecentBlocks />
      </Suspense>
    </div>
  </div>
</template>

<script>
import RecentBlocks from "../components/block/RecentBlocks.vue";
import Navbar from "../components/layout/Navbar.vue";
import HeadBlock from "../components/block/HeadBlock.vue";
import SearchBar from "../components/layout/SearchBar.vue";
export default {
  components: {SearchBar, HeadBlock, Navbar, RecentBlocks},
}

</script>
