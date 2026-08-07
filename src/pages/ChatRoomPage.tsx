import { useState } from 'react'
import { useParams } from 'react-router-dom'
import '../module.css'

interface Message {
  id: string
  sender: string
  avatar: string
  content: string
  time: string
  self?: boolean
}

interface Contact {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  online?: boolean
}

const mockContacts: Contact[] = [
  { id: '1', name: '张小明', avatar: '张', lastMessage: '好的，我马上处理', time: '10:30', online: true },
  { id: '2', name: '产品讨论组', avatar: '产', lastMessage: '李经理：新版本需求文档已经更新', time: '09:45' },
  { id: '3', name: '李华', avatar: '李', lastMessage: '方案已经发到你邮箱了', time: '昨天', online: true },
  { id: '4', name: '技术交流群', avatar: '技', lastMessage: '王工：React 19 的新特性很不错', time: '昨天' },
  { id: '5', name: '王芳', avatar: '王', lastMessage: '周五的会议记得参加', time: '周一' },
]

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: 'm1', sender: '张小明', avatar: '张', content: '你好，关于昨天说的那个需求', time: '10:25' },
    { id: 'm2', sender: '我', avatar: '我', content: '你好，我正在准备相关的技术方案', time: '10:26', self: true },
    { id: 'm3', sender: '张小明', avatar: '张', content: '好的，我这边的文档已经更新了，你看下', time: '10:28' },
    { id: 'm4', sender: '我', avatar: '我', content: '收到，我马上处理', time: '10:30', self: true },
  ],
  '2': [
    { id: 'm5', sender: '李经理', avatar: '李', content: '大家好，新版本的需求文档已经更新', time: '09:40' },
    { id: 'm6', sender: '李经理', avatar: '李', content: '请相关同学尽快熟悉一下', time: '09:45' },
  ],
  '3': [
    { id: 'm7', sender: '李华', avatar: '李', content: '方案已经发到你邮箱了', time: '昨天 16:20' },
    { id: 'm8', sender: '我', avatar: '我', content: '收到，我看下', time: '昨天 16:25', self: true },
  ],
  '4': [
    { id: 'm9', sender: '王工', avatar: '王', content: 'React 19 的新特性很不错，大家可以尝试一下', time: '昨天 14:00' },
    { id: 'm10', sender: '赵工', avatar: '赵', content: '是的，Server Components 让开发体验提升很多', time: '昨天 14:05' },
  ],
  '5': [
    { id: 'm11', sender: '王芳', avatar: '王', content: '周五的会议记得参加', time: '周一 17:00' },
  ],
}

export function ChatRoomPage() {
  const { id } = useParams<{ id: string }>()
  const [contacts, setContacts] = useState(mockContacts)
  const [activeId, setActiveId] = useState(id ?? '1')
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(mockMessages)
  const [input, setInput] = useState('')

  const activeContact = contacts.find((c) => c.id === activeId)
  const messages = messagesMap[activeId] ?? []

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: '我',
      avatar: '我',
      content: text,
      time,
      self: true,
    }
    setMessagesMap((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), newMsg],
    }))
    setContacts((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, lastMessage: text, time } : c)),
    )
    setInput('')
  }

  const handleSelect = (contactId: string) => {
    setActiveId(contactId)
  }

  return (
    <div className="oa-module-page">
      <h2>聊天</h2>
      <p className="oa-module-page__desc">oa-chat 聊天模块</p>
      <div className="oa-chat-layout">
        <aside className="oa-chat-sidebar">
          <div className="oa-chat-sidebar__header">最近会话</div>
          <ul className="oa-chat-sidebar__list">
            {contacts.map((c) => (
              <li
                key={c.id}
                className={`oa-chat-sidebar__item ${c.id === activeId ? 'oa-chat-sidebar__item--active' : ''}`}
                onClick={() => handleSelect(c.id)}
              >
                <div className="oa-chat-sidebar__avatar">{c.avatar}</div>
                <div className="oa-chat-sidebar__info">
                  <div className="oa-chat-sidebar__name">
                    {c.name}
                    {c.online && <span className="oa-chat-online-dot" />}
                  </div>
                  <div className="oa-chat-sidebar__preview">{c.lastMessage}</div>
                </div>
                <div className="oa-chat-sidebar__time">{c.time}</div>
              </li>
            ))}
          </ul>
        </aside>

        <section className="oa-chat-main">
          <div className="oa-chat-main__header">
            <div className="oa-chat-main__title">
              {activeContact?.name ?? '未知会话'}
            </div>
          </div>

          {messages.length > 0 ? (
            <div className="oa-chat-main__messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`oa-chat-msg ${msg.self ? 'oa-chat-msg--self' : ''}`}
                >
                  <div className="oa-chat-msg__avatar">{msg.avatar}</div>
                  <div className="oa-chat-msg__body">
                    <div className="oa-chat-msg__meta">
                      <span>{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <div className="oa-chat-msg__bubble">{msg.content}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="oa-chat-empty">
              <div className="oa-chat-empty__icon">💬</div>
              <div>暂无消息，开始聊天吧</div>
            </div>
          )}

          <div className="oa-chat-main__input">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="输入消息，Enter 发送，Shift+Enter 换行"
              rows={1}
            />
            <button
              className="oa-chat-main__send"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              发送
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}