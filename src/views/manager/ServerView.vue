<template>
  <n-modal
    v-model:show="addModalVisible"
    title="添加服务器"
    preset="card"
    size="huge"
    :style="{ width: '50%' }"
  >
    <n-form ref="formRef" :model="formValue" :rules="formRules" size="small">
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
      <n-form-item path="script" label="被控安装脚本">
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
      <n-button type="primary" size="small" @click="showAddModal">添加服务器</n-button>
      <!--      <n-button size="small">删除选中</n-button>-->
    </n-space>
    <n-data-table
      :row-key="rowKey"
      :scroll-x="1800"
      :loading="tableLoading"
      :columns="columns"
      :data="tableData.data"
      :pagination="pagination"
      remote
      sticky-expanded-rows
    />
  </n-card>
</template>
<style>
ul {
  list-style-type: disc;
  margin-left: 20px;
  color: rgb(107 114 128);
}
</style>
<script setup lang="ts">
import { onMounted, ref, h, computed } from 'vue'
import requester from '@/utils/requester'
import {
  createDiscreteApi,
  type FormItemRule,
  type FormRules,
  NButton,
  NSpace,
  NTag,
  type FormInst,
} from 'naive-ui'
import type { Paginate, ServerInfoType } from '../../../types'
import RowDetails from '@/components/manager/RowDetails.vue'

const columns = [
  {
    type: 'expand',
    expandable: () => true,
    renderExpand: (rowData: ServerInfoType) => {
      return h(RowDetails, {
        server: rowData,
      })
    },
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
    title: '状态',
    key: 'status',
    sorter: 'default',
    render(rowData: ServerInfoType) {
      return rowData.status === 1
        ? h(NTag, { type: 'success' }, () => '正常')
        : h(NTag, { type: 'error' }, () => '离线')
    },
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
    render(rowData: ServerInfoType) {
      return `${rowData.cpu} 核心`
    },
  },
  {
    title: '内存',
    key: 'memory',
    render(rowData: ServerInfoType) {
      return `${rowData.memory} MB`
    },
  },
  {
    title: '磁盘',
    key: 'disk',
    render(rowData: ServerInfoType) {
      return `${rowData.disk} GB`
    },
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 135,
    render: () => {
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

const formRef = ref(<FormInst | null>null)
const tableData = ref(<Paginate<ServerInfoType[]>>{})
const tableLoading = ref(true)
const addButtonLoading = ref(false)
const addModalVisible = ref(false)
const { message } = createDiscreteApi(['message'])
const pagination = computed(() => ({
  pageSize: tableData.value.limit,
  pageSizes: [
    {
      label: '10 / 页',
      value: 10,
    },
    {
      label: '15 / 页',
      value: 15,
    },
    {
      label: '20 / 页',
      value: 20,
    },
    {
      label: '25 / 页',
      value: 25,
    },
    {
      label: '50 / 页',
      value: 50,
    },
  ],
  pageCount: tableData.value.total_page,
  page: tableData.value.current_page,
  itemCount: tableData.value.total,
  showSizePicker: true,
  onUpdatePage: (page: number) => {
    requestData(page)
  },
  onUpdatePageSize: (pageSize: number) => {
    requestData(1, pageSize)
  },
}))

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
const rowKey = (rowData: ServerInfoType) => {
  return rowData.id
}

const formValue = ref({
  name: '',
  ip: '',
  os: 'auto',
  location: '',
  script: '',
} as {
  name: string
  ip: string
  os: string
  location: string
  script?: string
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
  formRef.value?.validate(async (errors: any) => {
    if (errors) {
      message.error(`验证失败（${errors[0][0].message}）`)
      return
    } else {
      try {
        if (formValue.value.location == '') {
          formValue.value = {
            ...formValue.value,
            location: 'auto',
          }
        }
        if ('script' in formValue.value) {
          delete formValue.value.script
        }
        addButtonLoading.value = true
        const { code, msg, data }: BaseResponseType<ServerInfoType> = await requester.post(
          '/server/add',
          formValue.value,
        )
        if (code == 0) {
          message.success('添加成功')
          addModalVisible.value = false
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

const requestData = async (page: number = 1, limit: number = 10) => {
  try {
    const { code, msg, data }: BaseResponseType<Paginate<ServerInfoType[]>> = await requester.get(
      `/server/get?view=list&page=${page}&limit=${limit}`,
    )
    if (code == 0) {
      tableData.value = data
    } else {
      message.error(`拉取服务器列表失败（${msg}）`)
    }
  } catch (error) {
    message.error(`拉取服务器列表失败，发生错误`)
  } finally {
    tableLoading.value = false
  }
}

onMounted(() => {
  requestData()
})
</script>
