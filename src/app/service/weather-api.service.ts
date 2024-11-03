import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WeatherApiService {
  apiKey: any = 'a1557e78eade4665b44fa164f6';
  nombre?: string;

  constructor(public http: HttpClient) {}

  /**
 * @function obtenerDatos
 * @description Obtener datos a traves de la API
 */
  obtenerDatos(icao: string) {
    return this.http.get(
      'https://api.checkwx.com/metar/' + icao + '/decoded?x-api-key=' + this.apiKey
    );
  }
}
