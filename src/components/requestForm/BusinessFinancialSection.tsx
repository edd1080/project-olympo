import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BusinessFinancialForm from './BusinessFinancialForm';
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
  const amount = parseFloat(formData?.requestedAmount ?? '0');
  const showAdditional = amount > 20000;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="base" className="w-full">
        <TabsList>
          <TabsTrigger value="base">Información del negocio</TabsTrigger>
          {showAdditional && (
            <>
              <TabsTrigger value="additional">Info financiera adicional</TabsTrigger>
              <TabsTrigger value="fixed">Activos fijos</TabsTrigger>
              <TabsTrigger value="liab">Pasivos</TabsTrigger>
              <TabsTrigger value="summary">Resumen</TabsTrigger>
              <TabsTrigger value="ratios">Ratios</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="base">
          <BusinessFinancialForm formData={formData} updateFormData={updateFormData} />
        </TabsContent>

        {showAdditional && (
          <>
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
          </>
        )}
      </Tabs>
    </div>
  );
};

export default BusinessFinancialSection;
