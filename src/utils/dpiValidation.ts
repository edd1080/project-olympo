
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
  if (cleanDPI.length <= 12) {
    return `${cleanDPI.slice(0, 4)} ${cleanDPI.slice(4, 9)} ${cleanDPI.slice(9)}`;
  }
  return `${cleanDPI.slice(0, 4)} ${cleanDPI.slice(4, 9)} ${cleanDPI.slice(9, 13)}`;
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
