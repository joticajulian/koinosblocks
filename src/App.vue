<template>
  <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap" rel="stylesheet">
  <Navbar />
  <router-view />
</template>

<script>
import Navbar from "./components/header/Navbar.vue";
export default {
  components: {Navbar},
}

</script>
