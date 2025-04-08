<template>
  <component :is="name">
    <slot/>
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import ManagerLayout from '@/layouts/ManagerLayout.vue'

export default defineComponent({
  components: {
    DefaultLayout,
    ManagerLayout
  },
  props: {
    name: {
      type: String,
      default: 'DefaultLayout' // 将默认值设置为 'DefaultLayout'
    }
  },
  setup() {
    return {};
  }
});
</script>
