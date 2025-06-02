
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, BarChart3, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            LabInventoryBridge
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Profesjonelt lagersystem for laboratorier. Få full kontroll over inventar, 
            leverandører og lagertransaksjoner på én plass.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="text-lg px-8 py-6">
              Åpne Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Lagerstyring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Håndter all laboratorieutstyr og forbruksvarer med automatisk 
                lagernivå-overvåkning og varslinger.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Sanntidsanalyse</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Få innsikt i forbruksmønstre og optimaliser innkjøp med 
                detaljerte rapporter og grafer.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Leverandørstyring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Administrer leverandørforhold og bestillinger effektivt 
                med integrert kontaktinformasjon.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Klar til å komme i gang?
              </h2>
              <p className="text-gray-600 mb-6">
                Få tilgang til alle funksjoner og start lagerstyringen i dag.
              </p>
              <Link to="/dashboard">
                <Button size="lg">
                  Gå til Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
