<template>
  <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap" rel="stylesheet">
  <div id="main">
    <Navbar />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Navbar from "./components/layout/Navbar.vue";
import Footer from "./components/layout/Footer.vue";
export default {
  components: {Footer, Navbar},
}

</script>

<style scoped>
#main {
  margin: 0 auto;
  max-width: 1400px;
}
</style>
