<template>
  <n-modal
    v-model:show="addModalVisible"
    title="添加服务器"
    preset="card"
    size="huge"
    :style="{ width: '50%' }"
  >
    <n-form ref="addFormRef" :model="addFormValue" :rules="addFormRules" size="small">
      <n-form-item path="name" label="服务器名称">
        <n-input v-model:value="addFormValue.name" placeholder="必填，不建议太长" />
      </n-form-item>
      <n-form-item path="ip" label="服务器IPv4">
        <n-input v-model:value="addFormValue.ip" placeholder="请填写正确的服务器IPv4" />
      </n-form-item>
      <n-form-item path="os" label="服务器系统">
        <n-select v-model:value="addFormValue.os" :options="osSelectOptions" />
      </n-form-item>
      <n-form-item path="location" label="服务器位置">
        <n-input v-model:value="addFormValue.location" placeholder="留空则自动获取" />
      </n-form-item>
      <n-form-item path="script" label="被控安装脚本">
        <n-input v-model:value="addFormValue.script" type="textarea" disabled />
      </n-form-item>
      <ul class="mb-2">
        <li>请务必先在被控端执行上方的“被控安装脚本”，直至安装完成以后再点击“添加”按钮</li>
        <li>添加服务器以后，主控将会以2s/次的频率向被控发送连接请求</li>
        <li>主控共计会发送10次连接请求，若仍然无法连接将自动放弃，需要删除服务器后重新添加</li>
      </ul>
      <n-row :gutter="[0, 24]">
        <n-col :span="24">
          <div style="display: flex; justify-content: flex-end">
            <n-space>
              <n-button @click="showAddModal">取消</n-button>
              <n-popconfirm
                @positive-click="handleAddButtonClick"
                negative-text="取消"
                positive-text="确认"
              >
                <template #trigger>
                  <n-button type="primary" :loading="addButtonLoading"> 添加服务器</n-button>
                </template>
                我已确认执行被控安装脚本，并且被控端安装完成
              </n-popconfirm>
            </n-space>
          </div>
        </n-col>
      </n-row>
    </n-form>
  </n-modal>
  <n-modal
    v-model:show="editModalVisible"
    title="修改服务器"
    preset="card"
    size="huge"
    :style="{ width: '50%' }"
  >
    <n-form ref="editFormRef" :model="editFormValue" :rules="editFormRules" size="small">
      <n-form-item path="name" label="服务器名称">
        <n-input v-model:value="editFormValue.name" placeholder="必填，不建议太长" />
      </n-form-item>
      <n-form-item path="ip" label="服务器IPv4">
        <n-input v-model:value="editFormValue.ip" placeholder="请填写正确的服务器IPv4" />
      </n-form-item>
      <n-form-item path="os" label="服务器系统">
        <n-select v-model:value="editFormValue.os" :options="osSelectOptions" />
      </n-form-item>
      <n-form-item path="location" label="服务器位置">
        <n-input v-model:value="editFormValue.location" placeholder="留空则自动获取" />
      </n-form-item>
      <n-form-item path="script" label="被控安装脚本">
        <n-input v-model:value="editFormValue.script" type="textarea" disabled />
      </n-form-item>
      <n-row :gutter="[0, 24]">
        <n-col :span="24">
          <div style="display: flex; justify-content: flex-end">
            <n-space>
              <n-button @click="showEditModal">取消</n-button>
              <n-button type="primary" :loading="editButtonLoading"> 保存修改</n-button>
            </n-space>
          </div>
        </n-col>
      </n-row>
    </n-form>
  </n-modal>
  <n-card title="服务器管理">
    <n-space class="mb-2">
      <div class="w-full flex">
        <n-button type="primary" size="small" @click="showAddModal">
          <n-icon :component="AddOutline" />
          添加服务器
        </n-button>
        <n-flex justify="end" class="w-[80vw]">
          <n-button size="small" @click="requestData(1)">
            <n-icon :component="RefreshOutline" />
          </n-button>
        </n-flex>
      </div>
      <!--      <n-button size="small">删除选中</n-button>-->
    </n-space>
    <n-data-table
      :row-props="onRowClick"
      :expanded-row-keys="expandedKey"
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
import { AddOutline, RefreshOutline } from '@vicons/ionicons5'
import requester from '@/utils/requester'
import {
  createDiscreteApi,
  type FormItemRule,
  type addFormRules,
  NButton,
  NSpace,
  NTag,
  useMessage,
  type FormInst,
  NPopconfirm,
} from 'naive-ui'
import type { Paginate, ServerInfoType } from '../../../types'
import RowDetails from '@/components/manager/RowDetails.vue'

// const { message } = createDiscreteApi(['message'])
const message = useMessage()
const columns = [
  {
    type: 'expand',
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
    resizable: true,
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
    resizable: true,
  },
  {
    title: 'IP',
    key: 'ip',
    resizable: true,
  },
  {
    title: '位置',
    key: 'location',
    resizable: true,
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
    render: (rowData: ServerInfoType) => {
      return h(
        NSpace,
        {},
        {
          default: () => [
            // h(
            //   NButton,
            //   {
            //     strong: true,
            //     tertiary: true,
            //     size: 'small',
            //     type: 'error',
            //     onClick: async () => {
            //       try {
            //         const resp = await requester.delete('/server/delete/' + rowData.id)
            //         if (resp && resp.code === 0) {
            //           message.success(`服务器【${rowData.name}】删除成功`)
            //         } else {
            //
            //           message.error(`删除失败（${resp.msg}）`)
            //         }
            //       } catch (e) {
            //         console.log(e)
            //         message.error('删除失败')
            //       }
            //       window.event?.stopPropagation()
            //     },
            //   },
            //   { default: () => '删除' },
            // ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => {
                  deleteServer(rowData)
                },
                positiveText: '确认',
                negativeText: '取消',
              },
              {
                trigger: () =>
                  h(
                    NButton,
                    {
                      strong: true,
                      tertiary: true,
                      size: 'small',
                      type: 'error',
                      onClick: (event) => event.stopPropagation(),
                    },
                    { default: () => '删除' },
                  ),
                default: () =>
                  `将要删除被控【${rowData.name}（${rowData.ip}）】，删除后将会断开与被控的连接，请确认`,
              },
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

const addFormRef = ref(<FormInst | null>null)
const editFormRef = ref(<FormInst | null>null)
const tableData = ref(<Paginate<ServerInfoType[]>>{})
const tableLoading = ref(true)
const addButtonLoading = ref(false)
const editButtonLoading = ref(false)
const addModalVisible = ref(false)
const editModalVisible = ref(false)
const expandedKey = ref([])
const onRowClick = (row: ServerInfoType) => {
  return {
    style: 'cursor: pointer;',
    onClick: (event) => {
      if (expandedKey.value.includes(row.id)) {
        expandedKey.value = []
      } else {
        expandedKey.value = [row.id]
      }
    },
  }
}

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

const addFormValue = ref({
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

const addFormRules: addFormRules = {
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

const showEditModal = () => {
  editModalVisible.value = !editModalVisible.value
}

const rowKey = (rowData: ServerInfoType) => {
  return rowData.id
}

const deleteServer = async (rowData: ServerInfoType) => {
  try {
    const resp = await requester.delete('/server/delete/' + rowData.id)
    if (resp && resp.code === 0) {
      message.success(`服务器【${rowData.name}】删除成功`)
      const index = tableData.value.data.findIndex((item) => item.id === rowData.id)
      if (index !== -1) {
        tableData.value.data.splice(index, 1)
      }
    } else {
      message.error(`删除失败（${resp.msg}）`)
    }
  } catch (e) {
    console.log(e)
    message.error('删除失败')
  }
}

const handleAddButtonClick = (e: MouseEvent) => {
  e.preventDefault()
  addFormRef.value?.validate(async (errors: any) => {
    if (errors) {
      message.error(`验证失败（${errors[0][0].message}）`)
      return
    } else {
      try {
        if (addFormValue.value.location == '') {
          addFormValue.value = {
            ...addFormValue.value,
            location: 'auto',
          }
        }
        if ('script' in addFormValue.value) {
          delete addFormValue.value.script
        }
        addButtonLoading.value = true
        const { code, msg, data }: BaseResponseType<ServerInfoType> = await requester.post(
          '/server/add',
          addFormValue.value,
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
    tableLoading.value = true
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
