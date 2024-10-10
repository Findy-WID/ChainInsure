'use client'
import React, { useState } from "react";
import Image from "next/image";

interface FAQItemProps {
  question: string;
  answer: string;
}


export function FAQItem({ question, answer }: FAQItemProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
  
    function toggleOpen() {
      setIsOpen(!isOpen);
    }
  
    return (
      <div className="border-b border-gray-300 py-4">
        <div
          className="flex justify-between items-center space-x-2 cursor-pointer"
          onClick={toggleOpen}
        >
          <h3 className="text-lg font-semibold text-[#24243E]">{question}</h3>
          <button
            className="flex justify-center items-center text-white focus:outline-none"
          >
            {
              isOpen ? <Image src='/images/faq-btn-down.svg' className='rotate-180 h-8 w-8' alt='up btn' width={24} height={24}/> : <Image src='/images/faq-btn-down.svg' alt='down btn'className="h-8 w-8" width={24} height={24}/>
            }
          </button>
        </div>
        {isOpen && (
          <div className="mt-2 text-gray-600">
            <p>{answer}</p>
          </div>
        )}
      </div>
    );
  }