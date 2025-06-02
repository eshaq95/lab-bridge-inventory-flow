
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
        { level: 'Kritisk', count: criticalStock, fill: '#ef4444' },
        { level: 'Lavt', count: lowStock, fill: '#f97316' },
        { level: 'Normal', count: normalStock, fill: '#22c55e' }
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const chartConfig = {
    antall: {
      label: "Antall",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Varer per Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="kategori" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="antall" fill="var(--color-antall)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lagerstatus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockLevelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ level, count, percent }) => 
                    `${level}: ${count} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stockLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryChart;
