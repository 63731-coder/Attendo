<template>
  <HeaderComponent />
  <router-view />
</template>

<script>
import HeaderComponent from './components/HeaderComponent.vue';

export default {
  name: 'App',
  components: {
    HeaderComponent
  }
}
</script>

<style>
@import "tailwindcss";
</style>
