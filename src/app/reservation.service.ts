import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/environment';
import { Reservation } from './models/resrervationModel';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = `${environment.baseUrl}/api/v1/reservation/minimal-reservations`;

  constructor(private http: HttpClient) {}

  getReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`); //See toob MinimalResrvation data
  }

  issueCar(reservation: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${reservation.Id}/pickup/add")`, {});
  }

  returnCar(reservation: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${reservation.Id}/return/add`, {});
  }
  createReservation(reservation: Reservation): Observable<Reservation> {
    // Siin saadame BE-le POST-päringu, et luua uus broneering
    return this.http.post<Reservation>(`${this.apiUrl}/add`, reservation);
  }

}
