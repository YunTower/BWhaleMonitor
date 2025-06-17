import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(createPersistedState())

export { store }

export * from './modules/common'
export * from './modules/route'
export * from './modules/socket'
export * from './modules/permission'

export default store
