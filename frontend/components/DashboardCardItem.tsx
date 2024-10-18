import React from 'react'

interface CardProps{
    title: string;
    value: number | string;
    total:number | string;
}

export function DashboardCardItem({title, value, total}:CardProps) {
  return (
    <div className='bg-[#0C0E1A] border border-blue-500 shadow-md rounded-lg p-2 text-white text-center'>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-2xl font-bold my-4">{value}</p>
      <p className="text-sm">out of {total}</p>

    </div>
  )
}
