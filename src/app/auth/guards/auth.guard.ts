import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';  // Siin sõltub teenusest, mis jälgib kasutaja autentimist


@Injectable({
    providedIn: 'root'
  })
  export class AuthGuard implements CanActivate {
  
    constructor(private authService: AuthService, private router: Router) {}
  
    canActivate(): boolean {
      if (this.authService.isAuthenticated()) {
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    }
  }
