<template>
  <n-modal
    v-model:show="props.showModal"
    class="custom-card"
    preset="card"
    title="修改密码"
    style="width: 600px"
    size="huge"
    :bordered="true"
    :closable="false"
    positive-text="确认"
    negative-text="算了"
  >
    <n-form ref="formRef" :model="formValue" :rules="formRules">
      <n-form-item path="old_password" label="旧密码">
        <n-input v-model:value="formValue.old_password" placeholder="请输入旧密码" />
      </n-form-item>
      <n-form-item path="new_password" label="新密码">
        <n-input v-model:value="formValue.new_password" placeholder="请输入新密码" />
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
  old_password: '',
  new_password: '',
})
const formRules = ref({
  old_password: [
    {
      required: true,
      trigger: ['change', 'blur'],
      validator: (rule, value) => {
        if (!value || value === '') {
          return new Error('旧密码是必填的')
        }
        if (value.length < 8 || value.length > 50) {
          return new Error('密码长度需要在8-50位之间')
        }
        return true
      },
    },
  ],
  new_password: [
    {
      required: true,
      trigger: ['change', 'blur'],
      validator: (rule, value) => {
        if (!value || value === '') {
          return new Error('新密码是必填的')
        }
        if (value.length < 8 || value.length > 50) {
          return new Error('密码长度需要在8-50位之间')
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
        const { code, msg, data } = await requester.patch('/config/edit/password', formValue.value)
        if (code === 0) {
          message.success('密码重置成功🎉')
          formValue.value = {
            old_password: '',
            new_password: '',
          }
          emit('edit-success')
        } else {
          message.error(`密码重置失败😭(${msg})`)
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
