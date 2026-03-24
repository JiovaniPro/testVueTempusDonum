// src/services/taskService.js
// Pure JS service — zero Vue imports. Simulates a backend API with local persistence.

import rawTasks from '../data/tasks.json'

const STORAGE_KEY = 'tasks-dashboard.tasks.v1'

/**
 * @typedef {'To do'|'In progress'|'Done'} TaskStatus
 * @typedef {'high'|'medium'|'low'} TaskPriority
 *
 * @typedef {Object} Task
 * @property {number} id
 * @property {string} title
 * @property {string} assignee
 * @property {TaskStatus} status
 * @property {TaskPriority} priority
 * @property {string} duedate // YYYY-MM-DD
 */

/** @type {Task[]} */
let tasks = loadFromStorageOrSeed()

function loadFromStorageOrSeed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // ignore and fall back to seed
  }
  const seeded = rawTasks.map(t => ({ ...t }))
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
  } catch {
    // ignore storage errors during bootstrap
  }
  return seeded
}

/** @param {Task[]} next */
function saveToStorage(next) {
  tasks = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // If storage is unavailable (private mode/quota), keep in-memory only.
  }
}

/** @param {any} value @returns {string} */
function asTrimmedString(value) {
  return String(value ?? '').trim()
}

/** @param {any} value @returns {TaskStatus} */
function normalizeStatus(value) {
  const v = asTrimmedString(value)
  if (v === 'To do' || v === 'In progress' || v === 'Done') return v
  throw new Error(`Invalid status: ${v}`)
}

/** @param {any} value @returns {TaskPriority} */
function normalizePriority(value) {
  const v = asTrimmedString(value).toLowerCase()
  if (v === 'high' || v === 'medium' || v === 'low') return v
  throw new Error(`Invalid priority: ${v}`)
}

/** @param {any} value @returns {string} */
function normalizeDueDate(value) {
  const v = asTrimmedString(value)
  // Expect YYYY-MM-DD from <input type="date">.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new Error(`Invalid duedate: ${v}`)
  const date = new Date(v)
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid duedate: ${v}`)
  return v
}

/** @param {Task[]} list */
function nextId(list) {
  const max = list.reduce((m, t) => (t.id > m ? t.id : m), 0)
  return max + 1
}

/**
 * Returns a shallow copy of all tasks (never exposes the raw reference)
 * @returns {Task[]}
 */
export function getTasks() {
  return tasks.map(t => ({ ...t }))
}

/**
 * Creates a new task.
 * @param {Omit<Task,'id'>} input
 * @returns {Task}
 */
export function createTask(input) {
  const title = asTrimmedString(input?.title)
  const assignee = asTrimmedString(input?.assignee)
  const status = normalizeStatus(input?.status)
  const priority = normalizePriority(input?.priority)
  const duedate = normalizeDueDate(input?.duedate)

  if (!title) throw new Error('Title is required')
  if (!assignee) throw new Error('Assignee is required')

  const created = { id: nextId(tasks), title, assignee, status, priority, duedate }
  saveToStorage([...tasks, created])
  return { ...created }
}

/**
 * Updates an existing task by id (partial update).
 * @param {number} id
 * @param {Partial<Omit<Task,'id'>>} patch
 * @returns {Task}
 */
export function updateTask(id, patch) {
  const idx = tasks.findIndex(t => t.id === id)
  if (idx === -1) throw new Error(`Task with id ${id} not found`)

  const current = tasks[idx]
  const next = { ...current }

  if (patch?.title !== undefined) {
    const title = asTrimmedString(patch.title)
    if (!title) throw new Error('Title is required')
    next.title = title
  }
  if (patch?.assignee !== undefined) {
    const assignee = asTrimmedString(patch.assignee)
    if (!assignee) throw new Error('Assignee is required')
    next.assignee = assignee
  }
  if (patch?.status !== undefined) next.status = normalizeStatus(patch.status)
  if (patch?.priority !== undefined) next.priority = normalizePriority(patch.priority)
  if (patch?.duedate !== undefined) next.duedate = normalizeDueDate(patch.duedate)

  const copy = tasks.slice()
  copy[idx] = next
  saveToStorage(copy)
  return { ...next }
}

/**
 * Deletes a task by id.
 * @param {number} id
 * @returns {boolean} true if deleted
 */
export function deleteTask(id) {
  const before = tasks.length
  const next = tasks.filter(t => t.id !== id)
  if (next.length === before) return false
  saveToStorage(next)
  return true
}

/**
 * Backwards-compatible helper required by the prompt.
 * @param {number} id
 * @param {TaskStatus} status
 */
export function updateTaskStatus(id, status) {
  return updateTask(id, { status })
}

/**
 * Optional: reset store to the seeded JSON (useful for demos).
 */
export function resetTasks() {
  const seeded = rawTasks.map(t => ({ ...t }))
  saveToStorage(seeded)
  return getTasks()
}