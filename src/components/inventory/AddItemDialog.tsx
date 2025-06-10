
import React, { useState } from 'react';
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

const AddItemDialog = ({ open, onOpenChange, onItemAdded }: AddItemDialogProps) => {
  const [formData, setFormData] = useState({
    navn: '',
    beskrivelse: '',
    kategori: '',
    leverandor: '',
    pris: '',
    beholdning: '',
    min_niva: '',
    enhet: 'stk',
    utlopsdato: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('varer')
        .insert({
          navn: formData.navn,
          beskrivelse: formData.beskrivelse || null,
          kategori: formData.kategori || null,
          leverandor: formData.leverandor || null,
          pris: formData.pris ? parseFloat(formData.pris) : null,
          beholdning: formData.beholdning ? parseInt(formData.beholdning) : 0,
          min_niva: formData.min_niva ? parseInt(formData.min_niva) : 0,
          enhet: formData.enhet,
          utlopsdato: formData.utlopsdato || null
        });

      if (error) throw error;

      toast({
        title: "Vare lagt til",
        description: `${formData.navn} har blitt lagt til i lageret.`,
      });

      // Reset form
      setFormData({
        navn: '',
        beskrivelse: '',
        kategori: '',
        leverandor: '',
        pris: '',
        beholdning: '',
        min_niva: '',
        enhet: 'stk',
        utlopsdato: ''
      });

      onItemAdded();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Feil ved lagring",
        description: "Kunne ikke legge til varen. Prøv igjen.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Legg til ny vare</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="navn">Varenavn *</Label>
              <Input
                id="navn"
                value={formData.navn}
                onChange={(e) => setFormData(prev => ({ ...prev, navn: e.target.value }))}
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="beskrivelse">Beskrivelse</Label>
              <Textarea
                id="beskrivelse"
                value={formData.beskrivelse}
                onChange={(e) => setFormData(prev => ({ ...prev, beskrivelse: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="kategori">Kategori</Label>
              <Input
                id="kategori"
                value={formData.kategori}
                onChange={(e) => setFormData(prev => ({ ...prev, kategori: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="leverandor">Leverandør</Label>
              <Input
                id="leverandor"
                value={formData.leverandor}
                onChange={(e) => setFormData(prev => ({ ...prev, leverandor: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="pris">Pris (kr)</Label>
              <Input
                id="pris"
                type="number"
                step="0.01"
                min="0"
                value={formData.pris}
                onChange={(e) => setFormData(prev => ({ ...prev, pris: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="enhet">Enhet</Label>
              <Select value={formData.enhet} onValueChange={(value) => setFormData(prev => ({ ...prev, enhet: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stk">stk</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="m">m</SelectItem>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="pk">pk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="beholdning">Beholdning</Label>
              <Input
                id="beholdning"
                type="number"
                min="0"
                value={formData.beholdning}
                onChange={(e) => setFormData(prev => ({ ...prev, beholdning: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="min_niva">Minimum nivå</Label>
              <Input
                id="min_niva"
                type="number"
                min="0"
                value={formData.min_niva}
                onChange={(e) => setFormData(prev => ({ ...prev, min_niva: e.target.value }))}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="utlopsdato">Utløpsdato</Label>
              <Input
                id="utlopsdato"
                type="date"
                value={formData.utlopsdato}
                onChange={(e) => setFormData(prev => ({ ...prev, utlopsdato: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Avbryt
            </Button>
            <Button type="submit" disabled={loading || !formData.navn.trim()}>
              {loading ? 'Lagrer...' : 'Legg til vare'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
