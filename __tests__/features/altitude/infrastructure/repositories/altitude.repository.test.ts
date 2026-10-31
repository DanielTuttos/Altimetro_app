import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as Location from 'expo-location';
import { AltitudeRepository } from '../../../../../src/features/altitude/infrastructure/repositories/altitude.repository';
import { OpenMeteoDatasource } from '../../../../../src/features/altitude/infrastructure/datasources/open-meteo.datasource';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  getLastKnownPositionAsync: jest.fn(),
  watchPositionAsync: jest.fn(),
  PermissionStatus: { GRANTED: 'granted' },
  Accuracy: { High: 4, Balanced: 3 },
}));

jest.mock('expo-sensors', () => ({
  Barometer: {
    isAvailableAsync: jest.fn<() => Promise<boolean>>().mockResolvedValue(false),
    addListener: jest.fn(),
  },
}));

describe('AltitudeRepository', () => {
  let repository: AltitudeRepository;
  let mockOpenMeteo: jest.Mocked<OpenMeteoDatasource>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOpenMeteo = {
      getElevation: jest.fn(),
    } as unknown as jest.Mocked<OpenMeteoDatasource>;
    repository = new AltitudeRepository(mockOpenMeteo);
  });

  it('debe devolver elevación DEM cuando el GPS devuelve altitud de emulador (ej: 5m) y Quito está a 2828m', async () => {
    (Location.getForegroundPermissionsAsync as unknown as jest.Mock<() => Promise<any>>).mockResolvedValue({
      status: 'granted',
    });
    (Location.getCurrentPositionAsync as unknown as jest.Mock<() => Promise<any>>).mockResolvedValue({
      coords: {
        latitude: -0.2233,
        longitude: -78.5141,
        altitude: 5,
        altitudeAccuracy: 5,
      },
      timestamp: 10000,
    });

    mockOpenMeteo.getElevation.mockResolvedValue(2828);

    const altitude = await repository.getCurrentAltitude();

    expect(altitude.meters).toBe(2828);
    expect(altitude.source).toBe('DEM_API');
    expect(mockOpenMeteo.getElevation).toHaveBeenCalledWith(-0.2233, -78.5141);
  });

  it('debe mantener altitud GPS si es precisa y consistente con la elevación de terreno', async () => {
    (Location.getForegroundPermissionsAsync as unknown as jest.Mock<() => Promise<any>>).mockResolvedValue({
      status: 'granted',
    });
    (Location.getCurrentPositionAsync as unknown as jest.Mock<() => Promise<any>>).mockResolvedValue({
      coords: {
        latitude: 10.0,
        longitude: -75.0,
        altitude: 12,
        altitudeAccuracy: 3,
      },
      timestamp: 10000,
    });

    mockOpenMeteo.getElevation.mockResolvedValue(10);

    const altitude = await repository.getCurrentAltitude();

    expect(altitude.meters).toBe(12);
    expect(altitude.source).toBe('GPS');
  });
});

