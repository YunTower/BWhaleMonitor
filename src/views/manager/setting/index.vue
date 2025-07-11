<template>
  <n-card title="系统设置">
    <n-tabs type="line" default-value="baseSetting" @update:value="handleTabUpdate">
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
            <n-button style="margin-left: 5px" @click="EditUserNameModalClose">修改</n-button>
          </n-form-item>
          <n-form-item path="password" label="管理员密码">
            <n-input
              v-model:value="formValue.password"
              :disabled="adminPasswordDisabled"
              placeholder="密码不少于6位"
            />
            <n-button style="margin-left: 5px" @click="EditPasswordModalClose">修改</n-button>
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
        <div class="space-y-4">
          <n-descriptions label-placement="left" title="系统信息" :column="1">
            <n-descriptions-item label="名称">
              蓝鲸服务器探针（{{ systemInfo.title }}）
            </n-descriptions-item>
            <n-descriptions-item label="版本"> {{ systemInfo.version }}</n-descriptions-item>
            <n-descriptions-item label="系统"> {{ systemInfo.os }}</n-descriptions-item>
            <n-descriptions-item label="PHP"> {{ systemInfo.php }}</n-descriptions-item>
            <n-descriptions-item label="HTTP API">
              <code> {{ systemInfo.http_api }}</code>
            </n-descriptions-item>
            <n-descriptions-item label="WebSocket API">
              <code> {{ systemInfo.websocket_api }}</code>
            </n-descriptions-item>
          </n-descriptions>
          <div class="mb-1">
            <n-descriptions label-placement="left" title="版本信息" :column="1">
              <n-descriptions-item label="当前版本"> {{ systemInfo.version }}</n-descriptions-item>
              <n-descriptions-item label="最新版本"> {{ newVersion }}</n-descriptions-item>
            </n-descriptions>
          </div>
          <n-space>
            <n-button type="primary" size="small">检查更新</n-button>
            <n-button size="small">立即更新</n-button>
          </n-space>
          <n-collapse class="mt-2" default-expanded-names="1" accordion>
            <n-collapse-item title="更新详情" name="1">
              <ul class="overflow-y-scroll h-[300px]">
                <li>版本信息</li>
                <li>版本信息</li>
                <li>版本信息</li>
                <li>版本信息</li>
                <li>版本信息</li>
                <li>版本信息</li>
                <li>版本信息</li>
                <li>版本信息</li>
                <li>版本信息</li>
                <li>版本信息</li>
                <li>版本信息</li>
                <li>版本信息</li>
                <li>版本信息</li>
                <li>版本信息</li>
                <li>版本信息</li>
                <li>版本信息</li>
                <li>版本信息</li>
              </ul>
            </n-collapse-item>
          </n-collapse>
        </div>
      </n-tab-pane>
    </n-tabs>
  </n-card>
  <EditUserName
    :show-modal="showEditUserNameModal"
    @edit-success="EditUserNameSuccess"
    @close="EditUserNameModalClose"
  />
  <EditPassword
    :show-modal="showEditPasswordModal"
    @edit-success="EditPasswordModalClose"
    @close="EditPasswordModalClose"
  />
</template>
<style>
.n-descriptions,
.n-descriptions-table-wrapper,
.n-descriptions-table,
.n-descriptions-table-row,
.n-descriptions-table-content {
  padding: 0;
}
</style>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { createDiscreteApi, type FormInst, type FormRules } from 'naive-ui'
import requester from '@/utils/requester'
import { useCommonStore } from '@/stores/common'
import type { BaseResponseType } from '@/types/global'
import type { systemInfo } from '@/types/manager'
import type { systemConfigType } from '@/types/config'
import EditUserName from '@/views/manager/setting/components/user/EditUserName.vue'
import EditPassword from '@/views/manager/setting/components/user/EditPassword.vue'
import { getConfig, getSysInfo } from '@/apis/config'

const { message } = createDiscreteApi(['message'])
const commonStore = useCommonStore()
const newVersion = ref('获取中')
const systemInfo = ref(<systemInfo>{})
const formRef = ref<FormInst | null>(null)
const formValue = ref(<
  {
    interval: number
    visitor: boolean | string
    visitor_password?: boolean | string | undefined
    title: string
    username?: string
    password?: string
  }
>{
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
}
const showVisitorPassword = ref(false)
const adminAccountDisabled = ref(true)
const adminPasswordDisabled = ref(true)
const submitButtonLoading = ref(false)
const showEditUserNameModal = ref(false)
const showEditPasswordModal = ref(false)

const onVisitorUpdate = (value: boolean) => {
  showVisitorPassword.value = value
}

const EditUserNameSuccess = (newValue: string) => {
  formValue.value.username = newValue
  commonStore.setUserLogin({ ...commonStore.userInfo, ...{ username: newValue } })
  EditUserNameModalClose()
}

const EditUserNameModalClose = () => {
  showEditUserNameModal.value = !showEditUserNameModal.value
}

const EditPasswordModalClose = () => {
  showEditPasswordModal.value = !showEditPasswordModal.value
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
        if ('password' in formValue.value) {
          delete formValue.value?.password
        }
        if ('username' in formValue.value) {
          delete formValue.value?.username
        }

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/
        console.log(formValue.value?.visitor_password)
        console.log(
          formValue.value.visitor &&
            formValue.value?.visitor_password !== '' &&
            !passwordRegex.test(formValue.value?.visitor_password),
        )
        if (
          formValue.value.visitor &&
          formValue.value?.visitor_password !== '' &&
          !passwordRegex.test(formValue.value?.visitor_password)
        ) {
          message.error('访问密码至少包含字母和数字且不少于6位')
          return
        }
        if (formValue.value.visitor_password == '') {
          delete formValue.value.visitor_password
        }
        const { code, msg } = await requester.post('/config/save', formValue.value)
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

const handleTabUpdate = async (value: string) => {
  console.log(value)
  if (value == 'about') {
    const { code, msg, data } = await getSysInfo()
    if (code == 0) {
      systemInfo.value = data
    } else {
      message.error(`系统信息获取失败（${msg}）`)
    }
  }
}

onMounted(async () => {
  const { code, msg, data } = await getConfig([
    'title',
    'interval',
    'visitor',
    'visitor_password',
    'username',
    'password',
  ])
  if (code == 0) {
    formValue.value = {
      ...data,
      ...{
        visitor_password: data.visitor_password || '',
        interval: parseInt(data.interval as string),
      },
    }
  } else {
    message.error(`拉取设置失败（${msg}）`)
  }
})
</script>
