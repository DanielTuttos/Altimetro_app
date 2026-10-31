import * as Location from 'expo-location';
import { Barometer } from 'expo-sensors';
import { LocationPermissionFailure, UnknownFailure } from '../../../../core/errors/failures';
import { Altitude, AltitudeSource } from '../../domain/entities/altitude.entity';
import { IAltitudeRepository } from '../../domain/repositories/altitude.repository.interface';
import { OpenMeteoDatasource } from '../datasources/open-meteo.datasource';

export class AltitudeRepository implements IAltitudeRepository {
  private lastDemCache: { lat: number; lng: number; elevation: number } | null = null;

  constructor(private readonly openMeteoDatasource: OpenMeteoDatasource = new OpenMeteoDatasource()) {}

  public async requestPermissions(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === Location.PermissionStatus.GRANTED;
  }

  public async hasPermissions(): Promise<boolean> {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === Location.PermissionStatus.GRANTED;
  }

  private async fetchDemElevation(lat: number, lng: number): Promise<number | null> {
    try {
      if (
        this.lastDemCache &&
        Math.abs(this.lastDemCache.lat - lat) < 0.001 &&
        Math.abs(this.lastDemCache.lng - lng) < 0.001
      ) {
        return this.lastDemCache.elevation;
      }
      const elevation = await this.openMeteoDatasource.getElevation(lat, lng);
      this.lastDemCache = { lat, lng, elevation };
      return elevation;
    } catch {
      return null;
    }
  }

  private resolveAltitude(
    gpsAltitude: number,
    verticalAccuracy: number | null,
    demElevation: number | null
  ): { meters: number; source: AltitudeSource } {
    if (demElevation !== null) {
      const isGpsUnreliable =
        gpsAltitude === 0 ||
        verticalAccuracy === null ||
        verticalAccuracy > 25 ||
        Math.abs(gpsAltitude - demElevation) > 50;

      if (isGpsUnreliable) {
        return { meters: demElevation, source: 'DEM_API' };
      }
    }
    return { meters: gpsAltitude, source: 'GPS' };
  }

  public async getCurrentAltitude(): Promise<Altitude> {
    try {
      const hasPerm = await this.hasPermissions();
      if (!hasPerm) {
        throw new LocationPermissionFailure();
      }

      let location: Location.LocationObject | null = null;
      try {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      } catch {
        try {
          location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Lowest,
          });
        } catch {
          location = await Location.getLastKnownPositionAsync({});
        }
      }

      if (!location) {
        throw new Error('No se pudo obtener la posición del dispositivo');
      }

      const gpsMeters = location.coords.altitude ?? 0;
      const verticalAccuracy = location.coords.altitudeAccuracy ?? null;
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;

      const demElevation = await this.fetchDemElevation(lat, lng);
      const { meters, source } = this.resolveAltitude(gpsMeters, verticalAccuracy, demElevation);

      return new Altitude(
        meters,
        verticalAccuracy,
        source,
        { latitude: lat, longitude: lng },
        null,
        location.timestamp
      );
    } catch (error) {
      if (error instanceof LocationPermissionFailure) {
        throw error;
      }
      throw new UnknownFailure(error instanceof Error ? error.message : 'Error al obtener altitud');
    }
  }

  public subscribeToAltitudeChanges(onAltitude: (altitude: Altitude) => void): () => void {
    let locationSubscription: Location.LocationSubscription | null = null;
    let barometerSubscription: { remove: () => void } | null = null;

    let latestMeters = 0;
    let latestSource: AltitudeSource = 'GPS';
    let latestLat = 0;
    let latestLng = 0;
    let latestAccuracy: number | null = null;

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 2000,
        distanceInterval: 1,
      },
      async (loc) => {
        const gpsMeters = loc.coords.altitude ?? 0;
        latestLat = loc.coords.latitude;
        latestLng = loc.coords.longitude;
        latestAccuracy = loc.coords.altitudeAccuracy ?? null;

        const demElevation = await this.fetchDemElevation(latestLat, latestLng);
        const { meters, source } = this.resolveAltitude(gpsMeters, latestAccuracy, demElevation);

        latestMeters = meters;
        latestSource = source;

        onAltitude(
          new Altitude(
            latestMeters,
            latestAccuracy,
            latestSource,
            { latitude: latestLat, longitude: latestLng },
            null,
            loc.timestamp
          )
        );
      }
    ).then((sub) => {
      locationSubscription = sub;
    });

    // Escuchar barómetro para micro-cambios si está disponible
    Barometer.isAvailableAsync().then((isAvailable) => {
      if (isAvailable) {
        barometerSubscription = Barometer.addListener((data) => {
          if (data.pressure && latestMeters !== 0) {
            onAltitude(
              new Altitude(
                latestMeters,
                latestAccuracy,
                'FUSED',
                { latitude: latestLat, longitude: latestLng },
                data.pressure,
                Date.now()
              )
            );
          }
        });
      }
    });

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
      if (barometerSubscription) {
        barometerSubscription.remove();
      }
    };
  }
}

