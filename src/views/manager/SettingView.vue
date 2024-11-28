<template>
  <n-card title="系统设置">
    <n-tabs type="line" default-value="baseSetting">
      <n-tab-pane name="baseSetting" tab="基础设置">
        <n-form ref="formRef" :model="formValue" :rules="formRules">
          <n-form-item path="interval" label="检测间隔">
            <n-input-number
              v-model:value="formValue.interval"
              placeholder="不能小于1秒大于60秒"
              :min="1"
              :max="60"
            >
              <template #suffix> 秒</template>
            </n-input-number>
          </n-form-item>
          <n-form-item path="visitor" label="访客访问">
            <n-switch
              v-model:value="formValue.visitor"
              :round="false"
              @update:value="onVisitorUpdate"
            />
          </n-form-item>
          <n-form-item path="visitor_password" label="访问密码" v-show="showVisitorPassword">
            <n-input
              v-model:value="formValue.visitor_password"
              placeholder="留空则访客查看不需要密码"
            />
          </n-form-item>
          <n-form-item path="title" label="面板标题">
            <n-input v-model:value="formValue.title" placeholder="" />
          </n-form-item>
          <n-form-item path="username" label="管理员账号">
            <n-input
              v-model:value="formValue.username"
              :disabled="adminAccountDisabled"
              placeholder=""
            />
            <n-button style="margin-left: 5px">修改</n-button>
          </n-form-item>
          <n-form-item path="password" label="管理员密码">
            <n-input
              v-model:value="formValue.password"
              :disabled="adminPasswordDisabled"
              placeholder="密码不少于6位"
            />
            <n-button style="margin-left: 5px">修改</n-button>
          </n-form-item>

          <n-row :gutter="[0, 24]">
            <n-col :span="24">
              <div style="display: flex; justify-content: flex-start">
                <n-button
                  type="primary"
                  :loading="submitButtonLoading"
                  @click="handleSubmitButtonClick"
                >
                  保存设置
                </n-button>
              </div>
            </n-col>
          </n-row>
        </n-form>
      </n-tab-pane>
      <n-tab-pane name="about" tab="关于系统">
        <div class="mb-2">
          <p>当前版本：{{ localVersion }}</p>
          <p>最新版本：{{ newVersion }}</p>
          <n-collapse class="mt-2" default-expanded-names="1" accordion>
            <n-collapse-item title="更新详情" name="1">
              <div>Python</div>
            </n-collapse-item>
          </n-collapse>
        </div>
        <n-space>
          <n-button type="primary" size="small">检查更新</n-button>
          <n-button size="small">立即更新</n-button>
        </n-space>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { createDiscreteApi, type FormInst, type FormRules } from 'naive-ui'
import requester from '@/utils/requester'
import type { systemConfigType } from '../../../types'

const newVersion = ref('获取中')
const localVersion = ref('1.0.0')
const { message } = createDiscreteApi(['message'])
const formRef = ref<FormInst | null>(null)
const formValue = ref({
  interval: 5,
  visitor: false,
  visitor_password: '',
  title: '蓝鲸服务器探针',
  username: '',
  password: '',
})

const formRules: FormRules = {
  interval: [
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
  visitor_password: [
    {
      trigger: ['change', 'blur'],
      validator: (rule, value) => {
        if (formValue.value.visitor && value) {
          const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/
          if (!passwordRegex.test(value)) {
            return new Error('访问密码至少包含字母和数字，且长度不小于6位')
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
const showVisitorPassword = ref(false)
const adminAccountDisabled = ref(true)
const adminPasswordDisabled = ref(true)
const submitButtonLoading = ref(false)

const onVisitorUpdate = (value: boolean) => {
  showVisitorPassword.value = value
}

const handleSubmitButtonClick = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (errors) {
      message.error(`验证失败（${errors[0][0].message}）`)
      return
    } else {
      try {
        submitButtonLoading.value = true
        const { code, msg } = await requester.get('/setting/save')
        if (code == 0) {
          message.success('保存成功')
        } else {
          message.error(`保存失败（${msg}）`)
        }
      } catch (error) {
        message.error(`保存失败，发生错误（${(error as Error).message}）`)
      } finally {
        submitButtonLoading.value = false
      }
    }
  })
}

onMounted(async () => {
  let { code, msg, data } = await requester.get(
    '/setting/get?columns=title,interval,visitor,visitor_password,username,password',
  )
  if (code == 0) {
    let password
    if ((data as systemConfigType)?.password == true) {
      password = '*'.repeat(15)
    } else {
      password = ''
    }
    // @ts-ignore
    formValue.value = {
      ...(data as systemConfigType),
      ...{
        password: password,
        visitor_password: (data as systemConfigType)?.visitor_password || '',
      },
    }
  } else {
    message.error(`拉取设置失败（${msg}）`)
  }
})
</script>
