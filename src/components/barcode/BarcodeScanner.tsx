
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Scan, Plus, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const BarcodeScanner = () => {
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactionType, setTransactionType] = useState<'in' | 'out'>('in');
  const { toast } = useToast();

  const handleTransaction = async () => {
    if (!barcode.trim()) {
      toast({
        title: "Feil",
        description: "Vennligst skriv inn eller skann en strekkode",
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
          </div>

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
            disabled={isLoading || !barcode.trim()}
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
