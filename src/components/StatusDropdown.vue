<!-- src/components/StatusDropdown.vue -->
<!-- Controlled dropdown — emits 'change' with new status string -->
<script setup>
defineProps({
  currentStatus: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['change'])

const statuses = ['To do', 'In progress', 'Done']
</script>

<template>
  <select
    :value="currentStatus"
    @change="emit('change', $event.target.value)"
    class="mt-2 w-full rounded-lg border border-rose-200 bg-rose-50/40 px-3 py-1.5 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
  >
    <option v-for="status in statuses" :key="status" :value="status">
      {{ status }}
    </option>
  </select>
</template>