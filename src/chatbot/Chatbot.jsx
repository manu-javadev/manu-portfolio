import { Fragment, useEffect, useRef, useState } from 'react'
import Icon from '../Icon.jsx'
import { profile } from '../data.js'
import { answer, WELCOME, OPEN_EVENT } from './engine.js'
import './chatbot.css'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Renders **bold** segments.
function Rich({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>,
  )
}

function ContactCard({ question, kind }) {
  const intro = `Hi Manu, I came across your portfolio and had a question`
  const body = question ? `${intro}: "${question}"` : `${intro}.`
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent('Question from your portfolio')}&body=${encodeURIComponent(body)}`

  return (
    <div className="cb-contact">
      <p className="cb-contact-title">
        {kind === 'unknown' ? 'Ask Manu directly by email. Your question is pre-filled:' : 'Contact Manu by email:'}
      </p>
      <div className="cb-contact-actions">
        <a className="cb-action cb-action-primary" href={mailto}>
          <Icon name="mail" size={15} /> Email Manu
        </a>
      </div>
      <p className="cb-contact-meta">{profile.email}</p>
    </div>
  )
}

function BotMessage({ msg }) {
  return (
    <div className="cb-row cb-row-bot">
      <span className="cb-avatar" aria-hidden="true">
        {profile.initials}
      </span>
      <div className="cb-bubble cb-bubble-bot">
        <p>
          <Rich text={msg.text} />
        </p>
        {msg.bullets?.length > 0 && (
          <ul>
            {msg.bullets.map((b) => (
              <li key={b}>
                <Rich text={b} />
              </li>
            ))}
          </ul>
        )}
        {msg.footnote && <p className="cb-footnote">{msg.footnote}</p>}
        {msg.links?.length > 0 && (
          <div className="cb-links">
            {msg.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                {l.label} <Icon name="arrow" size={12} />
              </a>
            ))}
          </div>
        )}
        {msg.handoff && <ContactCard question={msg.question} kind={msg.handoff} />}
      </div>
    </div>
  )
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(() => [{ id: 0, from: 'bot', ...WELCOME }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const nextId = useRef(1)
  const timer = useRef(null)

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen)
      clearTimeout(timer.current)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing, open])

  const ask = (raw) => {
    const question = raw.trim()
    if (!question || typing) return
    setInput('')
    setMessages((m) => [...m, { id: nextId.current++, from: 'user', text: question }])
    setTyping(true)
    timer.current = setTimeout(
      () => {
        setMessages((m) => [...m, { id: nextId.current++, from: 'bot', question, ...answer(question) }])
        setTyping(false)
      },
      reducedMotion() ? 0 : 450,
    )
  }

  const last = messages[messages.length - 1]
  const suggestions = !typing && last.from === 'bot' ? last.suggestions || [] : []

  return (
    <>
      {open && (
        <section className="cb-panel" role="dialog" aria-modal="false" aria-label="Chat with Manu's assistant">
          <header className="cb-head">
            <span className="cb-avatar cb-avatar-lg" aria-hidden="true">
              {profile.initials}
            </span>
            <div className="cb-head-text">
              <h2>Ask about Manu</h2>
              <p>Answers from her resume · instant</p>
            </div>
            <button type="button" className="cb-close" onClick={() => setOpen(false)} aria-label="Close chat">
              <Icon name="close" size={18} />
            </button>
          </header>

          <div className="cb-messages" ref={listRef} aria-live="polite">
            {messages.map((msg) =>
              msg.from === 'user' ? (
                <div className="cb-row cb-row-user" key={msg.id}>
                  <div className="cb-bubble cb-bubble-user">{msg.text}</div>
                </div>
              ) : (
                <BotMessage msg={msg} key={msg.id} />
              ),
            )}
            {typing && (
              <div className="cb-row cb-row-bot">
                <span className="cb-avatar" aria-hidden="true">
                  {profile.initials}
                </span>
                <div className="cb-bubble cb-bubble-bot cb-typing" aria-label="Assistant is typing">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="cb-suggestions">
              {suggestions.map((s) => (
                <button type="button" key={s} onClick={() => ask(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            className="cb-form"
            onSubmit={(e) => {
              e.preventDefault()
              ask(input)
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about skills, projects, experience…"
              aria-label="Your question"
              maxLength={300}
              autoComplete="off"
            />
            <button type="submit" className="cb-send" aria-label="Send" disabled={!input.trim() || typing}>
              <Icon name="send" size={17} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className={`cb-launcher ${open ? 'cb-launcher-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : "Chat with Manu's assistant"}
        title={open ? 'Close chat' : "Chat with Manu's assistant"}
        aria-expanded={open}
      >
        <Icon name={open ? 'close' : 'bot'} size={24} />
      </button>
    </>
  )
}
