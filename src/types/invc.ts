export interface INVCDeclaredData {
  datosPersonales: {
    nombre: string;
    dpi: string;
    celular: string;
    telefono: string;
  };
  actividad: {
    activa: boolean;
    productos: string[];
  };
  ingresos: number;
  egresos: number;
  producto: {
    tipo: string;
    monto: number;
    cuota: number;
    plazo: number;
  };
  fiadores: Array<{
    id: string;
    nombre: string;
    dpi: string;
    relacion: string;
  }>;
  direccionNegocio: {
    lat: number;
    lng: number;
    direccion: string;
  };
}

export interface INVCObservedData {
  datosPersonales: {
    nombre: string;
    dpi: string;
    celular: string;
    telefono: string;
  };
  actividad: {
    activa: boolean;
    productos: string[];
    comentario?: string;
  };
  ingresos: number;
  egresos: number;
  producto: {
    tipo: string;
    monto: number;
    cuota: number;
    plazo: number;
  };
  fiadores: Array<{
    id: string;
    encontrado: boolean;
    coincide: boolean;
    comentario: string;
    foto?: string;
  }>;
}

export interface INVCDifference {
  campo: string;
  valor_declarado: any;
  valor_observado: any;
  delta: number;
  severidad: 'media';
  comentario: string;
  evidencia?: string;
}

export interface INVCPhoto {
  url: string;
  geotag: {
    lat: number;
    lng: number;
    accuracy: number;
  };
  timestamp: string;
}

export interface INVCPhotometry {
  negocio_ok: boolean;
  solicitante_ok: boolean;
  geo_ok: boolean;
  distancia_negocio?: number;
  distancia_solicitante?: number;
}

export interface INVCData {
  solicitudId: string;
  declarado: INVCDeclaredData;
  observado: Partial<INVCObservedData>;
  diffs: INVCDifference[];
  fotometria: INVCPhotometry;
  evidencias: {
    fotosPrevias: string[];
    fotosNuevas: {
      negocio?: INVCPhoto;
      solicitante?: INVCPhoto;
    };
  };
  comentarioGeneral?: string;
  estado: 'iniciado' | 'en_progreso' | 'completado' | 'pendiente';
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface INVCSection {
  id: string;
  title: string;
  status: 'pending' | 'completed' | 'discrepancy';
  pendingCount: number;
}

export interface INVCValidationResult {
  isValid: boolean;
  blockedReasons: string[];
  warnings: string[];
}