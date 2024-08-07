import React from 'react'

const Loader = () => {
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className="border-gray-300 h-12 w-12 animate-spin rounded-full border-8 border-t-blue-600" />
    </div>
  )
}

export default Loader