<template>
  <n-modal
    v-model:show="props.showModal"
    class="custom-card"
    preset="card"
    title="修改用户名"
    style="width: 600px"
    size="huge"
    :bordered="true"
    positive-text="确认"
    negative-text="算了"
  >
    <n-form ref="formRef" :model="formValue" :rules="formRules">
      <n-form-item path="old_username" label="旧用户名">
        <n-input v-model:value="formValue.old_username" placeholder="请输入旧用户名" />
      </n-form-item>
      <n-form-item path="new_username" label="新用户名">
        <n-input v-model:value="formValue.new_username" placeholder="请输入新用户名" />
      </n-form-item>
    </n-form>
    <template #footer>
      <n-space justify="end">
        <n-button size="small" @click="handleClose">算了</n-button>
        <n-button type="primary" size="small" @click="handleSubmitButtonClick">确认修改</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createDiscreteApi } from 'naive-ui'
import requester from '@/utils/requester'

const formRef = ref(null)
const { message } = createDiscreteApi(['message'])
const props = defineProps({
  showModal: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['edit-success', 'close'])

const formValue = ref({
  old_username: '',
  new_username: '',
})
const formRules = ref({
  old_username: [
    {
      required: true,
      trigger: ['change', 'blur'],
      validator: (rule, value) => {
        if (!value || value === '') {
          return new Error('旧用户名是必填的')
        }
        if (value.length < 8 || value.length > 50) {
          return new Error('用户名长度需要在8-50位之间')
        }
        return true
      },
    },
  ],
  new_username: [
    {
      required: true,
      trigger: ['change', 'blur'],
      validator: (rule, value) => {
        if (!value || value === '') {
          return new Error('新用户名是必填的')
        }
        if (value.length < 8 || value.length > 50) {
          return new Error('用户名长度需要在8-50位之间')
        }
        return true
      },
    },
  ],
})

const handleSubmitButtonClick = async (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (errors) {
      message.error(`验证失败（${errors[0][0].message}）`)
      return
    } else {
      try {
        const { code, msg, data } = await requester.patch('/config/edit/username', formValue.value)
        if (code === 0) {
          message.success('用户名重置成功🎉')
          formValue.value = {
            old_username: '',
            new_username: '',
          }
          emit('edit-success', data.username)
        } else {
          message.error(`用户名重置失败😭(${msg})`)
        }
      } catch (e) {
        console.log(e)
        message.error('出错了啊啊啊,要不刷新一下再试试')
      }
    }
  })
}

const handleClose = () => {
  emit('close')
}
</script>
