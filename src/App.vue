<template>
  <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap" rel="stylesheet">
  <Navbar />
  <router-view />
</template>

<script>
import {Client} from "koinos-rpc";
import Navbar from "./components/Navbar.vue";
export default {
  components: {Navbar},
  data() {
    return {
      client: new Client(["https://api.koinosblocks.com"])
    }
  }
}

</script>
