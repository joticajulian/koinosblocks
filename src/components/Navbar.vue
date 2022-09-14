<template>
  <va-navbar color="#cccccc">
    <template #left>
      <va-navbar-item>
        <router-link to="/">koinosblocks</router-link>
      </va-navbar-item>
    </template>
<!--    <template #center>-->
<!--      <va-navbar-item>Center</va-navbar-item>-->
<!--    </template>-->
<!--    <template #right>-->
<!--      <va-navbar-item>Right</va-navbar-item>-->
<!--    </template>-->
  </va-navbar>
</template>

<script>
export default {
  name: 'Navbar',
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
