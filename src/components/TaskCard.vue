<!-- src/components/TaskCard.vue -->
<!-- Displays a single task — emits statusChange/edit/delete -->
<script setup>
import StatusDropdown from './StatusDropdown.vue'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['statusChange', 'edit', 'delete'])

// Priority badge color mapping
const priorityClass = {
  high: 'bg-rose-100 text-rose-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-emerald-100 text-emerald-700',
}

// Format date without any external library
function formatDate(dateStr) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr))
}

function handleStatusChange(newStatus) {
  emit('statusChange', { id: props.task.id, newStatus })
}

function onEdit() {
  emit('edit', props.task)
}

function onDelete() {
  emit('delete', props.task.id)
}
</script>

<template>
  <div class="bg-white/90 rounded-xl shadow-sm p-5 flex flex-col gap-3 border border-rose-100 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between gap-3">
      <!-- Title -->
      <h3 class="text-lg font-bold text-slate-700 leading-snug">{{ task.title }}</h3>
      <div class="flex items-center gap-2 shrink-0">
        <button
          type="button"
          class="rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
          @click="onEdit"
        >
          Edit
        </button>
        <button
          type="button"
          class="rounded-lg border border-orange-200 px-2.5 py-1 text-xs font-semibold text-orange-700 hover:bg-orange-50"
          @click="onDelete"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- Assignee -->
    <p class="text-sm text-gray-500">
      <span class="font-medium text-gray-700">Assignee:</span> {{ task.assignee }}
    </p>

    <!-- Priority badge -->
    <span
      :class="priorityClass[task.priority]"
      class="inline-block w-fit px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
    >
      {{ task.priority }}
    </span>

    <!-- Due date -->
    <p class="text-sm text-gray-500">
      <span class="font-medium text-gray-700">Due:</span> {{ formatDate(task.duedate) }}
    </p>

    <!-- Current status -->
    <p class="text-sm text-gray-500">
      <span class="font-medium text-gray-700">Status:</span> {{ task.status }}
    </p>

    <!-- Status change dropdown -->
    <StatusDropdown
      :currentStatus="task.status"
      @change="handleStatusChange"
    />
  </div>
</template>