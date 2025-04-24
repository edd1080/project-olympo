
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import {
  Input
} from '@/components/ui/input';
import {
  Label
} from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { GuarantorData } from '../RequestFormProvider';
import { FileUp, FileText, Camera, Plus, Trash2, DollarSign, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GuarantorFinancialProps {
  guarantor: GuarantorData;
  updateGuarantorData: (field: keyof GuarantorData, value: any) => void;
  setStepComplete: (isComplete: boolean) => void;
}

interface Product {
  id: string;
  name: string;
  price: number;
  cost: number;
  highSeasonMonths: string[];
  lowSeasonMonths: string[];
  photoUrl?: string;
}

const GuarantorFinancial: React.FC<GuarantorFinancialProps> = ({
  guarantor,
  updateGuarantorData,
  setStepComplete
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('manual');
  const [showFileUpload, setShowFileUpload] = useState(false);
  
  // Initialize business info if it doesn't exist
  const businessInfo = guarantor.businessInfo || {
    monthlySales: 0,
    cashSales: 0,
    creditSales: 0,
    costs: 0,
    grossProfit: 0,
    administrativeExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    products: []
  };
  
  // Update business info field
  const updateBusinessInfo = (field: keyof typeof businessInfo, value: any) => {
    const updatedInfo = {
      ...businessInfo,
      [field]: value
    };
    
    // Recalculate totals
    if (['monthlySales', 'cashSales', 'creditSales', 'costs', 'administrativeExpenses'].includes(field)) {
      // If updating sales components, ensure they add up to monthlySales
      if (field === 'cashSales' || field === 'creditSales') {
        const otherField = field === 'cashSales' ? 'creditSales' : 'cashSales';
        const otherValue = businessInfo[otherField as keyof typeof businessInfo] as number;
        updatedInfo.monthlySales = Number(value) + Number(otherValue);
      } else if (field === 'monthlySales') {
        // If updating total sales, redistribute proportionally
        const totalComponents = businessInfo.cashSales + businessInfo.creditSales;
        if (totalComponents > 0) {
          const ratio = Number(value) / totalComponents;
          updatedInfo.cashSales = Math.round(businessInfo.cashSales * ratio);
          updatedInfo.creditSales = Number(value) - updatedInfo.cashSales;
        } else {
          // If no components yet, default to 50/50
          updatedInfo.cashSales = Math.round(Number(value) * 0.5);
          updatedInfo.creditSales = Number(value) - updatedInfo.cashSales;
        }
      }
      
      // Calculate derived values
      updatedInfo.grossProfit = updatedInfo.monthlySales - updatedInfo.costs;
      updatedInfo.netProfit = updatedInfo.grossProfit - updatedInfo.administrativeExpenses;
      updatedInfo.profitMargin = updatedInfo.monthlySales > 0 
        ? (updatedInfo.netProfit / updatedInfo.monthlySales) * 100 
        : 0;
    }
    
    updateGuarantorData('businessInfo', updatedInfo);
  };
  
  // Add a new product
  const addProduct = () => {
    if (businessInfo.products.length >= 10) {
      toast({
        title: "Límite alcanzado",
        description: "No se pueden agregar más de 10 productos",
        variant: "destructive"
      });
      return;
    }
    
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: '',
      price: 0,
      cost: 0,
      highSeasonMonths: [],
      lowSeasonMonths: []
    };
    
    updateBusinessInfo('products', [...businessInfo.products, newProduct]);
  };
  
  // Update a product
  const updateProduct = (productId: string, field: keyof Product, value: any) => {
    const updatedProducts = businessInfo.products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          [field]: value
        };
      }
      return product;
    });
    
    updateBusinessInfo('products', updatedProducts);
  };
  
  // Remove a product
  const removeProduct = (productId: string) => {
    const updatedProducts = businessInfo.products.filter(product => product.id !== productId);
    updateBusinessInfo('products', updatedProducts);
  };
  
  // Handle Excel import
  const handleExcelImport = () => {
    toast({
      title: "Importación simulada",
      description: "En una implementación real, esto importaría datos de Excel",
    });
    
    // Simulate imported data
    setTimeout(() => {
      const mockData = {
        monthlySales: 15000,
        cashSales: 10000,
        creditSales: 5000,
        costs: 8000,
        grossProfit: 7000,
        administrativeExpenses: 2000,
        netProfit: 5000,
        profitMargin: 33.33,
        products: [
          {
            id: `product-${Date.now()}`,
            name: 'Producto Importado 1',
            price: 500,
            cost: 300,
            highSeasonMonths: ['enero', 'diciembre'],
            lowSeasonMonths: ['junio', 'julio']
          },
          {
            id: `product-${Date.now() + 1}`,
            name: 'Producto Importado 2',
            price: 750,
            cost: 400,
            highSeasonMonths: ['abril', 'mayo'],
            lowSeasonMonths: ['agosto', 'septiembre']
          }
        ]
      };
      
      updateGuarantorData('businessInfo', mockData);
      
      toast({
        title: "Datos importados",
        description: "Los datos han sido importados correctamente",
        variant: "default",
        className: "bg-green-100 text-green-800"
      });
      
      setActiveTab('manual');
    }, 2000);
  };
  
  // Handle OCR scan
  const handleOcrScan = () => {
    toast({
      title: "Escaneo simulado",
      description: "En una implementación real, esto activaría la cámara para OCR",
    });
    
    // Simulate OCR process
    setTimeout(() => {
      const mockData = {
        monthlySales: 18000,
        cashSales: 12000,
        creditSales: 6000,
        costs: 9500,
        grossProfit: 8500,
        administrativeExpenses: 3000,
        netProfit: 5500,
        profitMargin: 30.56,
        products: [
          {
            id: `product-${Date.now()}`,
            name: 'Producto Escaneado 1',
            price: 600,
            cost: 350,
            highSeasonMonths: ['febrero', 'marzo'],
            lowSeasonMonths: ['octubre', 'noviembre']
          }
        ]
      };
      
      updateGuarantorData('businessInfo', mockData);
      
      toast({
        title: "Datos escaneados",
        description: "Los datos han sido procesados correctamente",
        variant: "default",
        className: "bg-green-100 text-green-800"
      });
      
      setActiveTab('manual');
    }, 2000);
  };
  
  // Check if the form is complete
  useEffect(() => {
    const isValid = 
      businessInfo.monthlySales > 0 &&
      businessInfo.grossProfit > 0 &&
      businessInfo.netProfit > 0;
    
    setStepComplete(isValid);
  }, [businessInfo, setStepComplete]);
  
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium">Información Financiera del Negocio</h3>
        <p className="text-muted-foreground text-sm">
          Ingrese la información financiera del negocio del fiador
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="manual">Ingreso Manual</TabsTrigger>
          <TabsTrigger value="excel">Importar Excel</TabsTrigger>
          <TabsTrigger value="ocr">Escanear Documento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual">
          <Card className="border shadow-sm">
            <CardContent className="p-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlySales">Ventas Mensuales (Q)</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                    <Input
                      id="monthlySales"
                      type="number"
                      placeholder="0.00"
                      value={businessInfo.monthlySales}
                      onChange={(e) => updateBusinessInfo('monthlySales', Number(e.target.value) || 0)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="cashSales">Ventas al Contado (Q)</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                      <Input
                        id="cashSales"
                        type="number"
                        placeholder="0.00"
                        value={businessInfo.cashSales}
                        onChange={(e) => updateBusinessInfo('cashSales', Number(e.target.value) || 0)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="creditSales">Ventas al Crédito (Q)</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                      <Input
                        id="creditSales"
                        type="number"
                        placeholder="0.00"
                        value={businessInfo.creditSales}
                        onChange={(e) => updateBusinessInfo('creditSales', Number(e.target.value) || 0)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="costs">Costo de Ventas (Q)</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                    <Input
                      id="costs"
                      type="number"
                      placeholder="0.00"
                      value={businessInfo.costs}
                      onChange={(e) => updateBusinessInfo('costs', Number(e.target.value) || 0)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="grossProfit">Utilidad Bruta (Q)</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                    <Input
                      id="grossProfit"
                      type="number"
                      readOnly
                      value={businessInfo.grossProfit}
                      className="pl-8 bg-muted/20"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="administrativeExpenses">Gastos Administrativos (Q)</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                    <Input
                      id="administrativeExpenses"
                      type="number"
                      placeholder="0.00"
                      value={businessInfo.administrativeExpenses}
                      onChange={(e) => updateBusinessInfo('administrativeExpenses', Number(e.target.value) || 0)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="netProfit">Utilidad Neta (Q)</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                    <Input
                      id="netProfit"
                      type="number"
                      readOnly
                      value={businessInfo.netProfit}
                      className={`pl-8 bg-muted/20 ${businessInfo.netProfit < 0 ? 'text-red-600' : ''}`}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profitMargin">
                  Margen de Utilidad (%)
                  {businessInfo.profitMargin < 0 && (
                    <span className="text-red-600 ml-2">
                      <AlertCircle className="inline h-4 w-4 mr-1" />
                      Margen negativo
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">%</span>
                  <Input
                    id="profitMargin"
                    type="number"
                    readOnly
                    value={businessInfo.profitMargin.toFixed(2)}
                    className={`pl-8 bg-muted/20 ${businessInfo.profitMargin < 0 ? 'text-red-600' : ''}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="products">
              <AccordionTrigger className="font-medium">
                Productos ({businessInfo.products.length}/10)
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Agregue los principales productos que comercializa el fiador
                  </p>
                  
                  {businessInfo.products.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead className="text-right">Precio (Q)</TableHead>
                            <TableHead className="text-right">Costo (Q)</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {businessInfo.products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>
                                <Input
                                  value={product.name}
                                  onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                                  placeholder="Nombre del producto"
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-1 text-muted-foreground">Q</span>
                                  <Input
                                    type="number"
                                    value={product.price}
                                    onChange={(e) => updateProduct(product.id, 'price', Number(e.target.value) || 0)}
                                    placeholder="0.00"
                                    className="pl-6 text-right"
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-1 text-muted-foreground">Q</span>
                                  <Input
                                    type="number"
                                    value={product.cost}
                                    onChange={(e) => updateProduct(product.id, 'cost', Number(e.target.value) || 0)}
                                    placeholder="0.00"
                                    className="pl-6 text-right"
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeProduct(product.id)}
                                  className="text-destructive hover:bg-destructive/10 h-8 px-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed rounded-md">
                      <DollarSign className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No hay productos agregados</p>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={addProduct}
                    disabled={businessInfo.products.length >= 10}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar producto
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        
        <TabsContent value="excel">
          <Card className="border shadow-sm">
            <CardContent className="p-6">
              <div className="text-center py-10 space-y-4">
                <FileUp className="mx-auto h-12 w-12 text-primary/50" />
                <h3 className="text-lg font-medium">Importar desde Excel</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Suba un archivo Excel con los datos financieros del negocio del fiador.
                  Procesaremos automáticamente la información.
                </p>
                <Button 
                  className="mt-4"
                  onClick={handleExcelImport}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Seleccionar archivo Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ocr">
          <Card className="border shadow-sm">
            <CardContent className="p-6">
              <div className="text-center py-10 space-y-4">
                <Camera className="mx-auto h-12 w-12 text-primary/50" />
                <h3 className="text-lg font-medium">Escanear Documento</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Tome una fotografía del estado financiero del negocio y procesaremos
                  automáticamente los datos con reconocimiento óptico de caracteres (OCR).
                </p>
                <Button 
                  className="mt-4"
                  onClick={handleOcrScan}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Tomar fotografía
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {(businessInfo.netProfit < 0 || businessInfo.profitMargin < 0) && (
        <div className="border border-red-200 p-4 rounded-md bg-red-50 text-red-800 text-sm">
          <p className="font-medium mb-1 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Alerta: Negocio con pérdidas
          </p>
          <p>
            Los datos financieros muestran que este negocio está operando con pérdidas.
            Revise cuidadosamente la información antes de continuar.
          </p>
        </div>
      )}
    </div>
  );
};

export default GuarantorFinancial;
