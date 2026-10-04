import { Altitude } from '../entities/altitude.entity';

export interface IAltitudeRepository {
  requestPermissions(): Promise<boolean>;
  hasPermissions(): Promise<boolean>;
  getCurrentAltitude(): Promise<Altitude>;
  subscribeToAltitudeChanges(onAltitude: (altitude: Altitude) => void): () => void;
}
