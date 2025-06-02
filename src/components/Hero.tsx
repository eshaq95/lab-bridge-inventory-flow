
import React from 'react';
import { Microscope, BarChart3, Package } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <Microscope className="w-12 h-12 text-blue-200" />
            <h1 className="text-5xl font-bold">LabInventoryBridge</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            En enkel, men funksjonell open source-løsning for digital lagerstyring i laboratorier. 
            Utviklet med tanke på Labora og deres behov for å effektivisere varelager.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-blue-200" />
            <h3 className="text-xl font-semibold mb-2">Lagerstyring</h3>
            <p className="text-blue-100">Effektiv registrering og oppfølging av laboratorieartikler</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-blue-200" />
            <h3 className="text-xl font-semibold mb-2">Innsikt</h3>
            <p className="text-blue-100">Power BI-dashboard for visualisering og KPI-oppfølging</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <Microscope className="w-12 h-12 mx-auto mb-4 text-blue-200" />
            <h3 className="text-xl font-semibold mb-2">Laboratorium</h3>
            <p className="text-blue-100">Skreddersydd for norske laboratoriers behov</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
