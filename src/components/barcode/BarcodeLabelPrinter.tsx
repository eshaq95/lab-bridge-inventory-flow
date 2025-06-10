
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Printer, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BarcodeGenerator from './BarcodeGenerator';

interface Item {
  id: number;
  navn: string;
  strekkode: string | null;
  kategori: string | null;
}

const BarcodeLabelPrinter = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('varer')
        .select('id, navn, strekkode, kategori')
        .not('strekkode', 'is', null)
        .order('navn');

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast({
        title: "Feil ved henting av varer",
        description: "Kunne ikke hente varene. Prøv igjen.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.navn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.kategori && item.kategori.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.strekkode && item.strekkode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectItem = (itemId: number, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handlePrint = () => {
    const selectedItemsData = items.filter(item => selectedItems.has(item.id));
    
    if (selectedItemsData.length === 0) {
      toast({
        title: "Ingen varer valgt",
        description: "Velg minst en vare for å skrive ut etiketter.",
        variant: "destructive",
      });
      return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Strekkode Etiketter</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px;
            }
            .label {
              display: inline-block;
              width: 250px;
              height: 120px;
              border: 1px solid #ddd;
              margin: 5px;
              padding: 10px;
              text-align: center;
              vertical-align: top;
              page-break-inside: avoid;
            }
            .item-name {
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 5px;
              word-wrap: break-word;
            }
            .barcode-container {
              margin: 5px 0;
            }
            .barcode {
              display: flex;
              justify-content: center;
              margin-bottom: 2px;
            }
            .barcode-text {
              font-family: monospace;
              font-size: 12px;
            }
            .category {
              font-size: 10px;
              color: #666;
            }
            @media print {
              body { margin: 0; padding: 10px; }
              .label { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          ${selectedItemsData.map(item => `
            <div class="label">
              <div class="item-name">${item.navn}</div>
              <div class="barcode-container">
                <div class="barcode">
                  ${generateSimpleBarcode(item.strekkode || '')}
                </div>
                <div class="barcode-text">${item.strekkode}</div>
              </div>
              ${item.kategori ? `<div class="category">${item.kategori}</div>` : ''}
            </div>
          `).join('')}
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();

    toast({
      title: "Etiketter sendt til printer",
      description: `${selectedItemsData.length} etiketter er klare for utskrift.`,
    });
  };

  const generateSimpleBarcode = (code: string) => {
    return code.split('').map((char, index) => {
      const charCode = char.charCodeAt(0);
      const barWidth = (charCode % 4) + 1;
      const isBlack = charCode % 2 === 0;
      return `<div style="display: inline-block; width: ${barWidth * 2}px; height: 30px; background-color: ${isBlack ? 'black' : 'white'};"></div>`;
    }).join('');
  };

  if (loading) {
    return <div className="flex justify-center p-8">Laster varer...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Skriv ut Strekkode Etiketter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Søk etter varer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={filteredItems.length > 0 && filteredItems.every(item => selectedItems.has(item.id))}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all">Velg alle ({filteredItems.length})</Label>
            </div>
            <Button
              onClick={handlePrint}
              disabled={selectedItems.size === 0}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Skriv ut ({selectedItems.size})
            </Button>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
              >
                <Checkbox
                  checked={selectedItems.has(item.id)}
                  onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                />
                <div className="flex-1">
                  <div className="font-medium">{item.navn}</div>
                  <div className="text-sm text-gray-600 font-mono">{item.strekkode}</div>
                  {item.kategori && (
                    <div className="text-xs text-gray-500">{item.kategori}</div>
                  )}
                </div>
                <div className="text-right">
                  <BarcodeGenerator code={item.strekkode || ''} width={100} height={25} />
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Ingen varer funnet med strekkoder
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Utskriftsinstruksjoner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Velg varene du ønsker å skrive ut etiketter for</p>
            <p>• Klikk "Skriv ut" for å åpne forhåndsvisning</p>
            <p>• Kontroller at printeren er konfigurert for etikettutskrift</p>
            <p>• Anbefalt etikettformat: 25mm x 12mm</p>
            <p>• Hver etikett inneholder varenavn, strekkode og kategori</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarcodeLabelPrinter;
