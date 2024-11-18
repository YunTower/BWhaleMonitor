<template>
 <div class="h-[70vh] flex justify-center items-center">
   <n-result status="404" title="404 资源不存在" description="啊哦，你请求的资源不见了">
     <template #footer>
       <n-button @click="back">返回首页</n-button>
     </template>
   </n-result>
 </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const back = () => {
  router.push('/')
}
</script>
