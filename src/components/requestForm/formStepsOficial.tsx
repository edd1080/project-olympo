import React from 'react';
import { 
  User, DollarSign, MapPin, Users, FileCheck, Building2, BarChart3
} from 'lucide-react';

// 6 secciones para solicitudes oficiales (post-KYC)
export const stepsOficial = [
  { id: 'credit-details', title: 'Detalles del Crédito', icon: React.createElement(DollarSign, { size: 18 }) },
  { id: 'character', title: 'Análisis de Carácter', icon: React.createElement(Users, { size: 18 }) },
  { id: 'business-financial', title: 'Info del Negocio', icon: React.createElement(Building2, { size: 18 }) },
  { id: 'financial-info', title: 'Información Financiera', icon: React.createElement(BarChart3, { size: 18 }) },
  { id: 'documents', title: 'Documentos e Imágenes', icon: React.createElement(MapPin, { size: 18 }) },
  { id: 'signature', title: 'Cláusula y Firma', icon: React.createElement(FileCheck, { size: 18 }) },
];