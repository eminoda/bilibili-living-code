<script setup lang="ts">
import { computed, shallowRef } from 'vue'

const username = shallowRef('')
const password = shallowRef('')
const loading = shallowRef(false)

const projects = [
  { id: '1', name: '项目 A' },
  { id: '2', name: '项目 B' },
] as const

const currentProjectId = shallowRef<(typeof projects)[number]['id']>(projects[0].id)

const currentProjectName = computed(
  () => projects.find((project) => project.id === currentProjectId.value)?.name ?? '',
)

function switchProject(projectId: (typeof projects)[number]['id']) {
  currentProjectId.value = projectId
}

function onProjectChange(event: Event) {
  const target = event.target
  if (!(target instanceof HTMLSelectElement)) {
    return
  }

  const nextId = projects.find((project) => project.id === target.value)?.id
  if (nextId) {
    switchProject(nextId)
  }
}

function back() {}

async function handleLogin() {
  if (!username.value || !password.value) {
    return
  }

  loading.value = true

  try {
    // 请求接口
  } catch (err) {
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <nav class="breadcrumb" aria-label="面包屑">{{ currentProjectName }}</nav>
  <select :value="currentProjectId" @change="onProjectChange">
    <option v-for="project in projects" :key="project.id" :value="project.id">
      {{ project.name }}
    </option>
  </select>
  <div @click="back">返回</div>
</template>
