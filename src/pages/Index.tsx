
import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import TechStack from '../components/TechStack';
import Dashboard from '../components/Dashboard';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <Hero />
      <Features />
      <TechStack />
      <Dashboard />
      <Footer />
    </div>
  );
};

export default Index;
