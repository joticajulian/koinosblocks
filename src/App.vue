<template>
  <link
    href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap"
    rel="stylesheet"
  />
  <div id="main">
    <NavigationBar />
    <router-view />
    <FooterBar />
  </div>
</template>

<script>
import NavigationBar from './components/layout/NavigationBar.vue';
import FooterBar from './components/layout/FooterBar.vue';
export default {
  components: { FooterBar, NavigationBar },
};
</script>

<style>
@import 'assets/global.css';

#main {
  margin: 0 auto;
  max-width: 1400px;
}
</style>
