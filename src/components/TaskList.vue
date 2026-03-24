<!-- src/components/TaskList.vue -->
<!-- Owns the state via useTasks composable — handles search, filter, and task grid -->
<script setup>
import { ref } from 'vue'
import { useTasks } from '../composables/useTasks'
import StatsBar from './StatsBar.vue'
import TaskCard from './TaskCard.vue'
import TaskFormModal from './TaskFormModal.vue'
import ConfirmDeleteModal from './ConfirmDeleteModal.vue'

// All state and logic comes from the composable
const {
  searchQuery,
  statusFilter,
  stats,
  filteredTasks,
  changeStatus,
  isFormOpen,
  editingTask,
  lastError,
  openCreate,
  openEdit,
  closeForm,
  upsertTask,
  removeTask,
} = useTasks()

const statusOptions = ['All', 'To do', 'In progress', 'Done']

const isDeleteOpen = ref(false)
const deleteTargetId = ref(null)

function handleStatusChange({ id, newStatus }) {
  changeStatus(id, newStatus)
}

function handleDelete(id) {
  deleteTargetId.value = id
  isDeleteOpen.value = true
}

function cancelDelete() {
  isDeleteOpen.value = false
  deleteTargetId.value = null
}

function confirmDelete() {
  if (deleteTargetId.value == null) return
  removeTask(deleteTargetId.value)
  cancelDelete()
}
</script>

<template>
  <div>
    <!-- Stats overview -->
    <StatsBar :stats="stats" />

    <div v-if="lastError" class="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      {{ lastError }}
    </div>

    <!-- Search + filter bar -->
    <div class="flex flex-col md:flex-row gap-3 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by title or assignee…"
        class="flex-1 rounded-lg border border-rose-200 bg-white/80 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
      />

      <select
        v-model="statusFilter"
        class="rounded-lg border border-rose-200 px-4 py-2 text-sm shadow-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-rose-200"
      >
        <option v-for="option in statusOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>

      <button
        type="button"
        class="rounded-lg bg-rose-200 px-4 py-2 text-sm font-semibold text-rose-800 shadow-sm hover:bg-rose-300"
        @click="openCreate"
      >
        Add task
      </button>
    </div>

    <!-- Task grid -->
    <div
      v-if="filteredTasks.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      <TaskCard
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @statusChange="handleStatusChange"
        @edit="openEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-16 text-gray-400 text-sm">
      No tasks match your filters.
    </div>

    <TaskFormModal
      :open="isFormOpen"
      :task="editingTask"
      @close="closeForm"
      @save="upsertTask"
    />

    <ConfirmDeleteModal
      :open="isDeleteOpen"
      title="Delete task?"
      message="This action cannot be undone."
      @cancel="cancelDelete"
      @confirm="confirmDelete"
    />
  </div>
</template>