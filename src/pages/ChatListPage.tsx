import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../module.css'

interface ChatPreview {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread?: number
}

const mockChats: ChatPreview[] = [
  { id: '1', name: '张小明', avatar: '张', lastMessage: '好的，我马上处理', time: '10:30', unread: 2 },
  { id: '2', name: '产品讨论组', avatar: '产', lastMessage: '李经理：新版本需求文档已经更新', time: '09:45' },
  { id: '3', name: '李华', avatar: '李', lastMessage: '方案已经发到你邮箱了', time: '昨天' },
  { id: '4', name: '技术交流群', avatar: '技', lastMessage: '王工：React 19 的新特性很不错', time: '昨天', unread: 5 },
  { id: '5', name: '王芳', avatar: '王', lastMessage: '周五的会议记得参加', time: '周一' },
]

export function ChatListPage() {
  const navigate = useNavigate()
  const [chats] = useState(mockChats)

  return (
    <div className="oa-module-page">
      <h2>消息</h2>
      <p className="oa-module-page__desc">oa-chat 聊天模块</p>
      <ul className="oa-chat-list">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className="oa-chat-list__item"
            onClick={() => navigate(`/chat/${chat.id}`)}
          >
            <div className="oa-chat-list__avatar">{chat.avatar}</div>
            <div className="oa-chat-list__info">
              <div className="oa-chat-list__name">{chat.name}</div>
              <div className="oa-chat-list__preview">{chat.lastMessage}</div>
            </div>
            <div className="oa-chat-list__time">{chat.time}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}