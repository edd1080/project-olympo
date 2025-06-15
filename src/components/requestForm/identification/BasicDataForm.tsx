
import React, { useEffect, useState } from 'react';
import AgencyMemberForm from './AgencyMemberForm';
import PersonalInfoForm from './PersonalInfoForm';
import DocumentsForm from './DocumentsForm';
import BirthDemographicsForm from './BirthDemographicsForm';
import SpouseInfoForm from './SpouseInfoForm';
import DisabilityForm from './DisabilityForm';

interface BasicDataFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const BasicDataForm: React.FC<BasicDataFormProps> = ({ formData, updateFormData }) => {
  const [isMarried, setIsMarried] = useState(formData.civilStatus === 'married');

  useEffect(() => {
    setIsMarried(formData.civilStatus === 'married');
  }, [formData.civilStatus]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg">Datos Básicos</h3>
        <p className="text-muted-foreground text-sm">
          Complete la información básica del solicitante.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Agencia y Tipo Socio */}
        <AgencyMemberForm formData={formData} updateFormData={updateFormData} />

        {/* Información Personal */}
        <PersonalInfoForm formData={formData} updateFormData={updateFormData} />

        {/* Documentos */}
        <DocumentsForm formData={formData} updateFormData={updateFormData} />

        {/* Fecha de Nacimiento y Demografía */}
        <BirthDemographicsForm formData={formData} updateFormData={updateFormData} />

        {/* Campos condicionales para cónyuge */}
        {isMarried && (
          <SpouseInfoForm formData={formData} updateFormData={updateFormData} />
        )}

        {/* Campo de Incapacidad */}
        <DisabilityForm formData={formData} updateFormData={updateFormData} />
      </div>
    </div>
  );
};

export default BasicDataForm;
