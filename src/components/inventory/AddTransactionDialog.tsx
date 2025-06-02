
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionAdded: () => void;
}

interface Item {
  id: number;
  navn: string;
  enhet: string;
  beholdning: number;
}

const AddTransactionDialog = ({ open, onOpenChange, onTransactionAdded }: AddTransactionDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  
  const [formData, setFormData] = useState({
    vare_id: '',
    type: '',
    antall: '',
    kommentar: '',
    bruker: ''
  });

  useEffect(() => {
    if (open) {
      fetchItems();
    }
  }, [open]);

  const fetchItems = async () => {
    const { data } = await supabase
      .from('varer')
      .select('id, navn, enhet, beholdning')
      .eq('aktiv', true)
      .order('navn');
    setItems(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('transaksjoner')
        .insert({
          vare_id: parseInt(formData.vare_id),
          type: formData.type,
          antall: parseInt(formData.antall),
          kommentar: formData.kommentar || null,
          bruker: formData.bruker || null
        });

      if (error) throw error;

      toast({
        title: "Transaksjon registrert",
        description: "Lagertransaksjonen har blitt registrert og beholdningen oppdatert.",
      });

      // Reset form
      setFormData({
        vare_id: '',
        type: '',
        antall: '',
        kommentar: '',
        bruker: ''
      });

      onTransactionAdded();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke registrere transaksjonen. Prøv igjen.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedItem = items.find(item => item.id.toString() === formData.vare_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrer lagertransaksjon</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vare_id">Vare *</Label>
            <Select value={formData.vare_id} onValueChange={(value) => setFormData({ ...formData, vare_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Velg vare" />
              </SelectTrigger>
              <SelectContent>
                {items.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.navn} (Beholdning: {item.beholdning} {item.enhet})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="type">Type transaksjon *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Velg type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inn">Inn (Mottatt/Innkjøp)</SelectItem>
                <SelectItem value="ut">Ut (Forbruk/Uttak)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="antall">Antall *</Label>
            <Input
              id="antall"
              type="number"
              min="1"
              value={formData.antall}
              onChange={(e) => setFormData({ ...formData, antall: e.target.value })}
              required
            />
            {selectedItem && (
              <p className="text-sm text-gray-500 mt-1">
                Enhet: {selectedItem.enhet} | Nåværende beholdning: {selectedItem.beholdning}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="bruker">Bruker</Label>
            <Input
              id="bruker"
              value={formData.bruker}
              onChange={(e) => setFormData({ ...formData, bruker: e.target.value })}
              placeholder="Hvem utfører transaksjonen?"
            />
          </div>

          <div>
            <Label htmlFor="kommentar">Kommentar</Label>
            <Textarea
              id="kommentar"
              value={formData.kommentar}
              onChange={(e) => setFormData({ ...formData, kommentar: e.target.value })}
              placeholder="Tilleggsinfo om transaksjonen"
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Avbryt
            </Button>
            <Button type="submit" disabled={loading || !formData.vare_id || !formData.type || !formData.antall}>
              {loading ? 'Registrerer...' : 'Registrer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
