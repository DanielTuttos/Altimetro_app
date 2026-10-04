import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Altitude } from '../../../../src/features/altitude/domain/entities/altitude.entity';
import { GetCurrentAltitudeUseCase } from '../../../../src/features/altitude/domain/usecases/get-current-altitude.usecase';
import { IAltitudeRepository } from '../../../../src/features/altitude/domain/repositories/altitude.repository.interface';

describe('GetCurrentAltitudeUseCase', () => {
  let mockRepository: jest.Mocked<IAltitudeRepository>;
  let useCase: GetCurrentAltitudeUseCase;

  beforeEach(() => {
    mockRepository = {
      requestPermissions: jest.fn() as any,
      hasPermissions: jest.fn() as any,
      getCurrentAltitude: jest.fn() as any,
      subscribeToAltitudeChanges: jest.fn() as any,
    };
    useCase = new GetCurrentAltitudeUseCase(mockRepository);
  });

  it('debe solicitar permisos si no los tiene y obtener la altitud si son concedidos', async () => {
    const expectedAltitude = new Altitude(2600, 5, 'GPS', { latitude: 4.6, longitude: -74.0 }, null, Date.now());
    
    mockRepository.hasPermissions.mockResolvedValue(false);
    mockRepository.requestPermissions.mockResolvedValue(true);
    mockRepository.getCurrentAltitude.mockResolvedValue(expectedAltitude);

    const result = await useCase.execute();

    expect(mockRepository.hasPermissions).toHaveBeenCalled();
    expect(mockRepository.requestPermissions).toHaveBeenCalled();
    expect(mockRepository.getCurrentAltitude).toHaveBeenCalled();
    expect(result.meters).toBe(2600);
    expect(result.metersFormatted).toBe(Math.round(2600).toLocaleString());
  });

  it('debe lanzar error si el permiso es rechazado', async () => {
    mockRepository.hasPermissions.mockResolvedValue(false);
    mockRepository.requestPermissions.mockResolvedValue(false);

    await expect(useCase.execute()).rejects.toThrow('Permiso de ubicación no concedido');
    expect(mockRepository.getCurrentAltitude).not.toHaveBeenCalled();
  });
});
