<template>
  <n-modal
    v-model:show="addModalVisible"
    title="添加服务器"
    preset="card"
    size="huge"
    :style="{ width: '50%' }"
  >
    <n-form ref="formRef" :model="formValue" :rules="formRules">
      <n-form-item path="name" label="服务器名称">
        <n-input v-model:value="formValue.name" placeholder="必填，不建议太长" />
      </n-form-item>
      <n-form-item path="ip" label="服务器IP">
        <n-input v-model:value="formValue.ip" placeholder="请填写正确的服务器IP" />
      </n-form-item>
      <n-form-item path="os" label="服务器系统">
        <n-select v-model:value="formValue.os" :options="osSelectOptions" />
      </n-form-item>
      <n-form-item path="location" label="服务器位置">
        <n-input v-model:value="formValue.location" placeholder="留空则自动获取" />
      </n-form-item>
      <n-form-item path="script" label="探针安装脚本">
        <n-input v-model:value="formValue.script" type="textarea" disabled />
      </n-form-item>
      <n-row :gutter="[0, 24]">
        <n-col :span="24">
          <div style="display: flex; justify-content: flex-end">
            <n-space>
              <n-button @click="showAddModal">取消</n-button>
              <n-button type="primary" @click="handleSubmitButtonClick" :loading="addButtonLoading">
                添加
              </n-button>
            </n-space>
          </div>
        </n-col>
      </n-row>
    </n-form>
  </n-modal>
  <n-card title="服务器管理">
    <n-space class="mb-2">
      <n-button type="primary" @click="showAddModal">添加</n-button>
      <!--      <n-button>删除选中</n-button>-->
    </n-space>
    <n-data-table
      :loading="tableLoading"
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
    />
  </n-card>
</template>
<script setup lang="ts">
import { onMounted, ref, h } from 'vue'
import requester from '@/utils/requester'
import {
  createDiscreteApi,
  type FormItemRule,
  type FormRules,
  NButton,
  NSpace,
  NTag,
} from 'naive-ui'

interface ServerInfo {
  id: number
  name: string
  os: string
  ip: string
  location: string
  cpu: number
  memory: number
  disk: number
  network: string
  status: number
}

const pagination = {
  pageSize: 10,
}

const columns = [
  {
    type: 'selection',
  },
  {
    title: '#',
    key: 'id',
    sorter: 'default',
  },
  {
    title: '名称',
    key: 'name',
  },
  {
    title: '系统',
    key: 'os',
  },
  {
    title: 'IP',
    key: 'ip',
  },
  {
    title: '位置',
    key: 'location',
  },
  {
    title: 'CPU',
    key: 'cpu',
  },
  {
    title: '内存',
    key: 'memory',
  },
  {
    title: '硬盘',
    key: 'disk',
  },
  {
    title: '上传/下载',
    key: 'network',
  },
  {
    title: '状态',
    key: 'status',
    sorter: 'default',
    render(row) {
      if (row.status == 1) {
        return h(NTag, { type: 'success' }, { default: () => '正常' })
      } else {
        return h(NTag, { type: 'error' }, { default: () => '离线' })
      }
    },
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    render() {
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              {
                strong: true,
                tertiary: true,
                size: 'small',
                type: 'error',
              },
              { default: () => '删除' },
            ),
            h(
              NButton,
              {
                strong: true,
                tertiary: true,
                size: 'small',
              },
              { default: () => '修改' },
            ),
          ],
        },
      )
    },
  },
]

const formRef = ref(null)
const tableData = ref([] as ServerInfo)
const tableLoading = ref(true)
const addButtonLoading = ref(false)
const addModalVisible = ref(false)
const { message } = createDiscreteApi(['message'])

const osSelectOptions = [
  {
    label: '自动获取',
    value: 'auto',
  },
  {
    label: 'Windows Server',
    value: 'Windows Server',
  },
  {
    label: 'CentOS',
    value: 'CentOS',
  },
  {
    label: 'Ubuntu',
    value: 'Ubuntu',
  },
  {
    label: 'Debian',
    value: 'Debian',
  },
  {
    label: 'Alibaba Cloud Linux',
    value: 'Alibaba Cloud Linux',
  },
  {
    label: 'TencentOS',
    value: 'TencentOS',
  },
  {
    label: 'Red Hat',
    value: 'Red Hat',
  },
  {
    label: 'Other',
    value: 'Other',
  },
]

const formValue = ref({
  name: '',
  ip: '',
  os: 'auto',
  location: '',
  script: '',
})
const formRules: FormRules = {
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

const showAddModal = () => {
  addModalVisible.value = !addModalVisible.value
}

const handleSubmitButtonClick = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (errors) {
      message.error(`验证失败（${errors[0][0].message}）`)
      return
    }
    try {
      addButtonLoading.value = true
      const resp = await requester.get('/server/add')
      if (resp.code == 0) {
        message.success('添加成功')
        addModalVisible.value = false
      } else {
        message.error(`添加失败（${resp.message}）`)
      }
    } catch (error) {
      message.error(`服务器信息添加失败，发生错误（${error.message}）`)
    } finally {
      addButtonLoading.value = false
    }
  })
}

onMounted(async () => {
  try {
    const resp = await requester.get('/data/list.json')
    if (resp.code == 0) {
      tableData.value = resp.data
    } else {
      message.error(`拉取服务器列表失败（${resp.message}）`)
    }
  } catch (error) {
    message.error(`拉取服务器列表失败，发生错误（${error.message}）`)
  } finally {
    tableLoading.value = false
  }
})
</script>
