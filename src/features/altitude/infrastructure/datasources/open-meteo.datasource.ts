export interface OpenMeteoElevationResponse {
  elevation: number[];
}

export class OpenMeteoDatasource {
  private readonly baseUrl = 'https://api.open-meteo.com/v1/elevation';

  public async getElevation(latitude: number, longitude: number): Promise<number> {
    const url = `${this.baseUrl}?latitude=${latitude}&longitude=${longitude}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo API Error: ${response.statusText}`);
    }
    const data: OpenMeteoElevationResponse = await response.json();
    if (data && data.elevation && data.elevation.length > 0) {
      return data.elevation[0];
    }
    throw new Error('Respuesta inválida de Open-Meteo Elevation API');
  }
}
