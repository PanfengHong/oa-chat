import type { OaModuleDefinition } from './types'

// 聊天功能通过悬浮入口 ChatWidget 提供，不再注册为路由模块
export const chatModule: OaModuleDefinition = {
  id: 'oa-chat',
  name: '聊天',
  basePath: '/chat',
  menu: [],
  routes: [],
}
