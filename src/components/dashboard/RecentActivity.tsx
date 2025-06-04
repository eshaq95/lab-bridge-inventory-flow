
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Clock, Plus, Trash2 } from 'lucide-react';
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

interface ActivityLog {
  id: number;
  type: string;
  item_navn: string;
  beskrivelse: string;
  timestamp: string;
}

const RecentActivity = () => {
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent transactions
      const { data: transactionData, error: transactionError } = await supabase
        .from('transaksjoner')
        .select(`
          id,
          type,
          antall,
          timestamp,
          varer (navn, enhet)
        `)
        .order('timestamp', { ascending: false })
        .limit(3);

      if (transactionError) throw transactionError;

      // Fetch recent activity logs
      const { data: activityData, error: activityError } = await supabase
        .from('aktivitet_logg')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(3);

      if (activityError) throw activityError;

      setRecentTransactions(transactionData || []);
      setActivityLogs(activityData || []);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combine and sort all activities by timestamp
  const allActivities = [
    ...recentTransactions.map(transaction => ({
      id: `transaction-${transaction.id}`,
      type: transaction.type === 'inn' ? 'stock_in' : 'stock_out',
      item_navn: transaction.varer?.navn || 'Ukjent vare',
      beskrivelse: `${transaction.type === 'inn' ? '+' : '-'}${transaction.antall} ${transaction.varer?.enhet || 'stk'}`,
      timestamp: transaction.timestamp
    })),
    ...activityLogs.map(log => ({
      id: `activity-${log.id}`,
      type: log.type,
      item_navn: log.item_navn,
      beskrivelse: log.beskrivelse,
      timestamp: log.timestamp
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'stock_in':
        return <ArrowUp className="h-4 w-4" />;
      case 'stock_out':
        return <ArrowDown className="h-4 w-4" />;
      case 'item_added':
        return <Plus className="h-4 w-4" />;
      case 'item_deleted':
        return <Trash2 className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'stock_in':
        return 'bg-green-100 text-green-600';
      case 'stock_out':
        return 'bg-red-100 text-red-600';
      case 'item_added':
        return 'bg-blue-100 text-blue-600';
      case 'item_deleted':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'stock_in':
      case 'item_added':
        return 'default' as const;
      case 'stock_out':
      case 'item_deleted':
        return 'secondary' as const;
      default:
        return 'secondary' as const;
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
          {allActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div>
                  <p className="font-medium text-sm">{activity.item_navn}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString('no-NO')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant={getBadgeVariant(activity.type)} className="text-xs">
                  {activity.beskrivelse}
                </Badge>
              </div>
            </div>
          ))}
          
          {allActivities.length === 0 && (
            <p className="text-center text-gray-500 py-4">Ingen aktivitet registrert</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
