
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowUp, ArrowDown, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AddTransactionDialog from './AddTransactionDialog';

interface Transaction {
  id: number;
  vare_id: number;
  type: string;
  antall: number;
  kommentar: string | null;
  bruker: string | null;
  timestamp: string;
  varer?: {
    navn: string;
    enhet: string;
  };
}

const TransactionsList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transaksjoner')
        .select(`
          *,
          varer (navn, enhet)
        `)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Laster transaksjoner...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Lagertransaksjoner
            </span>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ny Transaksjon
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'inn' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'inn' ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">{transaction.varer?.navn || 'Ukjent vare'}</h3>
                    <p className="text-sm text-gray-600">
                      {transaction.bruker || 'Ukjent bruker'} • {' '}
                      {new Date(transaction.timestamp).toLocaleString('no-NO')}
                    </p>
                    {transaction.kommentar && (
                      <p className="text-sm text-gray-500 mt-1">{transaction.kommentar}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge variant={transaction.type === 'inn' ? 'default' : 'secondary'}>
                    {transaction.type === 'inn' ? '+' : '-'}{transaction.antall} {transaction.varer?.enhet || 'stk'}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {transaction.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Ingen transaksjoner registrert
            </div>
          )}
        </CardContent>
      </Card>

      <AddTransactionDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onTransactionAdded={fetchTransactions}
      />
    </div>
  );
};

export default TransactionsList;
