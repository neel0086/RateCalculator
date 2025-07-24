import React from 'react'
import StartLogo from "../assets/start.png"

function Logo() {
  return (
    <div className='flex justify-center  bg-white w-100 h-screen'>
      <img src={StartLogo} className='mt-48 mb-44 '/>
      <span className='text-black'>Design by Neel</span>
    </div>
  )
}

export default Logo
