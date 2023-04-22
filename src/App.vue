<template>
  <link
    href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap"
    rel="stylesheet"
  />
  <div id="main">
    <NavigationBar />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import NavigationBar from './components/layout/NavigationBar.vue';
import Footer from './components/layout/Footer.vue';
export default {
  components: { Footer, NavigationBar },
};
</script>

<style>
@import 'assets/global.css';

#main {
  margin: 0 auto;
  max-width: 1400px;
}
</style>
