<template>
  <n-layout>
    <n-layout-header>
      <Menu />
    </n-layout-header>
    <n-layout has-sider>
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        show-trigger
        style="height: 93.5vh"
      >
        <Side />
      </n-layout-sider>
      <n-layout-content content-class="bg-gray-50 content">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>
<style scoped>
:deep(.n-layout-sider-scroll-container) {
  min-width: unset !important;
}

:deep(.content) {
  padding: 10px;
  position: absolute;
  z-index: 9;
  overflow-y: scroll;
  width: 100%;
}
</style>
<script setup lang="ts">
import Menu from '@/components/Menu.vue'
import Side from '@/components/Sider.vue'
</script>
