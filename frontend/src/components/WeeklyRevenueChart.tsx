// frontend/src/components/WeeklyRevenueChart.tsx
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface ChartData {
  day: string;
  date: string;
  revenue: number;
}

export function WeeklyRevenueChart() {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    api.get('/metrics/revenue-chart')
      .then(response => setData(response.data))
      .catch(err => console.error("Erro ao buscar dados do gráfico:", err));
  }, []);

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div>
        <h2 className="font-bold mb-1 text-lg">Receita da Semana</h2>
        <p className="text-sm text-muted-foreground mb-4">Faturamento dos últimos 7 dias.</p>
        <Card className="flex flex-col gap-4 p-5">
            <p className="text-3xl font-bold">R$ {totalRevenue.toFixed(2)}</p>
            {data.length > 0 ? (
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis
                    dataKey="day"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    />
                    <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `R$${value}`}
                    />
                    <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                        return (
                            <div className="bg-card p-2 border rounded-lg shadow-sm">
                            <p className="font-bold">{`${payload[0].payload.date}`}</p>
                            <p className="text-sm">{`Receita: R$${(payload[0].value as number).toFixed(2)}`}</p>
                            </div>
                        );
                        }
                        return null;
                    }}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
            ) : (
            <p className="text-sm text-muted-foreground">Carregando dados do gráfico...</p>
            )}
        </Card>
    </div>
  );
}