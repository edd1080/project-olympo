
import React from 'react';
import { 
  User, Search, DollarSign, FileCheck, CheckCircle, FileSignature, Users
} from 'lucide-react';

export const steps = [
  { id: 'personal', title: 'Información Personal', icon: <User size={18} /> },
  { id: 'character', title: 'Análisis de Carácter', icon: <Search size={18} /> },
  { id: 'finances', title: 'Información Financiera', icon: <DollarSign size={18} /> },
  { id: 'documents', title: 'Documentos e Imágenes', icon: <FileCheck size={18} /> },
  { id: 'consent', title: 'Consentimiento', icon: <CheckCircle size={18} /> },
  { id: 'signature', title: 'Firma de Acta', icon: <FileSignature size={18} /> },
  { id: 'guarantors', title: 'Fiadores', icon: <Users size={18} /> },
];
