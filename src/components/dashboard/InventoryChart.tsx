
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { supabase } from '@/integrations/supabase/client';

interface CategoryData {
  kategori: string;
  antall: number;
}

interface StockLevelData {
  level: string;
  count: number;
  fill: string;
}

const InventoryChart = () => {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [stockLevelData, setStockLevelData] = useState<StockLevelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      // Fetch items with categories and stock levels
      const { data: itemsData, error } = await supabase
        .from('varer')
        .select('kategori, beholdning, min_niva')
        .eq('aktiv', true);

      if (error) throw error;

      // Process category data
      const categoryMap = new Map<string, number>();
      let criticalStock = 0;
      let lowStock = 0;
      let normalStock = 0;

      itemsData?.forEach(item => {
        const category = item.kategori || 'Ukategorisert';
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);

        // Calculate stock levels
        const current = item.beholdning || 0;
        const minimum = item.min_niva || 0;
        
        if (current === 0) {
          criticalStock++;
        } else if (current <= minimum) {
          lowStock++;
        } else {
          normalStock++;
        }
      });

      const categoryChartData = Array.from(categoryMap.entries()).map(([kategori, antall]) => ({
        kategori,
        antall
      }));

      const stockChartData = [
        { level: 'Kritisk', count: criticalStock, fill: '#dc2626' },
        { level: 'Lavt', count: lowStock, fill: '#ea580c' },
        { level: 'Normal', count: normalStock, fill: '#16a34a' }
      ];

      setCategoryData(categoryChartData);
      setStockLevelData(stockChartData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm border-gray-100">
          <CardContent className="pt-6">
            <div className="animate-pulse h-80 bg-gray-100 rounded-lg"></div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-100">
          <CardContent className="pt-6">
            <div className="animate-pulse h-80 bg-gray-100 rounded-lg"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const chartConfig = {
    antall: {
      label: "Antall",
      color: "#3b82f6",
    },
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          <p className="text-blue-600">
            {`Antall: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{payload[0].payload.level}</p>
          <p style={{ color: payload[0].payload.fill }}>
            {`Antall: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-800">Varer per Kategori</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={categoryData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="kategori" 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="antall" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-800">Lagerstatus</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockLevelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {stockLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center mt-4 space-x-6">
            {stockLevelData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.fill }}
                ></div>
                <span className="text-sm text-gray-600">
                  {entry.level}: {entry.count}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryChart;
