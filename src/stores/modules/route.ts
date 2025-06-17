import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useRouteStore = defineStore('route', () => {
  const menuClicked = ref(localStorage.getItem('menu-clicked') ?? 'home')
  const siderClicked = ref(localStorage.getItem('side-clicked') ?? 'home')
  const setMenuClicked = (value: string) => {
    menuClicked.value = value
    localStorage.setItem('menu-clicked', value)
  }
  const setSiderClicked = (value: string) => {
    siderClicked.value = value
    localStorage.setItem('side-clicked', value)
  }

  return { menuClicked, siderClicked, setMenuClicked, setSiderClicked }
})
