<script lang="ts">
  import { Anonymous } from "./icons";

  let size = 32
  let color = 'blue'
</script>

<main>
  <!-- Testing responsiveness -->
  <Anonymous {size} {color} />

  <!-- Testing class merging -->
  <Anonymous class="custom-class" />

  <!-- Testing accessibility -->
  <Anonymous title="Return" />
</main>

<style>
</style>
