
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalItems: number;
  totalSuppliers: number;
  lowStockItems: number;
  monthlyTransactions: number;
}

const StatsCards = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    totalSuppliers: 0,
    lowStockItems: 0,
    monthlyTransactions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch total active items
      const { data: itemsData, error: itemsError } = await supabase
        .from('varer')
        .select('id, beholdning, min_niva')
        .eq('aktiv', true);

      if (itemsError) throw itemsError;

      // Fetch total suppliers
      const { data: suppliersData, error: suppliersError } = await supabase
        .from('leverandorer')
        .select('id');

      if (suppliersError) throw suppliersError;

      // Calculate low stock items
      const lowStockCount = itemsData?.filter(item => 
        (item.beholdning || 0) <= (item.min_niva || 0)
      ).length || 0;

      // Fetch monthly transactions
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transaksjoner')
        .select('id')
        .gte('timestamp', startOfMonth.toISOString());

      if (transactionsError) throw transactionsError;

      setStats({
        totalItems: itemsData?.length || 0,
        totalSuppliers: suppliersData?.length || 0,
        lowStockItems: lowStockCount,
        monthlyTransactions: transactionsData?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Totale Varer</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalItems}</div>
          <p className="text-xs text-muted-foreground">Aktive varer i lager</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Leverandører</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSuppliers}</div>
          <p className="text-xs text-muted-foreground">Registrerte leverandører</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lavt Lager</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.lowStockItems}</div>
          <p className="text-xs text-muted-foreground">Varer under min. nivå</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transaksjoner</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.monthlyTransactions}</div>
          <p className="text-xs text-muted-foreground">Denne måneden</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
