
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemAdded: () => void;
}

interface Category {
  id: number;
  navn: string;
}

interface Supplier {
  id: number;
  navn: string;
}

const AddItemDialog = ({ open, onOpenChange, onItemAdded }: AddItemDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  
  const [formData, setFormData] = useState({
    navn: '',
    leverandor: '',
    pris: '',
    beholdning: '',
    min_niva: '',
    utlopsdato: '',
    kategori: '',
    enhet: 'stk',
    beskrivelse: '',
    strekkode: ''
  });

  useEffect(() => {
    if (open) {
      fetchCategories();
      fetchSuppliers();
    }
  }, [open]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('kategorier')
      .select('id, navn')
      .order('navn');
    setCategories(data || []);
  };

  const fetchSuppliers = async () => {
    const { data } = await supabase
      .from('leverandorer')
      .select('id, navn')
      .order('navn');
    setSuppliers(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('varer')
        .insert({
          navn: formData.navn,
          leverandor: formData.leverandor || null,
          pris: formData.pris ? parseFloat(formData.pris) : null,
          beholdning: formData.beholdning ? parseInt(formData.beholdning) : 0,
          min_niva: formData.min_niva ? parseInt(formData.min_niva) : 0,
          utlopsdato: formData.utlopsdato || null,
          kategori: formData.kategori || null,
          enhet: formData.enhet,
          beskrivelse: formData.beskrivelse || null,
          strekkode: formData.strekkode || null
        });

      if (error) throw error;

      toast({
        title: "Vare lagt til",
        description: "Den nye varen har blitt lagt til i lageret.",
      });

      // Reset form
      setFormData({
        navn: '',
        leverandor: '',
        pris: '',
        beholdning: '',
        min_niva: '',
        utlopsdato: '',
        kategori: '',
        enhet: 'stk',
        beskrivelse: '',
        strekkode: ''
      });

      onItemAdded();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke legge til varen. Prøv igjen.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Legg til ny vare</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="navn">Navn *</Label>
            <Input
              id="navn"
              value={formData.navn}
              onChange={(e) => setFormData({ ...formData, navn: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="beskrivelse">Beskrivelse</Label>
            <Textarea
              id="beskrivelse"
              value={formData.beskrivelse}
              onChange={(e) => setFormData({ ...formData, beskrivelse: e.target.value })}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="beholdning">Beholdning</Label>
              <Input
                id="beholdning"
                type="number"
                value={formData.beholdning}
                onChange={(e) => setFormData({ ...formData, beholdning: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="min_niva">Min. nivå</Label>
              <Input
                id="min_niva"
                type="number"
                value={formData.min_niva}
                onChange={(e) => setFormData({ ...formData, min_niva: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pris">Pris (kr)</Label>
              <Input
                id="pris"
                type="number"
                step="0.01"
                value={formData.pris}
                onChange={(e) => setFormData({ ...formData, pris: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="enhet">Enhet</Label>
              <Select value={formData.enhet} onValueChange={(value) => setFormData({ ...formData, enhet: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stk">stk</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="pk">pk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="kategori">Kategori</Label>
            <Select value={formData.kategori} onValueChange={(value) => setFormData({ ...formData, kategori: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Velg kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.navn}>
                    {category.navn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="leverandor">Leverandør</Label>
            <Select value={formData.leverandor} onValueChange={(value) => setFormData({ ...formData, leverandor: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Velg leverandør" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.navn}>
                    {supplier.navn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="strekkode">Strekkode</Label>
              <Input
                id="strekkode"
                value={formData.strekkode}
                onChange={(e) => setFormData({ ...formData, strekkode: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="utlopsdato">Utløpsdato</Label>
              <Input
                id="utlopsdato"
                type="date"
                value={formData.utlopsdato}
                onChange={(e) => setFormData({ ...formData, utlopsdato: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Avbryt
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Legger til...' : 'Legg til'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
