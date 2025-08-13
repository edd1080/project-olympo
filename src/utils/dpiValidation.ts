
export const validateDPI = (dpi: string): { isValid: boolean; error?: string } => {
  // Remover espacios y guiones
  const cleanDPI = dpi.replace(/[\s-]/g, '');
  
  // Verificar que tenga exactamente 13 dígitos
  if (!/^\d{13}$/.test(cleanDPI)) {
    return {
      isValid: false,
      error: 'El DPI debe tener exactamente 13 dígitos'
    };
  }

  // TODO: Implementar algoritmo de checksum específico
  // Por ahora solo validamos formato
  return {
    isValid: true
  };
};

export const formatDPI = (dpi: string): string => {
  const cleanDPI = dpi.replace(/[\s-]/g, '');
  if (cleanDPI.length <= 4) return cleanDPI;
  if (cleanDPI.length <= 9) {
    return `${cleanDPI.slice(0, 4)} ${cleanDPI.slice(4)}`;
  }
  return `${cleanDPI.slice(0, 4)} ${cleanDPI.slice(4, 9)} ${cleanDPI.slice(9, 13)}`;
};

export const formatNIT = (nit: string): string => {
  const cleanNIT = nit.replace(/[\s-]/g, '');
  if (cleanNIT.length <= 8) return cleanNIT;
  return `${cleanNIT.slice(0, -1)}-${cleanNIT.slice(-1)}`;
};

export const formatPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/[\s-]/g, '');
  if (cleanPhone.length <= 4) return cleanPhone;
  return `${cleanPhone.slice(0, 4)}-${cleanPhone.slice(4, 8)}`;
};

export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  const cleanPhone = phone.replace(/[\s-]/g, '');
  
  if (!/^\d{8}$/.test(cleanPhone)) {
    return {
      isValid: false,
      error: 'El teléfono debe tener exactamente 8 dígitos'
    };
  }

  return {
    isValid: true
  };
};
