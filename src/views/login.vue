<template>
  <div class="w-full h-full flex items-center justify-center bg-gray-50 fixed">
    <n-card class="max-w-[430px] max-h-[428px] bottom-20">
      <n-tabs
        class="card-tabs"
        default-value="admin"
        :value="defaultTab"
        size="large"
        animated
        pane-wrapper-style="margin: 0 -4px"
        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
      >
        <n-tab-pane name="admin" tab="管理员登录">
          <n-form
            ref="adminFormRef"
            :model="adminFormValue"
            :rules="adminFormRules"
            :show-require-mark="false"
          >
            <n-form-item-row path="username" label="用户名">
              <n-input v-model:value="adminFormValue.username" placeholder="请输入用户名" />
            </n-form-item-row>
            <n-form-item-row path="password" label="密码">
              <n-input
                type="password"
                v-model:value="adminFormValue.password"
                placeholder="请输入密码"
              />
            </n-form-item-row>
            <n-form-item-row path="captcha" label="验证码">
              <n-input-group>
                <n-input v-model:value="adminFormValue.captcha" placeholder="请输入验证码" />
                <n-image
                  class="h-[34px] captcha"
                  height="34"
                  width="130"
                  :src="captchaPic"
                  alt="captcha"
                  @click="requestCaptcha"
                  @error="onCaptchaLoadError"
                  lazy
                  preview-disabled
                />
              </n-input-group>
            </n-form-item-row>
          </n-form>
          <n-button
            type="primary"
            @click="onAdminLogin"
            :loading="adminLoginBtnLoading"
            block
            strong
          >
            登录
          </n-button>
        </n-tab-pane>
        <n-tab-pane name="visitor" tab="访客登录" v-if="baseConfig?.visitor">
          <n-form
            ref="visitorFormRef"
            :model="visitorFormValue"
            :rules="visitorFormRules"
            :show-require-mark="false"
          >
            <n-form-item-row
              path="password"
              label="访问密码"
              v-if="commonStore.baseConfig?.visitor_password"
            >
              <n-input
                type="password"
                v-model:value="visitorFormValue.password"
                placeholder="请输入访问密码"
              />
            </n-form-item-row>
            <n-form-item-row path="captcha" label="验证码">
              <n-input-group>
                <n-input v-model:value="visitorFormValue.captcha" placeholder="请输入验证码" />
                <n-image
                  class="h-[34px] captcha"
                  height="34"
                  width="130"
                  :src="captchaPic"
                  alt="captcha"
                  @click="requestCaptcha"
                  @error="onCaptchaLoadError"
                  lazy
                  preview-disabled
                />
              </n-input-group>
            </n-form-item-row>
          </n-form>
          <n-button
            type="primary"
            @click="onVisitorLogin"
            :loading="visitorLoginBtnLoading"
            block
            strong
          >
            登录
          </n-button>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>
<style>
.captcha {
  border: #e5e7eb solid 1px;
  border-bottom-right-radius: var(--n-border-radius);
  border-top-right-radius: var(--n-border-radius);
}
</style>
<script setup lang="ts">
import { createDiscreteApi, type FormRules, type FormValidationError } from 'naive-ui'
import { onMounted, type Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { sha256 } from 'js-sha256'
import router from '@/router'
import { useCommonStore } from '@/stores'
import { authAdminLogin, authVisitorLogin, getCaptcha } from '@/apis/auth'

const route = useRoute()
const commonStore = useCommonStore()
const { baseConfig } = storeToRefs(commonStore)
const { message } = createDiscreteApi(['message'])
const defaultTab = ref()
const adminLoginBtnLoading = ref(false)
const visitorLoginBtnLoading = ref(false)
const adminFormRef = ref(null)
const visitorFormRef = ref(null)
const adminFormValue = ref({
  username: '',
  password: '',
  captcha: '',
})
const visitorFormValue = ref({
  password: null,
  captcha: '',
})

const captchaPic = ref('')
const requestCaptcha = () => {
  captchaPic.value = getCaptcha()
}

const adminFormRules: FormRules = {
  username: [
    {
      required: true,
      trigger: ['change', 'blur'],
      validator: (rule, value) => {
        if (!value || value == '') {
          return new Error('账号是必填的')
        }
        if (value.length < 8 || length > 50) {
          return new Error('请输入正确的账号')
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
          return new Error('密码是必填的')
        } else {
          const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,50}$/
          if (!passwordRegex.test(value)) {
            return new Error('请输入正确的密码')
          }
        }
      },
    },
  ],
  captcha: [
    {
      required: true,
      trigger: ['change', 'blur'],
      validator: (rule, value) => {
        if (!value || value == '') {
          return new Error('验证码是必填的')
        }
        if (value.length != 6) {
          return new Error('请输入正确的验证码')
        }
      },
    },
  ],
}

const visitorFormRules: FormRules = {
  password: [
    {
      required: true,
      trigger: ['change', 'blur'],
      validator: (rule, value) => {
        if (!value || value == '') {
          return new Error('访问密码是必填的')
        }
        if (!value || value == '') {
          return new Error('游客访问密码是必填的')
        } else {
          const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/
          if (!passwordRegex.test(value)) {
            return new Error('请输入正确的访问密码')
          }
        }
      },
    },
  ],
  captcha: [
    {
      required: true,
      trigger: ['change', 'blur'],
      validator: (rule, value) => {
        if (!value || value == '') {
          return new Error('验证码是必填的')
        }
        if (value.length != 6) {
          return new Error('请输入正确的验证码')
        }
      },
    },
  ],
}

const onCaptchaLoadError = () => {
  message.error('图形验证码加载失败，请刷新重试')
}

const handleLogin = async (
  formRef: Ref,
  formValue: object,
  loginFunc: Function,
  btnLoading: Ref<boolean>,
) => {
  const loading = message.loading('正在登录...')
  btnLoading.value = true

  formRef.value?.validate(async (errors: Array<FormValidationError>) => {
    if (errors) {
      message.error(errors[0][0].message as string)
      btnLoading.value = false
      loading.destroy()
    } else {
      try {
        const data = await loginFunc(formValue)
        message.success('登录成功', { duration: 5000 })
        commonStore.setUserLogin(data)
        await router.push('/')
      } catch (error) {
        requestCaptcha()
        message.error((error as { msg: string }).msg ?? '登录失败，发生错误', { duration: 5000 })
      } finally {
        btnLoading.value = false
        loading.destroy()
      }
    }
  })
}

const onAdminLogin = (e: MouseEvent) => {
  e.preventDefault()
  handleLogin(
    adminFormRef,
    {
      ...adminFormValue.value,
      ...{ password: sha256(adminFormValue.value.password) },
    },
    authAdminLogin,
    adminLoginBtnLoading,
  )
}

const onVisitorLogin = (e: MouseEvent) => {
  e.preventDefault()
  if (!baseConfig.value?.visitor) return
  if (!commonStore.baseConfig?.visitor_password) {
    if (visitorFormValue.value.password == '') {
      visitorFormValue.value.password = null
    }
  }
  handleLogin(visitorFormRef, visitorFormValue, authVisitorLogin, visitorLoginBtnLoading)
}

onMounted(() => {
  requestCaptcha()
  if (route.query.type == 'visitor') {
    defaultTab.value = 'visitor'
  }
})
</script>
