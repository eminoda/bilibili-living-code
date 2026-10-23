<template>
  <FormKit type="form" v-model="formState" :actions="false" :incomplete-message="false" @submit="hello">
    <FormKit
      label-class="w-xl"
      type="text"
      name="username"
      label="Username"
      validation="required | hello"
      :validation-messages="{
        hello: 'The correct answer is: hello.',
      }"
      placeholder="Enter your username" />
    <FormKit label-class="w-xl" type="password" name="password" label="Password" validation="required | matches:/[6-9]/" placeholder="Enter your password" />
    <FormKit label-class="w-xl" type="checkbox" name="remember" label="remember" />
    <FormKit type="submit" label="登录" @click="login" />
  </FormKit>
</template>
<script setup lang="ts">
import { reactive } from 'vue';

interface FormState {
  username: string;
  password: string;
  remember: boolean;
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
});

const login = () => {
  console.log('Login form submitted:', formState);
};

const hello = () => {
  console.log('Hello from FormKit submit event');
};
</script>
