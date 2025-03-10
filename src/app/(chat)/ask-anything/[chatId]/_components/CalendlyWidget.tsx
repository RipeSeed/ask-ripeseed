'use client'

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';

interface CalendlyWidgetProps {
  url: string;
}

export const CalendlyWidget: React.FC<CalendlyWidgetProps> = ({ url }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (url && window.Calendly && containerRef.current) {
      window.Calendly.initInlineWidget({
        url,
        parentElement: containerRef.current,
        prefill: {},
        utm: {}
      });
    }
  }, [url]);

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
      <div 
        ref={containerRef}
        className="calendly-inline-widget"
        style={{ 
          minWidth: '320px',
          height: '700px'
        }}
      />
    </>
  );
};

declare global {
  interface Window {
    Calendly?: any;
  }
}