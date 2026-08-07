import { ChatListPage } from './pages/ChatListPage'
import { ChatRoomPage } from './pages/ChatRoomPage'
import type { OaModuleDefinition } from './types'

export const chatModule: OaModuleDefinition = {
  id: 'oa-chat',
  name: '聊天',
  basePath: '/chat',
  menu: [
    { key: 'list', label: '消息列表', path: '/chat' },
  ],
  routes: [
    { index: true, element: <ChatListPage /> },
    { path: ':id', element: <ChatRoomPage /> },
  ],
}