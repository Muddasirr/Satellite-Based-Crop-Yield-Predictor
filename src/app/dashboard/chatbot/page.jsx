'use client'
import React from 'react'
import styles from "./styles/chatbot.module.css"
import Chatbot from './chatbot'
const Page = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.chatbotWrapper}>
        <Chatbot />
      </div>
    </div>
  )
}

export default Page
