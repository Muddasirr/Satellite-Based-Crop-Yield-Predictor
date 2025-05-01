"use client"
import { useState, useRef, useEffect } from "react"
import styles from "./styles/chatbot.module.css"

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: "system", content: "How can I assist you with your agriculture-related query?" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch(`/api/chat?question=${encodeURIComponent(input)}`)
      const data = await res.json()
      const botMessage = { role: "bot", content: data.response }
      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Oops! Something went wrong." }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h1 className={styles.chatTitle}>🌾 AgriBot</h1>
      </div>

      <div className={styles.messagesContainer}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.messageWrapper} ${
              msg.role === "user"
                ? styles.userMessageWrapper
                : msg.role === "system"
                ? styles.systemMessageWrapper
                : styles.botMessageWrapper
            }`}
          >
            {msg.role !== "system" && (
              <div className={styles.avatarContainer}>
                {msg.role === "user" ? (
                  <div className={styles.userAvatar}>You</div>
                ) : (
                  <div className={styles.botAvatar}>🌱</div>
                )}
              </div>
            )}
            <div
              className={`${styles.message} ${
                msg.role === "user"
                  ? styles.userMessage
                  : msg.role === "system"
                  ? styles.systemMessage
                  : styles.botMessage
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className={`${styles.messageWrapper} ${styles.botMessageWrapper}`}>
            <div className={styles.avatarContainer}>
              <div className={styles.botAvatar}>🌱</div>
            </div>
            <div className={`${styles.message} ${styles.botMessage}`}>
              <div className={styles.loadingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          ref={inputRef}
          type="text"
          className={styles.inputField}
          placeholder="Ask about crop yield, fertilizers, diseases..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className={styles.sendButton} disabled={loading}>
          ➤
        </button>
      </form>
    </div>
  )
}

export default Chatbot
