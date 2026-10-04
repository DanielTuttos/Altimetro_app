import { create } from 'zustand';
import { Altitude } from '../../domain/entities/altitude.entity';
import { GetCurrentAltitudeUseCase } from '../../domain/usecases/get-current-altitude.usecase';
import { SubscribeAltitudeUseCase } from '../../domain/usecases/subscribe-altitude.usecase';
import { AltitudeRepository } from '../../infrastructure/repositories/altitude.repository';

interface AltitudeState {
  altitude: Altitude | null;
  loading: boolean;
  permissionGranted: boolean;
  error: string | null;
  
  // Acciones
  initialize: () => Promise<void>;
  refresh: () => Promise<void>;
  requestPermissions: () => Promise<boolean>;
}

const repository = new AltitudeRepository();
const getCurrentAltitudeUseCase = new GetCurrentAltitudeUseCase(repository);
const subscribeAltitudeUseCase = new SubscribeAltitudeUseCase(repository);

let unsubscribe: (() => void) | null = null;

export const useAltitudeStore = create<AltitudeState>((set, get) => ({
  altitude: null,
  loading: true,
  permissionGranted: true,
  error: null,

  initialize: async () => {
    set({ loading: true, error: null });
    try {
      const hasPerm = await repository.hasPermissions();
      if (!hasPerm) {
        const granted = await repository.requestPermissions();
        if (!granted) {
          set({ permissionGranted: false, loading: false, error: 'Permisos de ubicación requeridos' });
          return;
        }
      }

      set({ permissionGranted: true });
      const current = await getCurrentAltitudeUseCase.execute();
      set({ altitude: current, loading: false });

      // Suscribirse a cambios en tiempo real
      if (unsubscribe) unsubscribe();
      unsubscribe = subscribeAltitudeUseCase.execute((newAltitude) => {
        set({ altitude: newAltitude });
      });
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Error al obtener altitud' });
    }
  },

  refresh: async () => {
    set({ loading: true, error: null });
    try {
      const current = await getCurrentAltitudeUseCase.execute();
      set({ altitude: current, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Error al actualizar altitud' });
    }
  },

  requestPermissions: async () => {
    const granted = await repository.requestPermissions();
    set({ permissionGranted: granted });
    if (granted) {
      get().initialize();
    }
    return granted;
  },
}));
