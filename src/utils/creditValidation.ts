export const validateCUI = (cui: string): { isValid: boolean; error?: string } => {
  // Remove spaces and dashes
  const cleanCUI = cui.replace(/[\s-]/g, '');
  
  // Check if it has exactly 13 digits
  if (!/^\d{13}$/.test(cleanCUI)) {
    return {
      isValid: false,
      error: 'El CUI debe tener exactamente 13 dígitos'
    };
  }

  // Basic format validation for Guatemala CUI
  // TODO: Implement proper checksum algorithm
  return {
    isValid: true
  };
};

export const validateNIT = (nit: string): { isValid: boolean; error?: string } => {
  // Remove spaces and dashes
  const cleanNIT = nit.replace(/[\s-]/g, '');
  
  // Guatemala NIT format: 8 digits + 1 verification digit
  if (!/^\d{8,9}$/.test(cleanNIT)) {
    return {
      isValid: false,
      error: 'El NIT debe tener entre 8 y 9 dígitos'
    };
  }

  return {
    isValid: true
  };
};

export const validateGuatemalaPhone = (phone: string): { isValid: boolean; error?: string } => {
  const cleanPhone = phone.replace(/[\s-]/g, '');
  
  // Guatemala mobile phones: 8 digits starting with specific prefixes
  if (!/^[0-9]{8}$/.test(cleanPhone)) {
    return {
      isValid: false,
      error: 'El teléfono debe tener exactamente 8 dígitos'
    };
  }

  // Check if it starts with valid mobile prefixes for Guatemala
  const mobilePrefix = cleanPhone.substring(0, 1);
  if (!['3', '4', '5'].includes(mobilePrefix)) {
    return {
      isValid: false,
      error: 'El número debe comenzar con 3, 4 o 5 para teléfonos móviles'
    };
  }

  return {
    isValid: true
  };
};

export const validateAmount = (amount: string | number): { isValid: boolean; error?: string } => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount) || numAmount <= 0) {
    return {
      isValid: false,
      error: 'El monto debe ser mayor a cero'
    };
  }

  if (numAmount > 1000000) {
    return {
      isValid: false,
      error: 'El monto no puede exceder Q1,000,000'
    };
  }

  return {
    isValid: true
  };
};

export const validateInterestRate = (rate: string | number): { isValid: boolean; error?: string } => {
  const numRate = typeof rate === 'string' ? parseFloat(rate) : rate;
  
  if (isNaN(numRate) || numRate < 0 || numRate > 100) {
    return {
      isValid: false,
      error: 'La tasa de interés debe estar entre 0 y 100%'
    };
  }

  return {
    isValid: true
  };
};

export const validateAge = (birthDate: string): { isValid: boolean; error?: string } => {
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    // Hasn't had birthday this year yet
    const actualAge = age - 1;
    if (actualAge < 18) {
      return {
        isValid: false,
        error: 'El solicitante debe ser mayor de 18 años'
      };
    }
  } else if (age < 18) {
    return {
      isValid: false,
      error: 'El solicitante debe ser mayor de 18 años'
    };
  }

  return {
    isValid: true
  };
};

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: true }; // Email is optional
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Formato de correo electrónico inválido'
    };
  }

  return {
    isValid: true
  };
};

export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return 'Q0.00';
  
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

export const formatCUI = (cui: string): string => {
  const cleanCUI = cui.replace(/[\s-]/g, '');
  if (cleanCUI.length <= 4) return cleanCUI;
  if (cleanCUI.length <= 9) {
    return `${cleanCUI.slice(0, 4)} ${cleanCUI.slice(4)}`;
  }
  return `${cleanCUI.slice(0, 4)} ${cleanCUI.slice(4, 9)} ${cleanCUI.slice(9)}`;
};

export const formatNIT = (nit: string): string => {
  const cleanNIT = nit.replace(/[\s-]/g, '');
  if (cleanNIT.length <= 8) return cleanNIT;
  return `${cleanNIT.slice(0, 8)}-${cleanNIT.slice(8)}`;
};