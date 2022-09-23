<template>
  <va-navbar color="#ffffff">
    <template #left>
      <va-navbar-item>
        <div class="dev">
        <span class="developed-by">Developed by</span>
        <a href="https://engrave.dev">
          <img src="/engrave-logo.svg" />
        </a>
        </div>
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
  name: 'Footer',
};
</script>

<style scoped>
a {
  color: #34495e;
}

a:hover {
  text-decoration: underline;
}

.developed-by {
  margin: 0px;
  padding: 0px;
  font-size: 0.625rem;
  font-weight: 500;
  font-family: Inter, sans-serif;
  text-transform: uppercase;
}

.dev {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  gap: 8px;
}

</style>
