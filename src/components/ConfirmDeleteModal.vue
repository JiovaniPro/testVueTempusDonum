<!-- src/components/ConfirmDeleteModal.vue -->
<!-- Confirmation modal for destructive actions. Emits confirm() and cancel(). -->
<script setup>
defineProps({
  open: { type: Boolean, required: true },
  title: { type: String, default: 'Delete task?' },
  message: {
    type: String,
    default: 'This action cannot be undone.',
  },
})

const emit = defineEmits(['confirm', 'cancel'])

function onBackdrop(e) {
  if (e.target === e.currentTarget) emit('cancel')
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-slate-900/30" @click="onBackdrop"></div>

    <div class="relative mx-auto mt-24 w-[92%] max-w-md">
      <div class="rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200">
          <h2 class="text-lg font-bold text-slate-700">{{ title }}</h2>
          <p class="mt-1 text-sm text-slate-600">{{ message }}</p>
        </div>

        <div class="px-6 py-4 flex items-center justify-end gap-2">
          <button
            type="button"
            class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            @click="emit('cancel')"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-lg bg-orange-200 px-4 py-2 text-sm font-semibold text-orange-800 hover:bg-orange-300"
            @click="emit('confirm')"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

