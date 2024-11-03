import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private icaoSource = new BehaviorSubject<string | null>(null);
  currentIcao = this.icaoSource.asObservable();

  /**
   * @function changeIcao
   * @description facilita el envío del ICAO entre FavoritesComponent y HomeComponent
   */
  changeIcao(icao: string) {
    this.icaoSource.next(icao);
  }
  constructor() { }
}
