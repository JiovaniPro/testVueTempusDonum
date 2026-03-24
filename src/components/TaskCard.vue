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
          class="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-white/60 p-2 text-rose-700 hover:bg-rose-50"
          aria-label="Edit task"
          title="Edit"
          @click="onEdit"
        >
          <!-- Pencil icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-lg border border-orange-200 bg-white/60 p-2 text-orange-700 hover:bg-orange-50"
          aria-label="Delete task"
          title="Delete"
          @click="onDelete"
        >
          <!-- Trash icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
          </svg>
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