<template>
  <n-layout>
    <n-layout-header>
      <Menu />
    </n-layout-header>
    <n-layout has-sider content-class="bg-gray-50">
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

:deep(.n-layout-content) {
  background-color: rgb(249 250 251);
}

:deep(.content) {
  padding: 10px;
  position: absolute;
  z-index: 9;
  overflow-y: scroll;
  width: 100%;
}

:deep(.n-layout-content) {
  padding: 15px;
}

:deep(.n-layout-scroll-container .content) {
  padding: 0;
}

:deep(.n-card) {
  margin-top: 0 !important;
}
</style>
<script setup lang="ts">
import Menu from '@/components/Menu.vue'
import Side from '@/components/Sider.vue'
</script>
