
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Scan, Plus, Minus, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Item {
  id: number;
  navn: string;
  leverandor: string | null;
  pris: number | null;
  beholdning: number | null;
  min_niva: number | null;
  kategori: string | null;
  enhet: string | null;
  beskrivelse: string | null;
  strekkode: string | null;
}

const BarcodeScanner = () => {
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactionType, setTransactionType] = useState<'in' | 'out'>('in');
  const [foundItem, setFoundItem] = useState<Item | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Search for item when barcode changes
  useEffect(() => {
    const searchItem = async () => {
      if (!barcode.trim()) {
        setFoundItem(null);
        return;
      }

      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from('varer')
          .select('*')
          .eq('strekkode', barcode.trim())
          .maybeSingle();

        if (error) throw error;

        setFoundItem(data);
      } catch (error) {
        console.error('Error searching for item:', error);
        setFoundItem(null);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce the search to avoid too many requests
    const debounceTimer = setTimeout(searchItem, 300);
    return () => clearTimeout(debounceTimer);
  }, [barcode]);

  const handleTransaction = async () => {
    if (!barcode.trim()) {
      toast({
        title: "Feil",
        description: "Vennligst skriv inn eller skann en strekkode",
        variant: "destructive",
      });
      return;
    }

    if (!foundItem) {
      toast({
        title: "Feil",
        description: "Ingen vare funnet med denne strekkoden",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const finalQuantity = transactionType === 'out' ? -quantity : quantity;
      
      const { error } = await supabase.rpc('fn_register_tx', {
        p_strekkode: barcode,
        p_qty: finalQuantity,
        p_comment: comment
      });

      if (error) throw error;

      toast({
        title: "Transaksjon registrert",
        description: `${transactionType === 'in' ? 'Innlevering' : 'Utlevering'} av ${quantity} enheter er registrert`,
      });

      // Reset form
      setBarcode('');
      setQuantity(1);
      setComment('');
      setFoundItem(null);
    } catch (error) {
      console.error('Transaction error:', error);
      toast({
        title: "Feil ved registrering",
        description: error instanceof Error ? error.message : "Ukjent feil oppstod",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isLowStock = (item: Item) => {
    return (item.beholdning || 0) <= (item.min_niva || 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Strekkode Skanning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="barcode">Strekkode</Label>
            <Input
              id="barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Skann eller skriv inn strekkode..."
              className="font-mono"
            />
            {isSearching && (
              <p className="text-sm text-gray-500">Søker etter vare...</p>
            )}
          </div>

          {/* Item Information Display */}
          {barcode.trim() && !isSearching && (
            <Card className={`${foundItem ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardContent className="pt-4">
                {foundItem ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Vare funnet!</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-600" />
                        <span className="font-semibold text-lg">{foundItem.navn}</span>
                        {foundItem.kategori && (
                          <Badge variant="secondary">{foundItem.kategori}</Badge>
                        )}
                        {isLowStock(foundItem) && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Lavt lager
                          </Badge>
                        )}
                      </div>
                      
                      {foundItem.beskrivelse && (
                        <p className="text-gray-600 text-sm">{foundItem.beskrivelse}</p>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Beholdning:</span>
                          <p className={`${isLowStock(foundItem) ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                            {foundItem.beholdning || 0} {foundItem.enhet || 'stk'}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Min. nivå:</span>
                          <p className="text-gray-900">{foundItem.min_niva || 0} {foundItem.enhet || 'stk'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Leverandør:</span>
                          <p className="text-gray-900">{foundItem.leverandor || 'Ikke angitt'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Pris:</span>
                          <p className="text-gray-900">{foundItem.pris ? `${foundItem.pris} kr` : 'Ikke angitt'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-800">
                      Ingen vare funnet med strekkode: {barcode}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Transaksjonstype</Label>
              <div className="flex gap-2">
                <Button
                  variant={transactionType === 'in' ? 'default' : 'outline'}
                  onClick={() => setTransactionType('in')}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Innlevering
                </Button>
                <Button
                  variant={transactionType === 'out' ? 'default' : 'outline'}
                  onClick={() => setTransactionType('out')}
                  className="flex items-center gap-2"
                >
                  <Minus className="h-4 w-4" />
                  Utlevering
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Antall</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Kommentar (valgfritt)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Legg til kommentar for transaksjonen..."
              rows={3}
            />
          </div>

          <Button
            onClick={handleTransaction}
            disabled={isLoading || !barcode.trim() || !foundItem}
            className="w-full"
          >
            {isLoading ? 'Registrerer...' : `Registrer ${transactionType === 'in' ? 'Innlevering' : 'Utlevering'}`}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instruksjoner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Skann strekkoden med en skanner eller skriv den inn manuelt</p>
            <p>• Systemet vil automatisk søke etter varen og vise informasjon</p>
            <p>• Velg om det er innlevering (+) eller utlevering (-) av varer</p>
            <p>• Angi antall enheter som skal registreres</p>
            <p>• Legg til en kommentar hvis nødvendig</p>
            <p>• Klikk "Registrer" for å lagre transaksjonen</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarcodeScanner;
