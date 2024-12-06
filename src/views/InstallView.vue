<template>
  <div class="bg-gray-50 fixed h-full w-full flex justify-center">
    <n-card class="text-center w-4/6 max-w-[500px] absolute top-[15%]">
      <n-spin :show="pageLoading">
        <template #description> 正在检查运行环境</template>
        <div class="mb-8">
          <h1 class="text-lg font-bold text-gray-600">
            欢迎使用
            <n-gradient-text type="success"> 蓝鲸服务器探针</n-gradient-text>
          </h1>
          <p class="text-gray-500">在开始使用之前，你还需要一些设置</p>
        </div>

        <n-form
          class="w-[80%] max-w-[380px] inline-grid"
          ref="formRef"
          :model="formValue"
          :rules="formRules"
        >
          <n-form-item path="title" label="面板标题">
            <n-input v-model:value="formValue.title" placeholder="请输入标题" />
          </n-form-item>
          <n-form-item path="username" label="管理员用户名">
            <n-input v-model:value="formValue.username" placeholder="请不要使用过于简单的用户名" />
          </n-form-item>
          <n-form-item path="password" label="管理员密码">
            <n-input
              type="password"
              v-model:value="formValue.password"
              placeholder="密码不少于6位"
            />
          </n-form-item>
          <div class="flex justify-center mt-1">
            <n-button
              type="primary"
              :loading="submitButtonLoading"
              @click="handleSubmitButtonClick"
            >
              安装并初始化
            </n-button>
          </div>
        </n-form>
      </n-spin>
    </n-card>
  </div>
  <n-modal
    v-model:show="envModalVisible"
    class="custom-card"
    preset="card"
    :style="{ width: '600px' }"
    title="环境检测"
    size="huge"
    :mask-closable="false"
    :bordered="false"
    :closable="false"
  >
    <n-table v-if="missingExtensions.length > 0" :single-line="false">
      <thead>
        <tr>
          <th>#</th>
          <th>检查项</th>
          <th>类型</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in missingExtensions">
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.type }}</td>
          <td>
            <span v-if="item.status" class="text-green-500">通过</span>
            <span v-else class="text-rose-600">不通过</span>
          </td>
        </tr>
      </tbody>
    </n-table>
    <template #footer>
      <n-space justify="end">
        <n-button type="primary" size="small" @click="checkEnv">重新检测</n-button>
      </n-space>
    </template>
  </n-modal>
</template>
<style scoped>
:deep(.n-input__input),
:deep(.n-form-item-feedback__line) {
  text-align: left;
}

:deep(.n-form-item) {
  margin-bottom: 4px;
}
</style>
<script setup lang="ts">
import { createDiscreteApi, type FormInst, type FormRules } from 'naive-ui'
import { onMounted, ref } from 'vue'
import requester from '@/utils/requester'
import router from '@/router'
import { useCommonStore } from '@/stores/common'
import { sha256 } from 'js-sha256'
import type { BaseResponseType, missingExtension } from '../../types'

const pageLoading = ref(true)
const { message } = createDiscreteApi(['message'])
const commonStore = useCommonStore()
const submitButtonLoading = ref(false)
const envModalVisible = ref(false)
const missingExtensions = ref(<missingExtension[]>[])
const formRef = ref<FormInst | null>(null)
const formValue = ref({
  title: '蓝鲸服务器探针',
  username: '',
  password: '',
})

const formRules: FormRules = {
  title: [
    {
      required: true,
      trigger: ['change', 'blur'],
      validator: (rule, value) => {
        if (!value || value == '') {
          return new Error('标题是必填')
        }
        if (value.length < 4 || value.length > 50) {
          return new Error('标题长度需要在4-50位之间')
        }
      },
    },
  ],
  username: [
    {
      required: true,
      trigger: ['change', 'blur'],
      validator: (rule, value) => {
        if (!value || value == '') {
          return new Error('管理员账号是必填的')
        }
        if (value.length < 8 || length > 50) {
          return new Error('账号长度需要在8-50位之间')
        }
        return true
      },
    },
  ],
  password: [
    {
      required: true,
      trigger: ['change', 'blur'],
      validator: (rule, value) => {
        if (!value || value == '') {
          return new Error('管理员密码是必填的')
        } else {
          const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,50}$/
          if (!passwordRegex.test(value)) {
            return new Error('密码至少包含字母和数字，且长度在8-50位之间')
          }
        }
      },
    },
  ],
}

const checkEnv = async () => {
  const { code, data }: BaseResponseType<missingExtension[]> =
    await requester.get('/install/env/check')
  if (code == 0) {
    message.success(`环境检查通过`)
    if (envModalVisible.value) {
      envModalVisible.value = false
    }
  } else {
    message.error(`环境检查不通过`)
    missingExtensions.value = data
    if (!envModalVisible.value) envModalVisible.value = true
  }
  pageLoading.value = false
}

const handleSubmitButtonClick = (e: MouseEvent) => {
  e.preventDefault()
  const loading = message.loading('正在初始化程序...')
  submitButtonLoading.value = true

  formRef.value?.validate(async (errors) => {
    if (errors) {
      message.error(errors[0][0].message as string)
      submitButtonLoading.value = false
      loading.destroy()
    } else {
      try {
        const { code, msg } = await requester.post('/install/install', {
          ...formValue.value,
          ...{ password: sha256(formValue.value.password) },
        })
        if (code === 0) {
          commonStore.setInstall()
          message.success('初始化成功，欢迎使用蓝鲸服务器探针', { duration: 5000 })
          await router.push('/')
        } else {
          message.error(`初始化失败（${msg}）`, { duration: 5000 })
        }
      } catch (error) {
        console.log(error)
        message.error(`初始化失败，发生错误（${(error as Error).message}）`, { duration: 5000 })
      } finally {
        submitButtonLoading.value = false
        loading.destroy()
      }
    }
  })
}

onMounted(() => {
  checkEnv()
})
</script>
