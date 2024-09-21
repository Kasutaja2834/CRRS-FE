import { Injectable, EventEmitter  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken'; // Kohalik salvestusvõti
  private apiUrl = `${environment.baseUrl}/api/v1/auth`;
  private showLoginModal = false;

   // EventEmitter, et teavitada modaalakna avamisest
   loginModalEmitter: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient, private router: Router) { }
 // Avab login modaali, saates sündmuse
 openLoginModal(): void {
  this.loginModalEmitter.emit();
}
getCurrentUserId(): string {
  // Tagasta praeguse kasutaja ID localStoragest või tokenist
  return localStorage.getItem('userId') || '';
}
signupWithUserType(username: string, password: string, userType: string): Observable<any> {
  return this.signup({ username, password, userType });
}
  
  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data)
      .pipe(tap((result: any) => {
        localStorage.setItem(this.tokenKey, result.token);
        localStorage.setItem('userId', result.userId);  // Salvesta userId ka
      }));
  }

  signup(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      username: data.username,
      password: data.password,
      userType: data.userType // Lisame userType
    }).pipe(tap((result: any) => {
      localStorage.setItem(this.tokenKey, result.token);
      localStorage.setItem('userId', result.userId);  // Salvesta userId ka
    }));
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
    // return true
  }

  // logout(): void {
  //   localStorage.removeItem(this.tokenKey);// Kustuta token
  //   this.router.navigate(['/login']);// Suuna login lehele
  // }

  logout(): void {
    localStorage.removeItem(this.tokenKey); // Kustuta token
   // this.closeAuthModal(); // Sulge modal aken kui see on avatud
    this.router.navigate(['/']); // Suuna kasutaja tagasi pealehele (nt 'car-list' komponent)
}


  private isTokenExpired(token: string): boolean {
    const expirationDate = this.getTokenExpirationDate(token);
    return expirationDate ? expirationDate < new Date() : false;
  }

  private getTokenExpirationDate(token: string): Date | null {
    const decodedToken = this.decodeToken(token);
    if (!decodedToken.exp) {
      return null;
    }
    const date = new Date(0);
    date.setUTCSeconds(decodedToken.exp);
    return date;
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }

  startLogoutTimer(): void {
    const timeoutDuration = 5 * 60 * 1000; // 5 minutit millisekundites
    setTimeout(() => {
      this.logout();
      alert('Teie sessioon aegus inaktiivsuse tõttu. Palun logige uuesti sisse.');
    }, timeoutDuration);
  }

  // openLoginModal(): void {// siis tuleb car-list
  //   this.showLoginModal = true;
  // }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  isLoginModalOpen(): boolean {
    return this.showLoginModal;
  }
}
