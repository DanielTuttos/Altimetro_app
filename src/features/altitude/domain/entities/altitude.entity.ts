export type AltitudeSource = 'GPS' | 'BAROMETER' | 'DEM_API' | 'FUSED';

export interface AltitudeCoordinates {
  latitude: number;
  longitude: number;
}

export class Altitude {
  constructor(
    public readonly meters: number,
    public readonly verticalAccuracyMeters: number | null,
    public readonly source: AltitudeSource,
    public readonly coordinates: AltitudeCoordinates | null,
    public readonly pressureHpa: number | null,
    public readonly timestamp: number
  ) {}

  public get metersFormatted(): string {
    return Math.round(this.meters).toLocaleString();
  }

  public get isHighPrecision(): boolean {
    if (this.verticalAccuracyMeters === null) return false;
    return this.verticalAccuracyMeters <= 10;
  }
}
