'use client'
import React from 'react'
import ShowMap from './showmap'
import Sidebar from '../components/Sidebar'
import { Box } from '@mui/material'
import FieldManagement from '../components/FIeldManagament'
const page = () => {
  return (
    <Box display={'flex'}>
      <Box width={'5vw'}>
      <Sidebar/>
      </Box>
      <Box width={'35vw'}>
      <FieldManagement/>
      </Box>
      <ShowMap/></Box>
  )
}

export default page