import { Altitude } from '../entities/altitude.entity';
import { IAltitudeRepository } from '../repositories/altitude.repository.interface';

export class SubscribeAltitudeUseCase {
  constructor(private readonly altitudeRepository: IAltitudeRepository) {}

  public execute(onAltitude: (altitude: Altitude) => void): () => void {
    return this.altitudeRepository.subscribeToAltitudeChanges(onAltitude);
  }
}
