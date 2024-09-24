'use client'

import { useState } from 'react'
import LeadFilter from './LeadFilter'
import MainMenuFilter from './MainMenuFilter'
 

export default function FilterChoose() {
  const [showLeadFilter, setShowLeadFilter] = useState(false)

  const handleLeadClick = () => {
    setShowLeadFilter(true)
  }

  const handleBackClick = () => {
    setShowLeadFilter(false)
  }

  return (
    // <div className="h-screen bg-gray-100 flex justify-center items-center">
    //   <div className="bg-white rounded-lg shadow-lg w-80">
        <>
        {showLeadFilter ? (
          <LeadFilter onBackClick={handleBackClick} />
        ) : (
          <MainMenuFilter onLeadClick={handleLeadClick} />
        )}
        </>
    //   </div>
    // </div>
  )
}