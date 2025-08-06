import React from 'react';
import { 
  User, DollarSign, MapPin, Users, FileCheck
} from 'lucide-react';

// 6 secciones para solicitudes oficiales (post-KYC)
export const stepsOficial = [
  { id: 'credit-info', title: 'Info del Crédito', icon: React.createElement(DollarSign, { size: 18 }) },
  { id: 'applicant-info', title: 'Información del solicitante', icon: React.createElement(User, { size: 18 }) },
  { id: 'character', title: 'Carácter', icon: React.createElement(Users, { size: 18 }) },
  { id: 'base-finances', title: 'Finanzas base', icon: React.createElement(DollarSign, { size: 18 }) },
  { id: 'documents', title: 'Documentos', icon: React.createElement(MapPin, { size: 18 }) },
  { id: 'signature', title: 'Cláusula y firma', icon: React.createElement(FileCheck, { size: 18 }) },
];