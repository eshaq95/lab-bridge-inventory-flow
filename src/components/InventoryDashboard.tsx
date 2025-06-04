
import React from 'react';
import StatsCards from './dashboard/StatsCards';
import RecentActivity from './dashboard/RecentActivity';
import LowStockAlerts from './dashboard/LowStockAlerts';
import InventoryChart from './dashboard/InventoryChart';

const InventoryDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockAlerts />
        <RecentActivity />
      </div>
      
      <InventoryChart />
    </div>
  );
};

export default InventoryDashboard;
