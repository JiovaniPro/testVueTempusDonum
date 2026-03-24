<!-- src/components/TaskFormModal.vue -->
<!-- Modal form for Create/Edit task. Emits save(payload) and close(). -->
<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, required: true },
  task: { type: Object, default: null }, // when set => edit mode
})

const emit = defineEmits(['close', 'save'])

const isEdit = computed(() => Boolean(props.task?.id))

const form = reactive({
  title: '',
  assignee: '',
  status: 'To do',
  priority: 'medium',
  duedate: '',
})

const errors = reactive({
  title: '',
  assignee: '',
  duedate: '',
})

watch(
  () => [props.open, props.task],
  () => {
    // Reset local state every time the modal is opened.
    if (!props.open) return
    errors.title = ''
    errors.assignee = ''
    errors.duedate = ''

    form.title = props.task?.title ?? ''
    form.assignee = props.task?.assignee ?? ''
    form.status = props.task?.status ?? 'To do'
    form.priority = props.task?.priority ?? 'medium'
    form.duedate = props.task?.duedate ?? ''
  },
  { immediate: true }
)

function validate() {
  errors.title = form.title.trim() ? '' : 'Title is required'
  errors.assignee = form.assignee.trim() ? '' : 'Assignee is required'
  errors.duedate = /^\d{4}-\d{2}-\d{2}$/.test(form.duedate) ? '' : 'Due date is required'
  return !errors.title && !errors.assignee && !errors.duedate
}

function onSubmit() {
  if (!validate()) return
  emit('save', {
    title: form.title.trim(),
    assignee: form.assignee.trim(),
    status: form.status,
    priority: form.priority,
    duedate: form.duedate,
  })
}

function onBackdrop(e) {
  if (e.target === e.currentTarget) emit('close')
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-rose-900/20" @click="onBackdrop"></div>

    <div class="relative mx-auto mt-16 w-[92%] max-w-xl">
      <div class="rounded-2xl bg-rose-50 shadow-xl border border-rose-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-rose-100 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-700">
              {{ isEdit ? 'Edit task' : 'Add task' }}
            </h2>
            <p class="text-xs text-slate-500">All fields are required.</p>
          </div>
          <button
            type="button"
            class="rounded-lg px-2 py-1 text-sm text-slate-500 hover:text-slate-700 hover:bg-rose-100"
            @click="emit('close')"
          >
            Close
          </button>
        </div>

        <form class="px-6 py-5 grid grid-cols-1 gap-4" @submit.prevent="onSubmit">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              v-model="form.title"
              type="text"
              class="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              placeholder="e.g. Design homepage"
            />
            <p v-if="errors.title" class="mt-1 text-xs text-red-600">{{ errors.title }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Assignee</label>
            <input
              v-model="form.assignee"
              type="text"
              class="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              placeholder="e.g. Alice"
            />
            <p v-if="errors.assignee" class="mt-1 text-xs text-red-600">{{ errors.assignee }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                v-model="form.status"
                class="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                <option value="To do">To do</option>
                <option value="In progress">In progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select
                v-model="form.priority"
                class="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                <option value="high">high</option>
                <option value="medium">medium</option>
                <option value="low">low</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Due date</label>
            <input
              v-model="form.duedate"
              type="date"
              class="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
            <p v-if="errors.duedate" class="mt-1 text-xs text-red-600">{{ errors.duedate }}</p>
          </div>

          <div class="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              class="rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-rose-100"
              @click="emit('close')"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded-lg bg-rose-200 px-4 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-300"
            >
              {{ isEdit ? 'Save changes' : 'Create task' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

