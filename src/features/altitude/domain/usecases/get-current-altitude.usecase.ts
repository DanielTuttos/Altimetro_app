import { Altitude } from '../entities/altitude.entity';
import { IAltitudeRepository } from '../repositories/altitude.repository.interface';

export class GetCurrentAltitudeUseCase {
  constructor(private readonly altitudeRepository: IAltitudeRepository) {}

  public async execute(): Promise<Altitude> {
    const hasPermission = await this.altitudeRepository.hasPermissions();
    if (!hasPermission) {
      const granted = await this.altitudeRepository.requestPermissions();
      if (!granted) {
        throw new Error('Permiso de ubicación no concedido');
      }
    }
    return await this.altitudeRepository.getCurrentAltitude();
  }
}
