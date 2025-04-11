
import React from 'react';
import { 
  User, Search, DollarSign, FileCheck, CheckCircle, FileSignature, Users
} from 'lucide-react';

export const steps = [
  { id: 'personal', title: 'Información Personal', icon: React.createElement(User, { size: 18 }) },
  { id: 'character', title: 'Análisis de Carácter', icon: React.createElement(Search, { size: 18 }) },
  { id: 'finances', title: 'Información Financiera', icon: React.createElement(DollarSign, { size: 18 }) },
  { id: 'documents', title: 'Documentos e Imágenes', icon: React.createElement(FileCheck, { size: 18 }) },
  { id: 'consent', title: 'Consentimiento', icon: React.createElement(CheckCircle, { size: 18 }) },
  { id: 'signature', title: 'Firma de Acta', icon: React.createElement(FileSignature, { size: 18 }) },
  { id: 'guarantors', title: 'Fiadores', icon: React.createElement(Users, { size: 18 }) },
];
