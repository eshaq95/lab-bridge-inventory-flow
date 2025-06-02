
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ItemsList from './inventory/ItemsList';
import SuppliersList from './inventory/SuppliersList';
import TransactionsList from './inventory/TransactionsList';
import CategoriesList from './inventory/CategoriesList';
import StatsCards from './dashboard/StatsCards';
import RecentActivity from './dashboard/RecentActivity';
import InventoryChart from './dashboard/InventoryChart';

const InventoryDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tilbake
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">LabInventoryBridge</h1>
            <p className="text-gray-600">Laboratorium Lager System</p>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Oversikt</TabsTrigger>
          <TabsTrigger value="items">Varer</TabsTrigger>
          <TabsTrigger value="transactions">Transaksjoner</TabsTrigger>
          <TabsTrigger value="suppliers">Leverandører</TabsTrigger>
          <TabsTrigger value="categories">Kategorier</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Dynamic Stats Cards */}
          <StatsCards />
          
          {/* Charts */}
          <InventoryChart />
          
          {/* Recent Activity */}
          <RecentActivity />
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <ItemsList />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <TransactionsList />
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <SuppliersList />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <CategoriesList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryDashboard;
