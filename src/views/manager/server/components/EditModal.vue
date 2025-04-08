<script setup lang="ts">
import { ref } from 'vue'
import { type FormInst, NButton, NSpace, type SelectOption, useMessage } from 'naive-ui'
import os from '@/data/os.json'

interface Props {
  visible: boolean
}

const message = useMessage()
const props = defineProps<Props>()
const emit = defineEmits(['close'])
const osSelectOptions: SelectOption[] = os
const editButtonLoading = ref(false)
const editFormRef = ref(<FormInst | null>null)
const editFormValue = ref({
  name: '',
  location: '',
  os: 'auto',
} as {
  name: string
  os: string
  location: string
})

const editFormRules = {
  name: [
    {
      required: true,
      message: '请输入服务器名称',
      trigger: ['input', 'blur'],
    },
  ],
  os: [
    {
      required: true,
      message: '请选择服务器系统',
      trigger: ['change', 'blur'],
    },
  ],
  location: [
    {
      required: false,
    },
  ],
}

const onClose = () => {
  emit('close')
}
</script>

<template>
  <n-modal
    v-model:show="props.visible"
    title="修改服务器"
    preset="card"
    size="huge"
    :style="{ width: '50%' }"
    @close="onClose"
  >
    <n-form ref="editFormRef" :model="editFormValue" :rules="editFormRules" size="small">
      <n-form-item path="name" label="服务器名称">
        <n-input v-model:value="editFormValue.name" placeholder="必填，不建议太长" />
      </n-form-item>
      <n-form-item path="os" label="服务器系统">
        <n-select v-model:value="editFormValue.os" :options="osSelectOptions" />
      </n-form-item>
      <n-form-item path="location" label="服务器位置">
        <n-input v-model:value="editFormValue.location" placeholder="留空则自动获取" />
      </n-form-item>
      <n-row :gutter="[0, 24]">
        <n-col :span="24">
          <div style="display: flex; justify-content: flex-end">
            <n-space>
              <n-button @click="onClose">取消</n-button>
              <n-button type="primary" :loading="editButtonLoading"> 保存修改</n-button>
            </n-space>
          </div>
        </n-col>
      </n-row>
    </n-form>
  </n-modal>
</template>

<style scoped>

</style>
