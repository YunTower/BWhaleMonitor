import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { baseConfigType, userType } from '@/../types'

export const useCommonStore = defineStore('common', () => {
  const isInstall = ref(false)
  const isUserLogin = ref(false)
  const userInfo = ref(<userType | null>{})
  const baseConfig = ref(<baseConfigType>{})

  const setBaseConfig = (config: baseConfigType) => {
    baseConfig.value = config
  }

  const setInstall = () => {
    isInstall.value = true
  }

  const setUserLogout = () => {
    userInfo.value = null
    isUserLogin.value = false
  }

  const setUserLogin = (user: any) => {
    userInfo.value = user
    isUserLogin.value = true
  }

  return {
    isInstall,
    userInfo,
    baseConfig,
    setInstall,
    setBaseConfig,
    isUserLogin,
    setUserLogin,
    setUserLogout,
  }
})
