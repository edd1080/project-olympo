import React from 'react';
import { 
  User, DollarSign, MapPin, Users, FileCheck
} from 'lucide-react';

// 5 secciones para solicitudes oficiales (post-KYC)
export const stepsOficial = [
  { id: 'identification', title: 'Identificación y Contacto', icon: React.createElement(User, { size: 18 }) },
  { id: 'finances', title: 'Finanzas y Patrimonio', icon: React.createElement(DollarSign, { size: 18 }) },
  { id: 'business', title: 'Negocio y Perfil Económico', icon: React.createElement(MapPin, { size: 18 }) },
  { id: 'guarantors', title: 'Garantías, Fiadores y Referencias', icon: React.createElement(Users, { size: 18 }) },
  { id: 'documents', title: 'Documentos y Cierre', icon: React.createElement(FileCheck, { size: 18 }) },
];