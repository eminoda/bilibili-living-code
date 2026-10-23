<template>
  <div class="max-w-2xl mx-auto p-6 mt-6">
    <!-- <nav class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-green-600">Vue Todo Demo</h1>
      <div class="flex gap-3">
        <RouterLink
          to="/todo"
          class="px-3 py-1 rounded border border-green-500 text-green-600 hover:bg-green-50"
        >
          Todo
        </RouterLink>
        <RouterLink
          to="/todo2"
          class="px-3 py-1 rounded border border-green-500 text-green-600 hover:bg-green-50"
        >
          Todo2
        </RouterLink>
      </div>
    </nav> -->

    <RouterView />
  </div>

</template>

<script setup lang="ts">
// App shell for routing; pages are in src/views
</script>

<style scoped>
/* App-level styles only; page animations/styles live in each view */
.router-link-active {
  background-color: rgb(34 197 94); /* green-500 */
  color: white;
}
</style>
