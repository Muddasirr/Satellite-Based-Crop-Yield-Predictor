'use client'
import React from 'react'
import Sidebar from '../components/Sidebar'
import Chatbot from './chatbot'
import { Box } from '@mui/material'
const page = () => {
  return (
    <Box display={'flex'}>
     <Sidebar/>
     <Chatbot/>
      </Box>
  )
}

export default page