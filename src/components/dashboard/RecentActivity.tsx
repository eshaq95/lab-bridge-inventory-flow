
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface RecentTransaction {
  id: number;
  type: string;
  antall: number;
  timestamp: string;
  varer?: {
    navn: string;
    enhet: string;
  };
}

const RecentActivity = () => {
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const { data, error } = await supabase
        .from('transaksjoner')
        .select(`
          id,
          type,
          antall,
          timestamp,
          varer (navn, enhet)
        `)
        .order('timestamp', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentTransactions(data || []);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Siste Aktivitet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Siste Aktivitet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
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
                  <p className="font-medium text-sm">{transaction.varer?.navn || 'Ukjent vare'}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.timestamp).toLocaleString('no-NO')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant={transaction.type === 'inn' ? 'default' : 'secondary'} className="text-xs">
                  {transaction.type === 'inn' ? '+' : '-'}{transaction.antall} {transaction.varer?.enhet || 'stk'}
                </Badge>
              </div>
            </div>
          ))}
          
          {recentTransactions.length === 0 && (
            <p className="text-center text-gray-500 py-4">Ingen aktivitet registrert</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
