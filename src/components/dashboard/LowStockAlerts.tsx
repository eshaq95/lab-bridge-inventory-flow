
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  vare_id: number;
  created_at: string;
  message: string;
  resolved: boolean;
  varer?: {
    navn: string;
    beholdning: number;
    min_niva: number;
    enhet: string;
  };
}

const LowStockAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAlerts();
    
    // Set up real-time subscription for new alerts
    const subscription = supabase
      .channel('alerts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts'
        },
        () => {
          fetchAlerts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      console.log('Fetching low stock alerts...');
      
      const { data: alertsData, error } = await supabase
        .from('alerts')
        .select(`
          id,
          vare_id,
          created_at,
          message,
          resolved,
          varer (
            navn,
            beholdning,
            min_niva,
            enhet
          )
        `)
        .eq('resolved', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching alerts:', error);
        throw error;
      }

      console.log('Fetched alerts:', alertsData);
      setAlerts(alertsData || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke hente varsler",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      console.log('Resolving alert:', alertId);
      
      const { error } = await supabase
        .from('alerts')
        .update({ resolved: true })
        .eq('id', alertId);

      if (error) {
        console.error('Error resolving alert:', error);
        throw error;
      }

      // Remove from local state
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      
      toast({
        title: "Varsel løst",
        description: "Varselet har blitt markert som løst",
      });
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke løse varsel",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Lavt Lager Varsler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
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
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Lavt Lager Varsler
          {alerts.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {alerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                
                <div className="flex-1">
                  <p className="font-medium text-sm text-red-800">
                    {alert.varer?.navn || 'Ukjent vare'}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Beholdning: {alert.varer?.beholdning || 0} {alert.varer?.enhet || 'stk'} 
                    (Min: {alert.varer?.min_niva || 0} {alert.varer?.enhet || 'stk'})
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(alert.created_at).toLocaleString('no-NO')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => resolveAlert(alert.id)}
                  className="text-green-600 border-green-300 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Løs
                </Button>
              </div>
            </div>
          ))}
          
          {alerts.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-gray-500">Ingen aktive varsler for lavt lager</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LowStockAlerts;
