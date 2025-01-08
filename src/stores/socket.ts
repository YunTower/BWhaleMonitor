import { ref } from 'vue'
import { defineStore } from 'pinia'
import type webSocket from '@/utils/WebSocket'

export const useSocketStore = defineStore('socket', () => {
  const connect = ref(<null | webSocket>null)

  return {
    connect,
  }
})
