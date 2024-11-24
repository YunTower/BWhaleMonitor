import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCommonStore = defineStore('common', () => {
  const isInstall = ref(false)
  const setInstall = () => {
    isInstall.value = true
  }

  return { isInstall, setInstall }
})
