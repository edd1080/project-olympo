import { ApplicationData } from '@/types/invc-comparison';
import { GeoLocation } from '@/types/invc';

// Datos simulados de solicitudes para pruebas de comparación
export const mockApplicationsData: Record<string, ApplicationData> = {
  'APP001': {
    applicationId: 'APP001',
    applicantName: 'María José García López',
    applicantInfo: {
      fullName: 'María Elena González Pérez',
      dpi: '2356 78901 1234',
      phone: '2234-5678',
      mobile: '5555-1234',
      photo: '/api/photos/applicant_001.jpg',
      address: 'Calle Principal 123, Zona 1, Guatemala',
      coordinates: {
        latitude: 14.6349,
        longitude: -90.5069,
        accuracy: 10
      }
    },
    economicActivity: {
      businessType: 'Tienda de abarrotes',
      businessName: 'Tienda María',
      isActive: true,
      products: [
        'Productos básicos',
        'Bebidas gaseosas',
        'Snacks',
        'Productos de limpieza',
        'Frutas y verduras'
      ],
      businessPhoto: '/api/photos/business_001.jpg'
    },
    financialInfo: {
      monthlyIncome: 8500,
      monthlyExpenses: 5200,
      creditAmount: 15000,
      term: 12,
      installment: 1450
    },
    guarantors: [
      {
        id: 'G001',
        fullName: 'Carlos Roberto Morales',
        dpi: '1234 56789 0123',
        relationship: 'Esposo',
        phone: '5555-5678'
      },
      {
        id: 'G002',
        fullName: 'Ana Lucía Hernández',
        dpi: '9876 54321 0987',
        relationship: 'Hermana',
        phone: '5555-9012'
      }
    ],
    metadata: {
      createdAt: new Date('2024-01-15T10:30:00'),
      agentId: 'AGT001',
      lastModified: new Date('2024-01-16T14:20:00')
    }
  },

  'APP002': {
    applicationId: 'APP002',
    applicantName: 'Carlos Eduardo Mendoza',
    applicantInfo: {
      fullName: 'José Antonio Ruiz López',
      dpi: '3456 78901 2345',
      phone: '2345-6789',
      mobile: '4444-2345',
      photo: '/api/photos/applicant_002.jpg',
      address: 'Avenida Reforma 456, Zona 9, Guatemala',
      coordinates: {
        latitude: 14.6050,
        longitude: -90.5150,
        accuracy: 15
      }
    },
    economicActivity: {
      businessType: 'Carpintería',
      businessName: 'Muebles Ruiz',
      isActive: true,
      products: [
        'Muebles de madera',
        'Reparaciones',
        'Muebles a medida',
        'Puertas y ventanas'
      ],
      businessPhoto: '/api/photos/business_002.jpg'
    },
    financialInfo: {
      monthlyIncome: 12000,
      monthlyExpenses: 7500,
      creditAmount: 25000,
      term: 18,
      installment: 1850
    },
    guarantors: [
      {
        id: 'G003',
        fullName: 'Rosa María Ruiz',
        dpi: '2345 67890 1234',
        relationship: 'Esposa',
        phone: '4444-6789'
      }
    ],
    metadata: {
      createdAt: new Date('2024-01-18T09:15:00'),
      agentId: 'AGT002',
      lastModified: new Date('2024-01-19T11:45:00')
    }
  },

  'APP003': {
    applicationId: 'APP003',
    applicantName: 'Ana Patricia Rodríguez',
    applicantInfo: {
      fullName: 'Carmen Sofía Díaz Martínez',
      dpi: '4567 89012 3456',
      phone: '2456-7890',
      mobile: '3333-3456',
      photo: '/api/photos/applicant_003.jpg',
      address: 'Colonia El Milagro, Casa 789, Villa Nueva',
      coordinates: {
        latitude: 14.5253,
        longitude: -90.5880,
        accuracy: 20
      }
    },
    economicActivity: {
      businessType: 'Venta de comida',
      businessName: 'Comedor Sofía',
      isActive: true,
      products: [
        'Desayunos típicos',
        'Almuerzos',
        'Refacciones',
        'Bebidas naturales',
        'Postres caseros'
      ],
      businessPhoto: '/api/photos/business_003.jpg'
    },
    financialInfo: {
      monthlyIncome: 6800,
      monthlyExpenses: 4200,
      creditAmount: 10000,
      term: 8,
      installment: 1350
    },
    guarantors: [
      {
        id: 'G004',
        fullName: 'Miguel Ángel Díaz',
        dpi: '3456 78901 2345',
        relationship: 'Hermano',
        phone: '3333-7890'
      },
      {
        id: 'G005',
        fullName: 'Lucía Esperanza Martínez',
        dpi: '5678 90123 4567',
        relationship: 'Madre',
        phone: '2456-1234'
      }
    ],
    metadata: {
      createdAt: new Date('2024-01-20T14:22:00'),
      agentId: 'AGT001',
      lastModified: new Date('2024-01-21T16:10:00')
    }
  },

  // Caso con discrepancias menores
  'APP004': {
    applicationId: 'APP004',
    applicantName: 'José Luis Hernández',
    applicantInfo: {
      fullName: 'Pedro Pablo Morales Castillo',
      dpi: '5678 90123 4567',
      phone: '2567-8901',
      mobile: '2222-4567',
      photo: '/api/photos/applicant_004.jpg',
      address: 'Barrio San José, Calle 12, Mixco',
      coordinates: {
        latitude: 14.6308,
        longitude: -90.6067,
        accuracy: 25
      }
    },
    economicActivity: {
      businessType: 'Ferretería',
      businessName: 'Ferretería El Clavo',
      isActive: true,
      products: [
        'Herramientas',
        'Materiales de construcción',
        'Tornillería',
        'Pinturas',
        'Tuberías y accesorios'
      ],
      businessPhoto: '/api/photos/business_004.jpg'
    },
    financialInfo: {
      monthlyIncome: 15000,  // Posible sobreestimación
      monthlyExpenses: 8000,
      creditAmount: 30000,
      term: 24,
      installment: 1650
    },
    guarantors: [
      {
        id: 'G006',
        fullName: 'Patricia Aracely Castillo',
        dpi: '6789 01234 5678',
        relationship: 'Esposa',
        phone: '2222-8901'
      }
    ],
    metadata: {
      createdAt: new Date('2024-01-22T08:30:00'),
      agentId: 'AGT003',
      lastModified: new Date('2024-01-23T10:15:00')
    }
  },

  // Caso con discrepancias críticas
  'APP005': {
    applicationId: 'APP005',
    applicantName: 'Sofía Elena Morales',
    applicantInfo: {
      fullName: 'Roberto Carlos Jiménez Vega',
      dpi: '6789 01234 5678',
      phone: '2678-9012',
      mobile: '1111-5678',
      photo: '/api/photos/applicant_005.jpg',
      address: 'Zona 18, Colonia El Esfuerzo, Guatemala',
      coordinates: {
        latitude: 14.6762,
        longitude: -90.5569,
        accuracy: 30
      }
    },
    economicActivity: {
      businessType: 'Venta de ropa',
      businessName: 'Boutique Roberto',
      isActive: false,  // ¡Negocio inactivo!
      products: [
        'Ropa para dama',
        'Ropa para caballero',
        'Accesorios',
        'Zapatos'
      ],
      businessPhoto: '/api/photos/business_005.jpg'
    },
    financialInfo: {
      monthlyIncome: 20000,  // Ingresos muy inflados
      monthlyExpenses: 6000,  // Gastos subestimados
      creditAmount: 50000,   // Monto muy alto
      term: 36,
      installment: 1890
    },
    guarantors: [
      {
        id: 'G007',
        fullName: 'Sandra Leticia Vega',
        dpi: '7890 12345 6789',
        relationship: 'Esposa',
        phone: '1111-9012'
      },
      {
        id: 'G008',
        fullName: 'Mario Augusto Jiménez',
        dpi: '8901 23456 7890',
        relationship: 'Padre',
        phone: '2678-3456'
      }
    ],
    metadata: {
      createdAt: new Date('2024-01-25T13:45:00'),
      agentId: 'AGT002',
      lastModified: new Date('2024-01-26T15:30:00')
    }
  }
};

// Función auxiliar para obtener datos de aplicación
export const getApplicationData = (applicationId: string): ApplicationData | null => {
  return mockApplicationsData[applicationId] || null;
};

// Función para generar coordenadas cercanas para pruebas de geolocalización
export const generateNearbyCoordinates = (
  original: GeoLocation, 
  radiusMeters: number = 100
): GeoLocation => {
  // Conversión aproximada: 1 grado ≈ 111,320 metros
  const metersPerDegree = 111320;
  const deltaLat = (Math.random() - 0.5) * 2 * (radiusMeters / metersPerDegree);
  const deltaLng = (Math.random() - 0.5) * 2 * (radiusMeters / metersPerDegree);
  
  return {
    latitude: original.latitude + deltaLat,
    longitude: original.longitude + deltaLng,
    accuracy: Math.random() * 20 + 5 // 5-25 metros de precisión
  };
};

// Escenarios de prueba predefinidos
export const testScenarios = {
  normal: ['APP001', 'APP002', 'APP003'],
  minorDiscrepancies: ['APP004'],
  criticalIssues: ['APP005']
};

export default mockApplicationsData;