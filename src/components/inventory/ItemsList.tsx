
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, AlertTriangle, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AddItemDialog from './AddItemDialog';

interface Item {
  id: number;
  navn: string;
  leverandor: string | null;
  pris: number | null;
  beholdning: number | null;
  min_niva: number | null;
  utlopsdato: string | null;
  kategori: string | null;
  enhet: string | null;
  beskrivelse: string | null;
  aktiv: boolean | null;
}

const ItemsList = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('varer')
        .select('*')
        .order('navn');

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.navn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.kategori && item.kategori.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.leverandor && item.leverandor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isLowStock = (item: Item) => {
    return (item.beholdning || 0) <= (item.min_niva || 0);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Laster varer...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Lagervarer
            </span>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ny Vare
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Søk etter varer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 border rounded-lg ${
                  isLowStock(item) ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{item.navn}</h3>
                      {isLowStock(item) && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Lavt lager
                        </Badge>
                      )}
                      {item.kategori && (
                        <Badge variant="secondary">{item.kategori}</Badge>
                      )}
                    </div>
                    
                    {item.beskrivelse && (
                      <p className="text-gray-600 mb-2">{item.beskrivelse}</p>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Beholdning:</span>
                        <p className={`${isLowStock(item) ? 'text-red-600 font-bold' : ''}`}>
                          {item.beholdning || 0} {item.enhet || 'stk'}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Min. nivå:</span>
                        <p>{item.min_niva || 0} {item.enhet || 'stk'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Leverandør:</span>
                        <p>{item.leverandor || 'Ikke angitt'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Pris:</span>
                        <p>{item.pris ? `${item.pris} kr` : 'Ikke angitt'}</p>
                      </div>
                    </div>
                    
                    {item.utlopsdato && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium text-gray-700">Utløpsdato:</span>
                        <span className="ml-1">{new Date(item.utlopsdato).toLocaleDateString('no-NO')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Ingen varer funnet
            </div>
          )}
        </CardContent>
      </Card>

      <AddItemDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onItemAdded={fetchItems}
      />
    </div>
  );
};

export default ItemsList;
