'use client'
import React from 'react'
import ShowMap from './showmap'

import { Box } from '@mui/material'
import FieldManagement from '../../components/FIeldManagament'
const page = () => {
  return (
    <Box display={'flex'}>
     
      
      <FieldManagement/>
      
      
      <ShowMap/>
     </Box>
  )
}

export default page