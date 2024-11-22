<template>
  <div class="flex justify-center h-full pt-10 m-10">
    <n-card class="text-center w-4/6">
      <div class="mb-8">
        <h1 class="text-lg font-bold text-gray-600">
          欢迎使用
          <n-gradient-text type="success"> 蓝鲸服务器探针 </n-gradient-text>
        </h1>
        <p class="text-gray-500">在开始使用之前，你还需要一些设置</p>
      </div>

      <n-form class="w-3/6 inline-grid" ref="formRef" :model="formValue" :rules="formRules">
        <n-form-item path="title" label="面板标题">
          <n-input v-model:value="formValue.title" placeholder="" />
        </n-form-item>
        <n-form-item path="admin_account" label="管理员账号">
          <n-input v-model:value="formValue.admin_account" placeholder="" />
        </n-form-item>
        <n-form-item path="admin_password" label="管理员密码">
          <n-input type="password" v-model:value="formValue.admin_password" placeholder="密码不少于6位" />
        </n-form-item>
        <div class="flex justify-center mt-6">
          <n-button type="primary" :loading="submitButtonLoading" @click="handleSubmitButtonClick">
            开始使用
          </n-button>
        </div>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { createDiscreteApi, type FormInst, type FormRules } from 'naive-ui'
import { ref } from 'vue'

const { message } = createDiscreteApi(['message'])
const formRef = ref<FormInst | null>(null)
const formValue = ref({
  time: 5,
  guest: false,
  guest_password: '',
  title: '蓝鲸服务器探针',
  admin_account: '',
  admin_password: '',
})

const formRules: FormRules = {
  time: [
    {
      required: true,
      trigger: ['change', 'blur'],
      validator: (rule, value) => {
        if (value == null || value < 1 || value > 60) {
          return new Error('请输入1-60之间的数字')
        }
        return true
      },
    },
  ],
  guest_password: [
    {
      trigger: ['change', 'blur'],
      validator: (rule, value) => {
        if (!formValue.value.guest) {
          return false
        }
        if (!value || value == '') {
          return new Error('游客访问密码是必填的')
        } else {
          const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/
          if (!passwordRegex.test(value)) {
            return new Error('密码至少包含字母和数字，且长度不小于6位')
          }
        }
      },
    },
  ],
  title: [
    {
      required: true,
      trigger: ['change', 'blur'],
      validator: (rule, value) => {
        if (!value || value == '') {
          return new Error('标题是必填')
        }
      },
    },
  ],
  admin_account: [
    {
      required: true,
      trigger: ['change', 'blur'],
      validator: (rule, value) => {
        if (!value || value == '') {
          return new Error('管理员账号是必填的')
        }
        return true
      },
    },
  ],
  admin_password: [
    {
      required: true,
      trigger: ['change', 'blur'],
      validator: (rule, value) => {
        if (!value || value == '') {
          return new Error('管理员密码是必填的')
        } else {
          const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/
          if (!passwordRegex.test(value)) {
            return new Error('密码至少包含字母和数字，且长度不小于6位')
          }
        }
      },
    },
  ],
}
</script>
