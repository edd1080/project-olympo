import React from 'react';
import { 
  User, DollarSign, MapPin, Users, FileCheck
} from 'lucide-react';

// 5 secciones para solicitudes oficiales (post-KYC)
export const stepsOficial = [
  { id: 'credit-info', title: 'Información del crédito + solicitante', icon: React.createElement(User, { size: 18 }) },
  { id: 'character', title: 'Análisis de carácter', icon: React.createElement(Users, { size: 18 }) },
  { id: 'business-financial', title: 'Información financiera del negocio', icon: React.createElement(DollarSign, { size: 18 }) },
  { id: 'documents', title: 'Documentos', icon: React.createElement(MapPin, { size: 18 }) },
  { id: 'signature', title: 'Cláusula y firma', icon: React.createElement(FileCheck, { size: 18 }) },
];