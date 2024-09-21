import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';  // Lisage see!
import { CommonModule } from '@angular/common';  // Importige CommonModule
import { tap } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],  // Lisage ReactiveFormsModule siia!
  selector: 'app-login',
  templateUrl: './login.component.html',
  //  imports: [Router]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  //// Meetod sisselogimiseks, mida kasutajaliides käivitab
  // Meetod sisselogimiseks, mida kasutajaliides käivitab

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).pipe(
        tap(response => {
          console.log('Tap vastus:', response);
        })
      ).subscribe({
        next: (response) => {
          console.log('Serveri vastus:', response);
          this.authService.setToken(response.token); // Salvesta token
          this.router.navigate(['/protected-route']);  // Suuna kaitstud teele
        },
        error: (error) => {
          console.error('Login error:', error);
        }
      });
    }
  }

  onSubmit() {
    console.log('Login vorm saadetud-onSubmit');
    this.login();
  }
}