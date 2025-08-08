import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GeneralBusinessInfo from './businessFinancial/GeneralBusinessInfo';
import SalesInfo from './businessFinancial/SalesInfo';
import BusinessProducts from './businessFinancial/BusinessProducts';
import AdditionalFinancialInfo from './businessFinancial/AdditionalFinancialInfo';
import FixedAssetsDescription from './businessFinancial/FixedAssetsDescription';
import LiabilitiesDescription from './businessFinancial/LiabilitiesDescription';
import FinancialSummaryView from './businessFinancial/FinancialSummaryView';
import FinancialRatiosView from './businessFinancial/FinancialRatiosView';

interface BusinessFinancialSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const BusinessFinancialSection: React.FC<BusinessFinancialSectionProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="general">Información general</TabsTrigger>
          <TabsTrigger value="sales">Información de ventas</TabsTrigger>
          <TabsTrigger value="products">Productos del negocio</TabsTrigger>
          <TabsTrigger value="additional">Info financiera adicional</TabsTrigger>
          <TabsTrigger value="fixed">Activos fijos</TabsTrigger>
          <TabsTrigger value="liab">Pasivos</TabsTrigger>
          <TabsTrigger value="summary">Resumen</TabsTrigger>
          <TabsTrigger value="ratios">Ratios</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralBusinessInfo formData={formData} updateFormData={updateFormData} />
        </TabsContent>

        <TabsContent value="sales">
          <SalesInfo formData={formData} updateFormData={updateFormData} />
        </TabsContent>

        <TabsContent value="products">
          <BusinessProducts formData={formData} updateFormData={updateFormData} />
        </TabsContent>

        <TabsContent value="additional">
          <AdditionalFinancialInfo formData={formData} updateFormData={updateFormData} />
        </TabsContent>

        <TabsContent value="fixed">
          <FixedAssetsDescription formData={formData} updateFormData={updateFormData} />
        </TabsContent>

        <TabsContent value="liab">
          <LiabilitiesDescription formData={formData} updateFormData={updateFormData} />
        </TabsContent>

        <TabsContent value="summary">
          <FinancialSummaryView formData={formData} />
        </TabsContent>

        <TabsContent value="ratios">
          <FinancialRatiosView formData={formData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessFinancialSection;
