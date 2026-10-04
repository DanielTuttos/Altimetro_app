export abstract class Failure {
  constructor(public readonly message: string, public readonly code?: string) {}
}

export class LocationPermissionFailure extends Failure {
  constructor(message = 'Permisos de ubicación denegados') {
    super(message, 'LOCATION_PERMISSION_DENIED');
  }
}

export class SensorUnavailableFailure extends Failure {
  constructor(message = 'Sensor no disponible en este dispositivo') {
    super(message, 'SENSOR_UNAVAILABLE');
  }
}

export class NetworkElevationFailure extends Failure {
  constructor(message = 'No se pudo consultar el servicio de elevación') {
    super(message, 'NETWORK_ELEVATION_FAILED');
  }
}

export class UnknownFailure extends Failure {
  constructor(message = 'Ocurrió un error inesperado') {
    super(message, 'UNKNOWN_ERROR');
  }
}
