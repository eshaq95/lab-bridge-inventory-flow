
import React from 'react';
import { Package, AlertTriangle, TrendingUp, Users } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: "Totalt artikler", value: "1,247", icon: Package, color: "text-blue-600" },
    { label: "Lavt lager", value: "23", icon: AlertTriangle, color: "text-red-600" },
    { label: "Månedens forbruk", value: "342", icon: TrendingUp, color: "text-green-600" },
    { label: "Aktive brukere", value: "15", icon: Users, color: "text-purple-600" }
  ];

  const recentItems = [
    { name: "Reagensglass 15ml", qty: "45 stk", status: "På lager", code: "RG-15-001" },
    { name: "Natriumklorid 99%", qty: "2.5 kg", status: "Lavt lager", code: "NC-99-002" },
    { name: "Pipettespiss 1000µl", qty: "230 stk", status: "På lager", code: "PP-1K-003" },
    { name: "Etanol 96%", qty: "0.8 L", status: "Bestill", code: "ET-96-004" }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">📊 Dashboard Preview</h2>
          <p className="text-xl text-gray-600">
            Sanntids oversikt over laboratorielageret
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-2xl shadow-lg">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>
          
          {/* Recent Items Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Siste lageraktivitet</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Artikkel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Beholdning
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Artikkelkode
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.qty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'På lager' ? 'bg-green-100 text-green-800' :
                          item.status === 'Lavt lager' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                        {item.code}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
