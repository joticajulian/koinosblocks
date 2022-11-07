<template>
  <link
    href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap"
    rel="stylesheet"
  />
  <div id="main">
    <Navbar />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Navbar from "./components/layout/Navbar.vue"
import Footer from "./components/layout/Footer.vue"
export default {
  components: { Footer, Navbar },
}
</script>

<style>
@import "assets/global.css";

#main {
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
}
</style>
