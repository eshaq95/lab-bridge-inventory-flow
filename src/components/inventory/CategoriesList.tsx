
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: number;
  navn: string;
  beskrivelse: string | null;
  created_at: string;
}

const CategoriesList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('kategorier')
        .select('*')
        .order('navn');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.navn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.beskrivelse && category.beskrivelse.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex justify-center p-8">Laster kategorier...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Kategorier
            </span>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ny Kategori
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Søk etter kategorier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => (
              <div key={category.id} className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{category.navn}</h3>
                {category.beskrivelse && (
                  <p className="text-sm text-gray-600">{category.beskrivelse}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Opprettet: {new Date(category.created_at).toLocaleDateString('no-NO')}
                </p>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Ingen kategorier funnet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesList;
