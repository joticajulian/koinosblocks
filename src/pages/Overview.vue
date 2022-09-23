<template>
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
import RecentBlocks from "../components/RecentBlocks.vue";
import Navbar from "../components/layout/Navbar.vue";
import HeadBlock from "../components/HeadBlock.vue";
export default {
  components: {HeadBlock, Navbar, RecentBlocks},
}

</script>
