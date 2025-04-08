<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NSpace, useMessage } from 'naive-ui'
import type { SelectOption, FormInst, FormItemRule } from 'naive-ui'
import { addSever } from '@/api/manager'
import os from '@/data/os.json'
import type { AddForm } from '@/types/manager'

interface Props {
  visible: boolean
}

const message = useMessage()
const props = defineProps<Props>()
const emit = defineEmits(['close'])
const osSelectOptions: SelectOption[] = os
const addButtonLoading = ref(false)
const addFormRef = ref(<FormInst | null>null)
const addFormValue = ref(<AddForm>{
  name: '',
  ip: '',
  os: 'auto',
  location: '',
  script: '',
})

const addFormRules = {
  name: [
    {
      required: true,
      message: '请输入服务器名称',
      trigger: ['input', 'blur'],
    },
  ],
  ip: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('IP是必填的')
        } else {
          const ipv4Regex =
            /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
          if (!ipv4Regex.test(value)) {
            return new Error('请输入正确的IPv4地址')
          }
        }
        return true
      },
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
  script: [
    {
      required: false,
    },
  ],
}

const handleAddButtonClick = (e: MouseEvent) => {
  e.preventDefault()
  addFormRef.value?.validate(async (errors: any) => {
    if (errors) {
      message.error(`验证失败（${errors[0][0].message}）`)
      return
    } else {
      try {
        if (addFormValue.value.location == '') {
          addFormValue.value = {
            ...addFormValue.value,
            location: 'auto',
          }
        }
        if ('script' in addFormValue.value) {
          delete addFormValue.value.script
        }
        addButtonLoading.value = true
        const { code, msg } = await addSever(addFormValue.value)
        if (code == 0) {
          message.success('添加成功')
          onClose()
        } else {
          message.error(`添加失败（${msg}）`)
        }
      } catch (error) {
        message.error(`服务器信息添加失败，发生错误`)
        addButtonLoading.value = false
      } finally {
        addButtonLoading.value = false
      }
    }
  })
}

const onClose = () => {
  emit('close')
}
</script>

<template>
  <n-modal
    v-model:show="props.visible"
    title="添加服务器"
    preset="card"
    size="huge"
    :style="{ width: '50%' }"
    @close="onClose"
  >
    <n-form ref="addFormRef" :model="addFormValue" :rules="addFormRules" size="small">
      <n-form-item path="name" label="服务器名称">
        <n-input v-model:value="addFormValue.name" placeholder="必填，不建议太长" />
      </n-form-item>
      <n-form-item path="ip" label="服务器IPv4">
        <n-input v-model:value="addFormValue.ip" placeholder="请填写正确的服务器IPv4" />
      </n-form-item>
      <n-form-item path="os" label="服务器系统">
        <n-select v-model:value="addFormValue.os" :options="osSelectOptions" />
      </n-form-item>
      <n-form-item path="location" label="服务器位置">
        <n-input v-model:value="addFormValue.location" placeholder="留空则自动获取" />
      </n-form-item>
      <n-form-item path="script" label="被控安装脚本">
        <n-input v-model:value="addFormValue.script" type="textarea" disabled />
      </n-form-item>
      <n-row :gutter="[0, 24]">
        <n-col :span="24">
          <div style="display: flex; justify-content: flex-end">
            <n-space>
              <n-button @click="onClose">取消</n-button>
              <n-button
                type="primary"
                @positive-click="handleAddButtonClick"
                :loading="addButtonLoading"
              >
                添加服务器
              </n-button>
            </n-space>
          </div>
        </n-col>
      </n-row>
    </n-form>
  </n-modal>
</template>

<style scoped></style>
