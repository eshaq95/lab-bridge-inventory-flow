
import React from 'react';

interface BarcodeGeneratorProps {
  code: string;
  width?: number;
  height?: number;
}

const BarcodeGenerator = ({ code, width = 200, height = 50 }: BarcodeGeneratorProps) => {
  // Simple barcode-like visualization using CSS
  const bars = code.split('').map((char, index) => {
    const charCode = char.charCodeAt(0);
    const barWidth = (charCode % 4) + 1;
    const isBlack = charCode % 2 === 0;
    
    return (
      <div
        key={index}
        className={`inline-block ${isBlack ? 'bg-black' : 'bg-white'}`}
        style={{
          width: `${barWidth * 2}px`,
          height: `${height}px`,
        }}
      />
    );
  });

  return (
    <div className="barcode-container">
      <div className="flex items-center justify-center border p-2 bg-white">
        <div className="flex">{bars}</div>
      </div>
      <div className="text-center text-xs font-mono mt-1">{code}</div>
    </div>
  );
};

export default BarcodeGenerator;
