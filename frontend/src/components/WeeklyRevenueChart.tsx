// frontend/src/components/WeeklyRevenueChart.tsx
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { format } from "date-fns"; 

interface ChartData {
  day: string;
  date: string;
  revenue: number;
  projectedRevenue: number;
}

interface WeeklyRevenueChartProps {
  selectedDate?: Date; 
  trigger?: number;
}

export function WeeklyRevenueChart({ selectedDate, trigger }: WeeklyRevenueChartProps) {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const dateParam = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');

    api.get(`/metrics/revenue-chart?date=${dateParam}`)
      .then(response => setData(response.data))
      .catch(err => console.error("Erro ao buscar dados do gráfico:", err));
      
  }, [selectedDate, trigger]); 

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
                        // Verifica se há dados ao passar o mouse
                        if (active && payload && payload.length) {
                          // O Recharts agrupa os dados de ambas as barras dentro do payload original
                          const data = payload[0].payload; 
                          
                          const completed = data.revenue || 0;
                          const projected = data.projectedRevenue || 0;
                          const total = completed + projected;

                          return (
                            <div className="bg-card p-3 border rounded-lg shadow-sm space-y-1">
                              <p className="font-bold border-b pb-1 mb-1">{data.date}</p>
                              
                              <div className="flex justify-between gap-4">
                                <span className="text-sm font-medium text-green-600">Concluído:</span>
                                <span className="text-sm text-green-600">R$ {completed.toFixed(2)}</span>
                              </div>
                              
                              <div className="flex justify-between gap-4">
                                <span className="text-sm font-medium text-muted-foreground">Previsto:</span>
                                <span className="text-sm text-muted-foreground">R$ {projected.toFixed(2)}</span>
                              </div>
                              
                              <div className="flex justify-between gap-4 pt-1 border-t mt-1">
                                <span className="text-sm font-bold">Total:</span>
                                <span className="text-sm font-bold">R$ {total.toFixed(2)}</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="revenue" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 0, 0]} name="Concluído" />
                    <Bar dataKey="projectedRevenue" stackId="a" fill="#d1d5db" radius={[4, 4, 0, 0]} name="Previsto" />
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