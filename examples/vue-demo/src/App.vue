<script setup lang="ts">
import { AirpodCase1 } from "./icons";

const iconProps = {
  size: 32,
  color: 'blue',
}
</script>

<template>
  <div>
    <!-- Text v-bind -->
    <AirpodCase1 v-bind="iconProps" />

    <!-- Testing class merging -->
    <AirpodCase1 class="custom-class" />

    <!-- Testing accessibility -->
    <AirpodCase1 title="Return" />
    <AirpodCase1 aria-label="Close" />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
