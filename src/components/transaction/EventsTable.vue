<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3">
      <va-card-title>Events</va-card-title>
      <va-card-content>
        <table class="va-table va-table--hoverable va-table--striped" style="width: 100%;">
          <thead>
          <tr>
            <th>Name</th>
            <th>Source</th>
            <th>Impacted</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="event in events" :key="event.id">
            <td>{{ event.name }}</td>
            <td>
              <router-link :to=toConctractLink(event.source)>{{ event.source }}</router-link>
            </td>
            <td>
              <router-link class="impacted" v-for="wallet in event.impacted" :to=toConctractLink(wallet)>{{ wallet }}</router-link>
            </td>
          </tr>
          </tbody>
        </table>
        <RawData :data="events"/>
      </va-card-content>
    </va-card>
  </va-inner-loading>
</template>

<script lang="ts">

import RawData from "../common/RawData.vue";
export default {
  components: {RawData},
  props: {
    events: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    toConctractLink: (address: string) => `/address/${address}`
  }
}

</script>

<style scoped>
.impacted {
  display: block;
}
</style>
