<template>
  <div>
    <AddModal :visible="addModalVisible" @close="showAddModal" />
    <EditModal :visible="editModalVisible" @close="showEditModal" />
    <n-card title="服务器管理">
      <n-space class="mb-2">
        <div class="w-full flex space-x-2">
          <n-button type="primary" size="small" @click="showAddModal">
            <n-icon :component="AddOutline" />
            添加服务器
          </n-button>
          <n-button size="small" @click="requestData(1)">
            <n-icon :component="RefreshOutline" />
          </n-button>
        </div>
        <!--      <n-button size="small">删除选中</n-button>-->
      </n-space>
      <n-data-table
        :row-props="onRowClick"
        :scroll-x="1800"
        :loading="tableLoading"
        :columns="columns"
        :data="tableData.data"
        :pagination="pagination"
        remote
        sticky-expanded-rows
      />
    </n-card>
  </div>
</template>
<style>
ul {
  list-style-type: disc;
  margin-left: 20px;
  color: rgb(107 114 128);
}

.n-data-table .n-data-table-tr:not(.n-data-table-tr--summary) > .n-data-table-td {
  background-color: #fff;
}

.n-data-table-expand {
  background-color: rgba(247, 247, 250, 1);
}

:deep(.n-card > .n-card-header) {
  margin-bottom: -55px;
}
</style>
<script setup lang="ts">
import { onMounted, ref, h, computed } from 'vue'
import { AddOutline, RefreshOutline } from '@vicons/ionicons5'
import requester from '@/utils/requester'
import { NButton, NSpace, NTag, useMessage, type FormInst, NPopconfirm } from 'naive-ui'
import type { Paginate } from '@/types/global'
import type { CpuDetails, DiskDetails, ServerInfoType } from '@/types/manager'

import { useCommonStore } from '@/stores/common'
import { storeToRefs } from 'pinia'
import { getSeverList } from '@/api/manager'
import { useRouter } from 'vue-router'
import AddModal from '@/views/manager/server/components/AddModal.vue'
import EditModal from '@/views/manager/server/components/EditModal.vue'

const router = useRouter()
const message = useMessage()
const commonStore = useCommonStore()
const { userInfo } = storeToRefs(commonStore)
const columns = [
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
    title: 'IP',
    key: 'ip',
    render(rowData: ServerInfoType) {
      return `${rowData.ip}（${rowData.location}）`
    },
  },
  {
    title: '状态',
    key: 'status',
    sorter: 'default',
    render(rowData: ServerInfoType) {
      return rowData.status === 1
        ? h(NTag, { type: 'success' }, () => '在线')
        : h(NTag, { type: 'error' }, () => '离线')
    },
  },
  {
    title: '系统',
    key: 'os',
  },
  {
    title: 'CPU',
    key: 'cpu',
    render(rowData: ServerInfoType) {
      if (rowData.cpu) {
        if (rowData.cpu.length === 1) {
          return `${rowData.cpu[0].cores} 核心`
        } else {
          let content = ''
          rowData.cpu.forEach((item: CpuDetails, index) => {
            content += `（${index}）${item.cores} 核心`
          })
          return content
        }
      } else {
        return '待同步'
      }
    },
  },
  {
    title: '内存',
    key: 'memory',
    render(rowData: ServerInfoType) {
      if (rowData.memory) {
        return `${Math.floor(rowData.memory / (1024 * 1024))} MB`
      } else {
        return '待同步'
      }
    },
  },
  {
    title: '磁盘',
    key: 'disk',
    render(rowData: ServerInfoType) {
      const disk = rowData.disk
      if (rowData.disk) {
        if (rowData.disk.length === 1) {
          return `（${disk[0].path}）${Math.floor(disk[0].used / (1024 * 1024 * 1024))} GB/${Math.floor(disk[0].total / (1024 * 1024 * 1024))} GB`
        } else {
          let content = ''
          disk.forEach((item: DiskDetails) => {
            content += `（${item.path}）${Math.floor(item.used / (1024 * 1024 * 1024))} GB/${Math.floor(item.total / (1024 * 1024 * 1024))} GB`
          })
          return content
        }
      } else {
        return '待同步'
      }
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


const tableData = ref(<Paginate<ServerInfoType[]>>{})
const tableLoading = ref(true)

const addModalVisible = ref(false)
const editModalVisible = ref(false)
const onRowClick = (row: ServerInfoType) => {
  return {
    style: 'cursor: pointer;',
    onClick: () => {
      router.push({
        name: 'manager-server-details',
        params: {
          id: row.id,
        },
      })
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

const requestData = async (page: number = 1, limit: number = 10) => {
  try {
    tableLoading.value = true
    const { code, msg, data } = await getSeverList('list', page, limit)
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
