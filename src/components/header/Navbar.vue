<template>
  <va-navbar color="#cccccc">
    <template #left>
      <va-navbar-item>
        <router-link to="/"><h1>koinosblocks</h1></router-link>
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
a {
  color: #34495e;
}

a:hover {
  text-decoration: underline;
}
</style>
