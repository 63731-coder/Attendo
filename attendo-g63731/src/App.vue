<template>
  <HeaderComponent />
  <NavComponent />
  <router-view />
</template>

<script>
import HeaderComponent from './components/HeaderComponent.vue';
import NavComponent from './components/NavComponent.vue'

export default {
  name: 'App',
  components: {
    HeaderComponent,
    NavComponent
  }
}
</script>

<style>
@import "tailwindcss";
</style>
