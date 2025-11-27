import React from 'react'

export default function Title({title,description}) {
  return (
    <div className='text-center w-1/2 mt-6 text-slate-700'>
        <h2 className='text-3xl  lg:text-4xl font-medium'>{title}</h2>
        <p className='  mt-4'> {description}</p>
    </div>
  )
}
