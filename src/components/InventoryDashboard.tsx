
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import ItemsList from './inventory/ItemsList';
import SuppliersList from './inventory/SuppliersList';
import TransactionsList from './inventory/TransactionsList';
import CategoriesList from './inventory/CategoriesList';

const InventoryDashboard = () => {
  const [activeTab, setActiveTab] = useState('items');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">LabInventoryBridge</h1>
        <p className="text-gray-600">Laboratorium Lager System</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale Varer</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">324</div>
            <p className="text-xs text-muted-foreground">+12 fra forrige måned</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leverandører</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Aktive leverandører</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lavt Lager</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">8</div>
            <p className="text-xs text-muted-foreground">Varer under min. nivå</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transaksjoner</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Denne måneden</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="items">Varer</TabsTrigger>
          <TabsTrigger value="transactions">Transaksjoner</TabsTrigger>
          <TabsTrigger value="suppliers">Leverandører</TabsTrigger>
          <TabsTrigger value="categories">Kategorier</TabsTrigger>
        </TabsList>

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
