<template>
  <n-layout>
    <n-layout-header>
      <Menu />
    </n-layout-header>
    <n-layout-content content-style="padding: 24px" content-class="bg-gray-50">
      <router-view />
    </n-layout-content>
    <n-layout-footer>
      <Footer />
    </n-layout-footer>
  </n-layout>
</template>
<script setup lang="ts">
import Menu from '@/components/Menu.vue'
import Footer from '@/components/Footer.vue'
</script>
