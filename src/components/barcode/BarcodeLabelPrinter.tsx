
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BarcodeGenerator from './BarcodeGenerator';

interface Item {
  id: number;
  navn: string;
  strekkode: string;
  kategori: string;
  enhet: string;
}

interface BarcodeLabelPrinterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BarcodeLabelPrinter = ({ open, onOpenChange }: BarcodeLabelPrinterProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchItems();
    }
  }, [open]);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('varer')
        .select('id, navn, strekkode, kategori, enhet')
        .eq('aktiv', true)
        .order('navn');

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke hente varer",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    const selectedItem = items.find(item => item.id.toString() === selectedItemId);
    if (!selectedItem) return;

    // Create a print-friendly version
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Strekkode Etikett - ${selectedItem.navn}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .label {
              border: 2px solid #000;
              padding: 15px;
              width: 300px;
              text-align: center;
              background: white;
            }
            .barcode {
              margin: 10px 0;
              font-family: 'Courier New', monospace;
              font-size: 24px;
              letter-spacing: 2px;
              background: #f0f0f0;
              padding: 10px;
              border: 1px solid #ccc;
            }
            .item-name {
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 5px;
            }
            .item-details {
              font-size: 12px;
              color: #666;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="item-name">${selectedItem.navn}</div>
            <div class="barcode">${selectedItem.strekkode}</div>
            <div class="item-details">
              Kategori: ${selectedItem.kategori || 'Ikke angitt'}<br>
              Enhet: ${selectedItem.enhet || 'stk'}
            </div>
          </div>
          <div class="no-print" style="margin-top: 20px;">
            <button onclick="window.print()">Skriv ut</button>
            <button onclick="window.close()">Lukk</button>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
  };

  const selectedItem = items.find(item => item.id.toString() === selectedItemId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Skriv ut strekkode etikett
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Velg vare</label>
            <Select value={selectedItemId} onValueChange={setSelectedItemId}>
              <SelectTrigger>
                <SelectValue placeholder="Velg en vare" />
              </SelectTrigger>
              <SelectContent>
                {items.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      {item.navn} ({item.strekkode})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedItem && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-2">Forhåndsvisning:</h3>
              <div className="bg-white p-3 border rounded text-center">
                <div className="font-semibold mb-2">{selectedItem.navn}</div>
                <BarcodeGenerator code={selectedItem.strekkode} />
                <div className="text-xs text-gray-500 mt-2">
                  {selectedItem.kategori} • {selectedItem.enhet}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Avbryt
            </Button>
            <Button 
              onClick={handlePrint} 
              disabled={!selectedItemId}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Skriv ut
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeLabelPrinter;
