import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FinancialSummaryViewProps {
  formData: any;
}

const currency = (v: number) =>
  new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ', maximumFractionDigits: 2 }).format(v || 0);

const FinancialSummaryView: React.FC<FinancialSummaryViewProps> = ({ formData }) => {
  const cash = parseFloat(formData.cashSales) || 0;
  const credit = parseFloat(formData.creditSales) || 0;
  const totalSales = cash + credit;
  const costOfSales = parseFloat(formData.costOfSales) || 0;
  const operatingExpenses = parseFloat(formData.operatingExpenses) || 0;
  const grossProfit = totalSales - costOfSales;
  const netProfit = grossProfit - operatingExpenses;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de ingresos y egresos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/20 p-4 rounded-md text-center">
            <div className="text-sm text-muted-foreground">Ingresos (ventas)</div>
            <div className="text-2xl font-bold">{currency(totalSales)}</div>
          </div>
          <div className="bg-muted/20 p-4 rounded-md text-center">
            <div className="text-sm text-muted-foreground">Costo de ventas</div>
            <div className="text-2xl font-bold">{currency(costOfSales)}</div>
          </div>
          <div className="bg-muted/20 p-4 rounded-md text-center">
            <div className="text-sm text-muted-foreground">Gastos operativos</div>
            <div className="text-2xl font-bold">{currency(operatingExpenses)}</div>
          </div>
          <div className="bg-muted/20 p-4 rounded-md text-center">
            <div className="text-sm text-muted-foreground">Utilidad neta (estimada)</div>
            <div className="text-2xl font-bold">{currency(netProfit)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialSummaryView;
