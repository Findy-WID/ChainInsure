import React from 'react'

interface CardProps{
    title: string;
    value: number;
    total:number;
}

export function DashboardCardItem({title, value, total}:CardProps) {
  return (
    <div className='bg-[#0C0E1A] rounded-lg p-6 text-white text-center'>
        <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-4xl font-bold my-4">{value}</p>
      <p className="text-sm">out of {total}</p>

    </div>
  )
}
