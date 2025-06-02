
import React from 'react';
import { Database, Zap, Globe, BarChart3 } from 'lucide-react';

const TechStack = () => {
  const technologies = [
    {
      icon: Database,
      name: "Supabase",
      description: "Database, autentisering og backend",
      color: "bg-green-100 text-green-700"
    },
    {
      icon: Zap,
      name: "React + Vite",
      description: "Frontend med Supabase-integrasjon",
      color: "bg-blue-100 text-blue-700"
    },
    {
      icon: Globe,
      name: "Lovable",
      description: "Rask og gratis hosting av webappen",
      color: "bg-purple-100 text-purple-700"
    },
    {
      icon: BarChart3,
      name: "Power BI",
      description: "Innsiktsdashbord med kobling til Supabase-data",
      color: "bg-yellow-100 text-yellow-700"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-r from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">💻 Teknologi</h2>
          <p className="text-xl text-gray-600">
            Moderne teknologi-stack for skalerbar og pålitelig drift
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-center"
            >
              <div className={`inline-flex p-3 rounded-full ${tech.color} mb-4`}>
                <tech.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{tech.name}</h3>
              <p className="text-gray-600 text-sm">{tech.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-white p-8 rounded-xl shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">🎯 Prosjektmål</h3>
          <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto leading-relaxed">
            Å vise hvordan en trainee med IT-bakgrunn raskt kan utvikle og implementere en 
            praktisk, skalerbar løsning som støtter digitalisering og Lean-arbeid i laboratorier som Labora.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
