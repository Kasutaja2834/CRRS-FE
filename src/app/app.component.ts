import { Component, OnInit,EventEmitter  } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NotificationService } from './notification.service';
import { Title } from '@angular/platform-browser';
import { environment } from './environments/environment';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './auth/login/login.component';  // Impordi LoginComponent
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth/auth.service';  // Lisa AuthService

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [LoginComponent, RouterOutlet, RouterLink, CommonModule, FormsModule]
})
export class AppComponent implements OnInit {
  title = 'Car Rental Reservation System';
  notificationMessage: string = '';
  logoUrl: string = `${environment.baseUrl}/api/v1/rental/1/image`;

  showAuthModal: boolean = false; // Modaalakna olek
  isLoginMode: boolean = true; // Kontrollib, kas kuvada login või signup vorm
  userTypeC : string ="CUSTOMER";
  loginData = { username: '', password: '' };  // Lisa loginData mudel
  signupData = { username: '', password: '', userType: this.userTypeC };  // Lisa signupData mudel

// Loo EventEmitter login/signup sündmuse jaoks
loginEvent: EventEmitter<{  message: string, token: string, userId: number }> = new EventEmitter();
signupEvent: EventEmitter<{  message: string, token: string, userId: number }> = new EventEmitter();//= new EventEmitter<{ token: string, userId: number }>();


  constructor(
    private notificationService: NotificationService,
    private titleService: Title,
    public authService: AuthService  // Lisa AuthService konstruktorisse
  ) { }

  ngOnInit(): void {
    // Kuula signupEvent-i, kui see käivitatakse (nt CarListComponent'ist)
    this.signupEvent.subscribe((response) => {
      console.log('Signup Event received: ', response);
    });

    this.loginEvent.subscribe((response) => {
      console.log('Login Event received: ', response);
    });
  
    this.titleService.setTitle(this.title);
    this.authService.loginModalEmitter.subscribe(() => {
      this.openAuthModal();
    });
    this.notificationService.notification$.subscribe(message => {
      this.notificationMessage = message;

    });
  }

  // Login funktsioon
  modalLogin() {
    console.log('Login attempt:', this.loginData);
    this.notificationService.setNotification('Login attempt: '+ this.loginData.toString());
    if (this.loginData.username && this.loginData.password) {
      this.authService.login(this.loginData).subscribe({
        next: (response) => {
          console.log('Sisselogimine edukas:', response);
          this.notificationService.setNotification(response.message);
          this.authService.setToken(response.token); // Salvesta token
          this.loginEvent.emit({
            message: response.message, 
            token: response.token,
            userId: response.userId }); // Emit login sündmus
          this.clearForms(); // Tühjenda vormiväljad pärast edukat login'i
          this.notificationService.clearNotification(); // Tühjenda teated
          this.closeAuthModal(); // Sulge modal
        },
        error: (error) => {
          console.error('Sisselogimise viga:', error);
          if (error.status === 400) {
            this.notificationService.setNotification('Vale kasutajanimi või parool.');
          } else if (error.status === 403) {
            this.notificationService.setNotification('Ligipääs keelatud. Palun kontrollige oma kasutajanime ja parooli.');
        }else {
          this.notificationService.setNotification('Sisselogimise käigus tekkis tundmatu viga. Palun proovige uuesti.');
        }
      }
      });
    } else {
      this.notificationService.setNotification('Palun sisestage kasutajanimi ja parool.');
    }
  }

  // Signup funktsioon
  // signup(userType: string) {
  signup() {
    if (this.signupData.username && this.signupData.password) {
     
      //this.signupData = { ...this.signupData, userType:this.userTypeC };

      this.authService.signup(this.signupData).subscribe({
        next: (response) => {
          console.log('Registreerimine edukas:', response);
          this.notificationService.setNotification(response.message);
          this.authService.setToken(response.token); // Salvesta token
            // Emiti ka "userId" kui on signup
          this.signupEvent.emit({
            message: response.message, 
             token: response.token, 
             userId: response.userId }); // Emit signup sündmus
          this.clearForms(); // Tühjenda vormiväljad pärast edukat registreerimist
          this.notificationService.clearNotification(); // Tühjenda teated
          this.closeAuthModal(); // Sulge modal
        },
        error: (error) => {
          console.error('Registreerimise viga:', error);
          if (error.status === 400 && error.error.message === 'Viga: Kasutajanimi on juba võetud!') {
            this.notificationService.setNotification('Kasutajanimi on juba võetud. Palun valige uus kasutajanimi.');
          } else {
            this.notificationService.setNotification('Registreerimise käigus ilmnes tundmatu viga.');
          }
        }
      });
    } else {
      this.notificationService.setNotification('Palun sisestage kasutajanimi ja parool.');
    }
  }

  // Login modal funktsioonid avamiseks ja sulgemiseks
  // Modalakna avamine ja sulgemine
  openAuthModal(): void { // siia tuleb navi login
    this.showAuthModal = true;
  }

  closeAuthModal(): void {
    this.showAuthModal = false;
  }


  // Funktsioon, et vahetada login ja signup vormi vahel
  toggleAuthMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  // Tühjendame vormiväljad
  clearForms(): void {
    this.loginData = { username: '', password: '' };
    // this.signupData = { username: '', password: '' };

    // Kui vorm tühjendatakse, määrame userType kas vaikimisi 'CUSTOMER' või jätame selle vastavaks lehelt tulevale määratlusele
    this.signupData = { username: '', password: '', userType: '' };
  }

  logout() {
    this.authService.logout(); // Kutsume authService.logout(), mis eemaldab tokeni
    this.closeAuthModal(); // Tagame, et modaalaken sulgub
  }

}
