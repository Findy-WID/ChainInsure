"use client";

import React from "react";
import { marqueeList } from "@/utils/marquee-content";


function Marquee () {
  
  
    return (
      <div>
        {/*forward scrolling text */}
        <div className="overflow-hidden border border-[#25275680] p-4">
        <div className="whitespace-nowrap flex space-x-4 animate-scrollForward">
          {marqueeList.concat(marqueeList).map((item, index) => (
            <React.Fragment key={index}>
              <p className="text-white">{item}</p>
              
              {index < marqueeList.length - 1 && <span className="text-blue-500">•</span>}
            </React.Fragment>
          ))}
          
        </div>
        </div>
          {/*backward scrolling text */}
        <div className="overflow-hidden border border-[#25275680] p-4">
        <div className="whitespace-nowrap flex space-x-4 animate-scroll">
          {marqueeList.concat(marqueeList).map((item, index) => (
            <React.Fragment key={index}>
              <p className="text-white">{item}</p>
              
              {index < marqueeList.length - 1 && <span className="text-blue-500">•</span>}
            </React.Fragment>
          ))}
          
        </div>
        </div>
      </div>
  
  );
}

export default Marquee;
