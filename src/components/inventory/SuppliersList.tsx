
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Building, Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Supplier {
  id: number;
  navn: string;
  kontaktperson: string | null;
  telefon: string | null;
  epost: string | null;
  adresse: string | null;
  created_at: string;
}

const SuppliersList = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('leverandorer')
        .select('*')
        .order('navn');

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.navn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.kontaktperson && supplier.kontaktperson.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex justify-center p-8">Laster leverandører...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Leverandører
            </span>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ny Leverandør
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Søk etter leverandører..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className="p-4 border rounded-lg space-y-3">
                <h3 className="font-semibold text-lg">{supplier.navn}</h3>
                
                {supplier.kontaktperson && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="h-4 w-4" />
                    <span>Kontakt: {supplier.kontaktperson}</span>
                  </div>
                )}
                
                {supplier.telefon && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{supplier.telefon}</span>
                  </div>
                )}
                
                {supplier.epost && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{supplier.epost}</span>
                  </div>
                )}
                
                {supplier.adresse && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{supplier.adresse}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredSuppliers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Ingen leverandører funnet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuppliersList;
