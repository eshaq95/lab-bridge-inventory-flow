
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Package, Users, Building2, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatsCards from './dashboard/StatsCards';
import RecentActivity from './dashboard/RecentActivity';
import LowStockAlerts from './dashboard/LowStockAlerts';
import InventoryChart from './dashboard/InventoryChart';
import ItemsList from './inventory/ItemsList';
import CategoriesList from './inventory/CategoriesList';
import SuppliersList from './inventory/SuppliersList';
import TransactionsList from './inventory/TransactionsList';

const InventoryDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Tilbake
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Lager Dashboard</h1>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Oversikt
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Varer
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Kategorier
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Leverandører
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Transaksjoner
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <StatsCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LowStockAlerts />
            <RecentActivity />
          </div>
          
          <InventoryChart />
        </TabsContent>

        <TabsContent value="items">
          <ItemsList />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesList />
        </TabsContent>

        <TabsContent value="suppliers">
          <SuppliersList />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryDashboard;
