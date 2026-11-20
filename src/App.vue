<script setup lang="ts">
import SettingsDialog from '@/components/dialogs/SettingsDialog.vue'
</script>

<template>
  <div id="app">
    <RouterView />
    <SettingsDialog />
  </div>
</template>

<style scoped>
#app {
  width: 100%;
  height: 100%;
}
</style>
