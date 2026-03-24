<!-- src/App.vue -->
<script setup>
import TaskList from './components/TaskList.vue'
</script>

<template>
  <div class="min-h-screen bg-rose-50/40">
    <div class="max-w-6xl mx-auto px-4 py-10">
      <!-- Page title -->
      <h1 class="text-3xl font-bold text-slate-700 mb-8">Task Dashboard</h1>

      <!-- Main content -->
      <TaskList />
    </div>
  </div>
</template>