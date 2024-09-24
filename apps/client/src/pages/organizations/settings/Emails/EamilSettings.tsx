 import React from 'react'
import Tabs from './components/Tabs'
import { Outlet } from 'react-router-dom'

const EamilSettings = () => {
  return (
    <>
        <Tabs />
        <Outlet />
    </>
   )
}

export default EamilSettings