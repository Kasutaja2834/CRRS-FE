import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from './environments/environment';
import { CarDTO } from './models/CarDTO'; // Importi DTO
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = `${environment.baseUrl}/api/v1/branch/cars/available-inCity-forPeriod`;


  city: string = ''; // Valitud linn
  dateFrom: string = ''; // Valitud kuupäev (algus)
  dateTo: string = ''; // Valitud kuupäev (lõpp)
  cars: CarDTO[] = []; // Saadaval olevad autod

  constructor(private http: HttpClient) { }

  
  getAvailableCars(city: string, dateFrom: string, dateTo: string): Observable<CarDTO[]> {
    const params = new HttpParams()
      .set('city', city)
      .set('dateFrom', dateFrom)
      .set('dateTo', dateTo);

    return this.http.get<any[]>(this.apiUrl, { params })
      .pipe(
        map(cars => cars.map(car => this.convertToCarDTO(car)))
      );
  }


  private convertToCarDTO(json: any): CarDTO {
    return {
      carId: json.id,
      brand: {
        id: json.brand.id,
        name: json.brand.name
      },
      model: {
        id: json.carModel.id,
        name: json.carModel.name
      },
      bodyType: {
        id: json.bodyType.id,
        name: json.bodyType.name
      },
      color: {
        id: json.carColor.id,
        name: json.carColor.name
      },
      year: json.year,
      carStateNumberPlate: json.carStateNumberPlate,
      mileage: json.mileage,
      status: json.status,
      imagePath: json.imagePath,
      amount: json.amount
     
      // price: json.price, // `price` ei ole vajalik, kuna JSON-is on olemas `amount`
      
    };
  }
}
