// src/composables/useTasks.js
// Reactive layer between taskService and the UI

import { ref, computed } from 'vue'
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from '../services/taskService'

export function useTasks() {
  // Reactive task list, initialized from the service
  const tasks = ref(getTasks())

  // Search and filter state
  const searchQuery = ref('')
  const statusFilter = ref('All')
  const priorityFilter = ref('All')

  // UI state
  const isFormOpen = ref(false)
  const editingTask = ref(null) // when set, form is in "edit" mode
  const lastError = ref('')

  // Computed stats derived from tasks
  const stats = computed(() => ({
    total: tasks.value.length,
    todo: tasks.value.filter(t => t.status === 'To do').length,
    inProgress: tasks.value.filter(t => t.status === 'In progress').length,
    done: tasks.value.filter(t => t.status === 'Done').length,
  }))

  // Computed filtered list — search and status filter work together
  const filteredTasks = computed(() => {
    const query = searchQuery.value.toLowerCase()
    return tasks.value.filter(task => {
      // Status filter
      const matchesStatus =
        statusFilter.value === 'All' || task.status === statusFilter.value

      // Priority filter
      const matchesPriority =
        priorityFilter.value === 'All' || task.priority === priorityFilter.value

      // Search filter on title and assignee (case-insensitive)
      const matchesSearch =
        task.title.toLowerCase().includes(query) ||
        task.assignee.toLowerCase().includes(query)

      return matchesStatus && matchesPriority && matchesSearch
    })
  })

  function refresh() {
    tasks.value = getTasks()
  }

  // Call service to update status, then refresh reactive list
  function changeStatus(id, newStatus) {
    lastError.value = ''
    try {
      updateTaskStatus(id, newStatus)
      refresh()
    } catch (e) {
      lastError.value = e?.message ?? String(e)
    }
  }

  function openCreate() {
    lastError.value = ''
    editingTask.value = null
    isFormOpen.value = true
  }

  function openEdit(task) {
    lastError.value = ''
    editingTask.value = { ...task }
    isFormOpen.value = true
  }

  function closeForm() {
    isFormOpen.value = false
    editingTask.value = null
  }

  function upsertTask(payload) {
    lastError.value = ''
    try {
      if (editingTask.value?.id) {
        updateTask(editingTask.value.id, payload)
      } else {
        createTask(payload)
      }
      refresh()
      closeForm()
    } catch (e) {
      lastError.value = e?.message ?? String(e)
    }
  }

  function removeTask(id) {
    lastError.value = ''
    try {
      deleteTask(id)
      refresh()
      // If we deleted the task being edited, close the form.
      if (editingTask.value?.id === id) closeForm()
    } catch (e) {
      lastError.value = e?.message ?? String(e)
    }
  }

  return {
    tasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    stats,
    filteredTasks,
    changeStatus,
    // CRUD + UI state
    isFormOpen,
    editingTask,
    lastError,
    openCreate,
    openEdit,
    closeForm,
    upsertTask,
    removeTask,
  }
}