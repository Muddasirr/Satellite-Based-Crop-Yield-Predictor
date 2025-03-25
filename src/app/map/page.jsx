'use client'
import React from 'react'
import ShowMap from './showmap'
import Sidebar from '../components/Sidebar'
import { Box } from '@mui/material'
import FieldManagement from '../components/FIeldManagament'
const page = () => {
  return (
    <Box display={'flex'}>
      <Box width={'5%'}>
      <Sidebar/>
      </Box>
      <Box width={'45%'}>
      <FieldManagement/>
      </Box>
      <Box width={'50%'}>
      <ShowMap/>
      </Box></Box>
  )
}

export default page