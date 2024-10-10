'use client'
import React, { useState } from "react";
import Image from "next/image";
import { FAQItem } from "./FaqItem";

interface FAQItemProps {
  question: string;
  answer: string;
}



export function Faqs() {
  const faqData: FAQItemProps[] = [
    {
      question: "How does Chain Insure protect my crypto assets?",
      answer: "Chain Insure protects crypto assets through advanced security protocols...",
    },
    {
      question: "How does staking in Chain Insure's liquidity pool work?",
      answer: "Staking in Chain Insure allows you to contribute to a liquidity pool...",
    },
    {
      question: "What are the fees associated with staking and insurance claims?",
      answer: "The fees depend on the size of your stake and the type of coverage...",
    },
    {
      question: "Can I stake multiple times in the same pool?",
      answer: "Yes, you can stake multiple times depending on the pool's staking limits...",
    },
  ];

  return (
    <section className="bg-[#F1F1F3] p-20">
      <div className="flex justify-between">
        <h2 className="text-3xl font-serif font-bold text-[#302B63] mb-8">FAQs</h2>
        <div>
          {faqData.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}


