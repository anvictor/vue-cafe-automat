<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
}

.app-nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #2c3e50;
}

.app-nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
}

.app-nav a:hover {
  background: rgba(255, 255, 255, 0.1);
}

.app-nav a.router-link-active {
  background: #42b983;
}

main {
  /* padding: 2rem; */
}
</style>
