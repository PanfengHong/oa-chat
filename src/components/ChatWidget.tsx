import { useRef, useState, useEffect, useCallback } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import '../module.css'

const DEFAULT_WIDTH = 820
const DEFAULT_HEIGHT = 600
const MIN_WIDTH = 480
const MIN_HEIGHT = 360

type ResizeDir = 'left' | 'top' | 'corner'

interface Contact {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread?: number
  online?: boolean
}

interface Message {
  id: string
  sender: string
  avatar: string
  content: string
  time: string
  self?: boolean
}

const mockContacts: Contact[] = [
  { id: '1', name: '张小明', avatar: '张', lastMessage: '好的，我马上处理', time: '10:30', unread: 2, online: true },
  { id: '2', name: '产品讨论组', avatar: '产', lastMessage: '李经理：新版本需求已更新', time: '09:45' },
  { id: '3', name: '李华', avatar: '李', lastMessage: '方案已经发到你邮箱了', time: '昨天', online: true },
  { id: '4', name: '技术交流群', avatar: '技', lastMessage: 'React 19 的新特性很不错', time: '昨天', unread: 5 },
  { id: '5', name: '王芳', avatar: '王', lastMessage: '周五的会议记得参加', time: '周一' },
]

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: 'm1', sender: '张小明', avatar: '张', content: '你好，关于昨天说的那个需求', time: '10:25' },
    { id: 'm2', sender: '我', avatar: '我', content: '你好，我正在准备相关的技术方案', time: '10:26', self: true },
    { id: 'm3', sender: '张小明', avatar: '张', content: '好的，我这边的文档已经更新了', time: '10:28' },
    { id: 'm4', sender: '我', avatar: '我', content: '收到，我马上处理', time: '10:30', self: true },
  ],
  '2': [
    { id: 'm5', sender: '李经理', avatar: '李', content: '大家好，新版本需求文档已更新', time: '09:40' },
    { id: 'm6', sender: '李经理', avatar: '李', content: '请相关同学尽快熟悉一下', time: '09:45' },
  ],
  '3': [
    { id: 'm7', sender: '李华', avatar: '李', content: '方案已经发到你邮箱了', time: '昨天 16:20' },
  ],
  '4': [
    { id: 'm8', sender: '王工', avatar: '王', content: 'React 19 的新特性很不错', time: '昨天 14:00' },
    { id: 'm9', sender: '赵工', avatar: '赵', content: '是的，Server Components 让开发体验提升很多', time: '昨天 14:05' },
  ],
  '5': [
    { id: 'm10', sender: '王芳', avatar: '王', content: '周五的会议记得参加', time: '周一 17:00' },
  ],
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(mockMessages)
  const [input, setInput] = useState('')
  const [size, setSize] = useState({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const resizeRef = useRef<{
    dir: ResizeDir
    startX: number
    startY: number
    startWidth: number
    startHeight: number
  } | null>(null)

  const startResize = useCallback(
    (dir: ResizeDir) => (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      resizeRef.current = {
        dir,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: size.width,
        startHeight: size.height,
      }
      document.body.style.userSelect = 'none'
      document.body.style.cursor =
        dir === 'corner' ? 'nwse-resize' : dir === 'left' ? 'ew-resize' : 'ns-resize'
    },
    [size.width, size.height],
  )

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const st = resizeRef.current
      if (!st) return
      const maxWidth = window.innerWidth - 48
      const maxHeight = window.innerHeight - 96
      let nextWidth = st.startWidth
      let nextHeight = st.startHeight
      if (st.dir === 'left' || st.dir === 'corner') {
        nextWidth = st.startWidth - (e.clientX - st.startX)
        nextWidth = Math.min(Math.max(nextWidth, MIN_WIDTH), maxWidth)
      }
      if (st.dir === 'top' || st.dir === 'corner') {
        nextHeight = st.startHeight - (e.clientY - st.startY)
        nextHeight = Math.min(Math.max(nextHeight, MIN_HEIGHT), maxHeight)
      }
      setSize({ width: nextWidth, height: nextHeight })
    }
    const handleUp = () => {
      if (resizeRef.current) {
        resizeRef.current = null
        document.body.style.userSelect = ''
        document.body.style.cursor = ''
      }
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [])

  const totalUnread = contacts.reduce((sum, c) => sum + (c.unread ?? 0), 0)
  const activeContact = activeId ? contacts.find((c) => c.id === activeId) : undefined
  const messages = activeId ? messagesMap[activeId] ?? [] : []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, activeId])

  const handleSend = () => {
    const text = input.trim()
    if (!text || !activeId) return
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const newMsg: Message = {
      id: `w-${Date.now()}`,
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
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, unread: 0 } : c)),
    )
  }

  return (
    <div className="oa-chat-widget">
      {!open && (
        <button
          className="oa-chat-widget__fab"
          onClick={() => setOpen(true)}
          aria-label="打开聊天"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 11.5C21 16.152 16.522 20 11 20C9.75 20 8.577 19.77 7.5 19.345L3 20.5L4.155 16.155C3.435 15.03 3 13.805 3 12.5C3 7.848 7.478 4 13 4C18.522 4 21 7.848 21 11.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {totalUnread > 0 && (
            <span className="oa-chat-widget__badge">{totalUnread > 99 ? '99+' : totalUnread}</span>
          )}
        </button>
      )}

      {open && (
        <div
          className="oa-chat-widget__panel"
          style={{ width: size.width, height: size.height }}
        >
          <div
            className="oa-chat-widget__resize oa-chat-widget__resize--left"
            onMouseDown={startResize('left')}
          />
          <div
            className="oa-chat-widget__resize oa-chat-widget__resize--top"
            onMouseDown={startResize('top')}
          />
          <div
            className="oa-chat-widget__resize oa-chat-widget__resize--corner"
            onMouseDown={startResize('corner')}
          />
          <div className="oa-chat-widget__header">
            <div className="oa-chat-widget__title">聊天</div>
            <button
              className="oa-chat-widget__icon-btn"
              onClick={() => setOpen(false)}
              aria-label="关闭"
            >
              <CloseOutlined />
            </button>
          </div>

          <div className="oa-chat-widget__body">
            <aside className="oa-chat-widget__sidebar">
              <div className="oa-chat-widget__sidebar-header">最近会话</div>
              <ul className="oa-chat-widget__sidebar-list">
                {contacts.map((c) => (
                  <li
                    key={c.id}
                    className={`oa-chat-widget__sidebar-item ${c.id === activeId ? 'oa-chat-widget__sidebar-item--active' : ''}`}
                    onClick={() => handleSelect(c.id)}
                  >
                    <div className="oa-chat-widget__sidebar-avatar">{c.avatar}</div>
                    <div className="oa-chat-widget__sidebar-info">
                      <div className="oa-chat-widget__sidebar-name">
                        {c.name}
                        {c.online && <span className="oa-chat-widget__online-dot" />}
                      </div>
                      <div className="oa-chat-widget__sidebar-preview">{c.lastMessage}</div>
                    </div>
                    <div className="oa-chat-widget__sidebar-right">
                      <span className="oa-chat-widget__sidebar-time">{c.time}</span>
                      {c.unread ? (
                        <span className="oa-chat-widget__sidebar-badge">
                          {c.unread > 99 ? '99+' : c.unread}
                        </span>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </aside>

            <section className="oa-chat-widget__main">
              {activeId && activeContact ? (
                <>
                  <div className="oa-chat-widget__main-header">
                    <div className="oa-chat-widget__main-title">{activeContact.name}</div>
                    <div className="oa-chat-widget__main-status">
                      {activeContact.online ? (
                        <><span className="oa-chat-widget__online-dot" /> 在线</>
                      ) : (
                        <span style={{ color: '#bfbfbf' }}>离线</span>
                      )}
                    </div>
                  </div>

                  <div className="oa-chat-widget__messages">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`oa-chat-widget__msg ${msg.self ? 'oa-chat-widget__msg--self' : ''}`}
                      >
                        <div className="oa-chat-widget__msg-avatar">{msg.avatar}</div>
                        <div className="oa-chat-widget__msg-body">
                          <div className="oa-chat-widget__msg-meta">
                            <span>{msg.sender}</span>
                            <span>{msg.time}</span>
                          </div>
                          <div className="oa-chat-widget__msg-bubble">{msg.content}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="oa-chat-widget__input">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSend()
                      }}
                      placeholder="输入消息，Enter 发送"
                    />
                    <button
                      className="oa-chat-widget__send"
                      onClick={handleSend}
                      disabled={!input.trim()}
                      aria-label="发送"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <div className="oa-chat-widget__empty">
                  <div className="oa-chat-widget__empty-icon">💬</div>
                  <div>选择一个会话开始聊天</div>
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
