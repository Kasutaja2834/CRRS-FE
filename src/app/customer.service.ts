import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/environment';
import { CustomerDTO } from './models/customerDTO';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.baseUrl}/api/v1/customer`;

  constructor(private http: HttpClient, private authService: AuthService) { }


  registerCustomer(customer: CustomerDTO): Observable<any> {
     const  headers= new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      });

      return this.http.post(`${this.apiUrl}/add`, customer, { headers });
    }
  

  // Saada POST päring kliendi andmete salvestamiseks
  // saveCustomerData(data: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/add`, data);
  // }

  getCustomerData(customerId: string): Observable<CustomerDTO> {
    // Siin me teeme päringu BE-le, et saada konkreetse kliendi andmed tema ID põhjal
    return this.http.get<CustomerDTO>(`${this.apiUrl}/${customerId}`);
  }
}