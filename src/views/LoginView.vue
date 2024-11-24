<template>
  <div class="w-full h-full flex justify-center">
    <n-card class="max-w-[430px] max-h-[428px]">
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
                  src="/captcha.jpg"
                  alt=""
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
        <n-tab-pane name="guest" tab="访客登录">
          <n-form
            ref="guestFormRef"
            :model="guestFormValue"
            :rules="guestFormRules"
            :show-require-mark="false"
          >
            <n-form-item-row path="password" label="访问密码">
              <n-input
                type="password"
                v-model:value="guestFormValue.password"
                placeholder="请输入访问密码"
              />
            </n-form-item-row>
            <n-form-item-row path="captcha" label="验证码">
              <n-input-group>
                <n-input v-model:value="guestFormValue.captcha" placeholder="请输入验证码" />
                <n-image
                  class="h-[34px] captcha"
                  height="34"
                  width="130"
                  src="/captcha.jpg"
                  alt=""
                  @error="onCaptchaLoadError"
                  lazy
                  preview-disabled
                />
              </n-input-group>
            </n-form-item-row>
          </n-form>
          <n-button
            type="primary"
            @click="onGuestLogin"
            :loading="guestLoginBtnLoading"
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
import { onMounted, type Ref, ref } from 'vue'
import { createDiscreteApi, type FormRules } from 'naive-ui'
import { useRoute } from 'vue-router'
import requester from '@/utils/requester'
import router from '@/router'

const route = useRoute()
const { message } = createDiscreteApi(['message'])
const defaultTab = ref('admin')
const adminLoginBtnLoading = ref(false)
const guestLoginBtnLoading = ref(false)
const adminFormRef = ref(null)
const guestFormRef = ref(null)
const adminFormValue = ref({
  username: '',
  password: '',
  captcha: '',
})
const guestFormValue = ref({
  password: '',
  captcha: '',
})

const adminFormRules: FormRules = {
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

const guestFormRules: FormRules = {
  password: [
    {
      required: true,
      trigger: ['change', 'blur'],
      validator: (rule, value) => {
        if (!value || value == '') {
          return new Error('管理员密码是必填的')
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
  console.log('captcha load error')
}

const handleLogin = async (formRef: Ref, formValue: object, loginUrl: string, btnLoading: Ref<boolean>) => {
  const loading = message.loading('正在登录...')
  btnLoading.value = true

  formRef.value?.validate(async (errors) => {
    if (errors) {
      message.error(errors[0][0].message)
      btnLoading.value = false
      loading.destroy()
    } else {
      try {
        const { code, msg } = await requester.post(loginUrl, formValue.value)
        if (code === 0) {
          message.success('登录成功', { duration: 5000 })
          await router.push({ name: 'home' })
        } else {
          message.error(`登录失败（${msg}）`, { duration: 5000 })
        }
      } catch (error) {
        message.error(`登录失败，发生错误（${error.message}）`, { duration: 5000 })
      } finally {
        btnLoading.value = false
        loading.destroy()
      }
    }
  })
}

const onAdminLogin = (e: MouseEvent) => {
  e.preventDefault()
  handleLogin(adminFormRef, adminFormValue, '/auth/admin', adminLoginBtnLoading)
}

const onGuestLogin = (e: MouseEvent) => {
  e.preventDefault()
  handleLogin(guestFormRef, guestFormValue, '/auth/guest', guestLoginBtnLoading)
}

onMounted(() => {
  if (route.query.type == 'guest') {
    defaultTab.value = 'guest'
  }
})
</script>
