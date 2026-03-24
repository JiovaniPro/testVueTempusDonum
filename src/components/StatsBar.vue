
<script setup>
defineProps({
  stats: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <!-- Total tasks -->
    <div class="bg-slate-100 text-slate-700 rounded-xl p-4 shadow-sm border border-slate-200">
      <p class="text-sm text-slate-500 mb-1">Total Tasks</p>
      <p class="text-3xl font-bold text-slate-700">{{ stats.total }}</p>
    </div>

    <!-- To Do -->
    <div class="bg-sky-100 text-sky-800 rounded-xl p-4 shadow-sm border border-sky-200">
      <p class="text-sm text-sky-600 mb-1">To Do</p>
      <p class="text-3xl font-bold text-sky-700">{{ stats.todo }}</p>
    </div>

    <!-- In Progress -->
    <div class="bg-amber-100 text-amber-800 rounded-xl p-4 shadow-sm border border-amber-200">
      <p class="text-sm text-amber-600 mb-1">In Progress</p>
      <p class="text-3xl font-bold text-amber-700">{{ stats.inProgress }}</p>
    </div>

    <!-- Done -->
    <div class="bg-emerald-100 text-emerald-800 rounded-xl p-4 shadow-sm border border-emerald-200">
      <p class="text-sm text-emerald-600 mb-1">Done</p>
      <p class="text-3xl font-bold text-emerald-700">{{ stats.done }}</p>
    </div>
  </div>
</template>