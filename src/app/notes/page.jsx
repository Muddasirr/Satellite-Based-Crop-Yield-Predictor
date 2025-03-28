'use client'
import React from 'react'
import NotesMap from './NotesMap'
import { Box } from '@mui/material'
import ShowMap from '../map/showmap'
import Sidebar from '../components/Sidebar'

const page = () => {
  return (
    <Box display={'flex'}>
      <Box width={'5%'}>
      <Sidebar/>
      </Box>
      <Box width={'95%'}>
      <NotesMap/>
      </Box></Box>
  )
}

export default page