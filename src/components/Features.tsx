
import React from 'react';
import { QrCode, TrendingDown, DollarSign, BarChart, Archive, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Archive,
      title: "Registrering av laboratorieartikler",
      description: "Enkel registrering av reagenser, flasker, utstyr og andre laboratorieartikler med komplett sporbarhet."
    },
    {
      icon: QrCode,
      title: "Strekkodegenerering (Code-128)",
      description: "Automatisk generering av strekkoder for effektiv logging og uttak av artikler."
    },
    {
      icon: TrendingDown,
      title: "Automatisk lagertrekk",
      description: "Sanntids oppdatering av beholdning ved uttak og automatisk varsling ved lavt lager."
    },
    {
      icon: DollarSign,
      title: "Prislogg for leverandører",
      description: "Historisk oppfølging av priser og leverandører for bedre innkjøpsbeslutninger."
    },
    {
      icon: BarChart,
      title: "Power BI-dashboard",
      description: "Kraftige visualiseringer av lagerstatus, forbruk og nøkkelindikatorer."
    },
    {
      icon: Users,
      title: "Lean-arbeid støtte",
      description: "Støtter digitalisering og Lean-metodikk i laboratoriedrift."
    }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">🔧 Hovedfunksjoner</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Komplett løsning for moderne laboratorium-lagerstyring
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-blue-50 to-slate-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
