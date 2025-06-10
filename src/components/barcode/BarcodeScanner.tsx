
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Scan, Camera, Package, Plus, Minus, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ScannedItem {
  id: number;
  navn: string;
  strekkode: string;
  beholdning: number;
  enhet: string;
}

const BarcodeScanner = () => {
  const [scannedCode, setScannedCode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const [scannedItem, setScannedItem] = useState<ScannedItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Focus on input for USB scanner
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleScan = async (code: string) => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      console.log('Scanning barcode:', code);
      
      const { data, error } = await supabase
        .from('varer')
        .select('id, navn, strekkode, beholdning, enhet')
        .eq('strekkode', code.trim())
        .single();

      if (error || !data) {
        toast({
          title: "Vare ikke funnet",
          description: `Ingen vare funnet med strekkode: ${code}`,
          variant: "destructive",
        });
        setScannedItem(null);
        return;
      }

      setScannedItem(data);
      toast({
        title: "Vare skannet",
        description: `Funnet: ${data.navn}`,
      });
    } catch (error) {
      console.error('Error scanning barcode:', error);
      toast({
        title: "Feil ved skanning",
        description: "Kunne ikke skanne strekkode",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterTransaction = async (isPositive: boolean) => {
    if (!scannedItem) return;

    setLoading(true);
    try {
      const finalQuantity = isPositive ? quantity : -quantity;
      
      const { error } = await supabase.rpc('fn_register_tx', {
        p_strekkode: scannedItem.strekkode,
        p_qty: finalQuantity,
        p_comment: comment || null
      });

      if (error) throw error;

      toast({
        title: "Transaksjon registrert",
        description: `${isPositive ? 'Lagt til' : 'Trukket fra'} ${quantity} ${scannedItem.enhet}`,
      });

      // Reset form
      setScannedCode('');
      setQuantity(1);
      setComment('');
      setScannedItem(null);
      
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Error registering transaction:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke registrere transaksjon",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && scannedCode) {
      handleScan(scannedCode);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        toast({
          title: "Kamera aktivert",
          description: "Hold strekkoden foran kameraet",
        });
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Kamera feil",
        description: "Kunne ikke åpne kamera. Prøv USB-skanner i stedet.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Strekkode Skanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="barcode">Skann eller skriv inn strekkode</Label>
            <div className="flex gap-2">
              <Input
                id="barcode"
                ref={inputRef}
                value={scannedCode}
                onChange={(e) => setScannedCode(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Skann med USB-leser eller skriv inn manuelt..."
                className="flex-1"
              />
              <Button 
                onClick={() => handleScan(scannedCode)}
                disabled={!scannedCode || loading}
              >
                <Scan className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={cameraActive ? stopCamera : startCamera}
              className="flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              {cameraActive ? 'Stopp kamera' : 'Start kamera'}
            </Button>
          </div>

          {cameraActive && (
            <div className="border rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover"
              />
              <div className="p-2 text-sm text-gray-600 text-center">
                Hold strekkoden foran kameraet
              </div>
            </div>
          )}

          {scannedItem && (
            <div className="border rounded-lg p-4 bg-green-50 border-green-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{scannedItem.navn}</h3>
                  <p className="text-sm text-gray-600">
                    Strekkode: {scannedItem.strekkode}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">
                      Beholdning: {scannedItem.beholdning} {scannedItem.enhet}
                    </Badge>
                  </div>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="quantity">Antall</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>

                <div>
                  <Label htmlFor="comment">Kommentar (valgfritt)</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Beskriv transaksjonen..."
                    rows={2}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleRegisterTransaction(true)}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Legg til (+{quantity})
                  </Button>
                  <Button
                    onClick={() => handleRegisterTransaction(false)}
                    disabled={loading}
                    variant="destructive"
                    className="flex-1"
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Trekk fra (-{quantity})
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BarcodeScanner;
