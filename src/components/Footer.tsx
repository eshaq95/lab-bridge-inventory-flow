
import React from 'react';
import { Github, Mail, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">LabInventoryBridge</h3>
            <p className="text-gray-400 leading-relaxed">
              Open source lagerstyringssystem for moderne laboratorier. 
              Utviklet for å vise praktisk problemløsning og teknisk kompetanse.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Teknologi</h4>
            <ul className="space-y-2 text-gray-400">
              <li>React + TypeScript</li>
              <li>Supabase Backend</li>
              <li>Tailwind CSS</li>
              <li>Power BI Integration</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
            <p className="text-gray-400 mt-4 text-sm">
              Utviklet som demo for Labora AS
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 LabInventoryBridge. Open source prosjekt for utdanningsformål.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
