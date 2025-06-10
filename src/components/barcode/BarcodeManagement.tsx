
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Scan, Printer } from 'lucide-react';
import BarcodeScanner from './BarcodeScanner';
import BarcodeLabelPrinter from './BarcodeLabelPrinter';
import BarcodeGenerator from './BarcodeGenerator';

const BarcodeManagement = () => {
  const [activeTab, setActiveTab] = useState('scan');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Strekkode Administrasjon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="scan" className="flex items-center gap-2">
                <Scan className="h-4 w-4" />
                Skann
              </TabsTrigger>
              <TabsTrigger value="print" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Skriv ut etiketter
              </TabsTrigger>
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                Generer strekkoder
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scan" className="mt-6">
              <BarcodeScanner />
            </TabsContent>

            <TabsContent value="print" className="mt-6">
              <BarcodeLabelPrinter />
            </TabsContent>

            <TabsContent value="generate" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Generer strekkode</h3>
                <p className="text-gray-600">
                  Alle varer får automatisk generert strekkoder når de opprettes. 
                  Du kan se strekkodene i vareoversikten.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Eksempel strekkode:</h4>
                  <BarcodeGenerator code="LAB-00001" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarcodeManagement;
