<template>
  <div class="user-info">
    <FormKit type="form" v-model="formData">
      <FormKitSchema :schema="schema" />
    </FormKit>
    <pre>{{ formData }}</pre>
  </div>
</template>

<script setup lang="ts">
import { FormKitSchema, FormKit } from '@formkit/vue';
import type { FormKitSchemaDefinition } from '@formkit/core';
import { ref } from 'vue';

const schema = ref<FormKitSchemaDefinition>([
  {
    $formkit: 'text',
    name: 'username',
  },
  {
    $formkit: 'list',
    dynamic: true,
    name: 'hobbies',
    children: [
      {
        for: ['item', 'index', '$value'],
        index: '$index',
        key: '$index',
        $formkit: 'group',
        children: [
          {
            $formkit: 'text',
            name: 'name',
            label: 'Hobby Name',
          },
          {
            $formkit: 'number',
            name: 'level',
            label: 'Proficiency Level',
          },
        ],
      },
    ],
  },
]);

const formData = ref({
  username: 'Eminoda',
  hobbies: [
    {
      name: 'vue',
      level: 10,
    },
    {
      name: 'react',
      level: 8,
    },
    {
      name: 'angular',
      level: 6,
    },
  ],
});
</script>

<style scoped>
.user-info {
  padding: 20px;
}
</style>
