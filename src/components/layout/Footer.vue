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
        <template #right>
          <va-navbar-item>
            <a href="https://gitlab.com/engrave/koinos/koinosblocks" target="_blank" rel="noopener noreferrer">
              <img :src="gitlab" />
            </a>

          </va-navbar-item>
        </template>
  </va-navbar>
</template>

<script>
import gitlab from '/icons/gitlab.svg'
export default {
  name: 'Footer',
  data() {
    return {
      gitlab
    }
  }
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
