<template>
  <va-inner-loading :loading="loading">
    <va-card class="offset--sm row ma-3">
      <va-card-title>Events</va-card-title>
      <va-card-content>
        <table
          class="va-table va-table--hoverable va-table--striped"
          style="width: 100%"
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Source</th>
              <th>Impacted</th>
              <th>Data</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <EventRow v-for="event in events" :key="event.id" :event="event" />
          </tbody>
        </table>
        <RawData :data="events" />
      </va-card-content>
    </va-card>
  </va-inner-loading>
</template>

<script lang="ts">
import RawData from '../common/RawData.vue';
import EventRow from './EventRow.vue';
export default {
  components: { EventRow, RawData },
  props: {
    events: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped></style>
