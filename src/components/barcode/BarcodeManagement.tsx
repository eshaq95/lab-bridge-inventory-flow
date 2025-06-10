
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scan, Printer, Package } from 'lucide-react';
import BarcodeScanner from './BarcodeScanner';
import BarcodeLabelPrinter from './BarcodeLabelPrinter';

const BarcodeManagement = () => {
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Strekkode System</h2>
        <Button 
          onClick={() => setShowPrintDialog(true)}
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Skriv ut etiketter
        </Button>
      </div>

      <Tabs defaultValue="scanner" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scanner" className="flex items-center gap-2">
            <Scan className="h-4 w-4" />
            Skanner
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Informasjon
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scanner">
          <BarcodeScanner />
        </TabsContent>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Strekkode System Informasjon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Automatisk generering</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Nye varer får automatisk strekkode (LAB-XXXXX)</li>
                    <li>• Eksisterende varer vil få koder når de oppdateres</li>
                    <li>• Koder er unike og kan ikke dupliseres</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Støttede skannere</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• USB strekkode-skannere (anbefalt)</li>
                    <li>• Kamera-basert skanning</li>
                    <li>• Manuell innskriving av koder</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Funksjoner</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Registrer inn/ut transaksjoner</li>
                    <li>• Skriv ut etiketter for varer</li>
                    <li>• Automatisk loggføring av aktivitet</li>
                    <li>• Sanntids oppdatering av beholdning</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Tips for bruk</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Skriv ut etiketter og fest på varer/hyller</li>
                    <li>• Bruk USB-skanner for raskest registrering</li>
                    <li>• Legg til kommentarer for bedre sporing</li>
                    <li>• Kontroller beholdning etter skanning</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BarcodeLabelPrinter 
        open={showPrintDialog} 
        onOpenChange={setShowPrintDialog} 
      />
    </div>
  );
};

export default BarcodeManagement;
