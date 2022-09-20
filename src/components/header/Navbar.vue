<template>
  <va-navbar color="#ffffff">
    <template #left>
      <va-navbar-item>
        <router-link to="/">
          <img src="/koinosblocks.png" id="logo" alt="koinosblocks Logo"/>
        </router-link>
      </va-navbar-item>
    </template>
    <!--    <template #center>-->
    <!--      <va-navbar-item>Center</va-navbar-item>-->
    <!--    </template>-->
    <template #right>
      <va-navbar-item>
        <ApiInput/>
      </va-navbar-item>
    </template>
  </va-navbar>
</template>

<script>
import ApiInput from "./ApiInput.vue";

export default {
  name: 'Navbar',
  components: {ApiInput},
};
</script>

<style scoped>
#logo {
  max-width: 150px;
}
</style>
