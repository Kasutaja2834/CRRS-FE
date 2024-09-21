import { Routes, provideRouter } from '@angular/router';
import { CarListComponent } from './car-list/car-list.component';
import { ReservationComponent } from './reservation/reservation.component';  // Lisa uus komponent
//import { HomeComponent } from '../home/home.component'; // Kui olemas
import { StatisticsComponent } from './statistics/statistics.component'; // Ajutiselt välja kommenteeritud
import{LoginComponent} from './../app/auth/login/login.component'
import { AuthGuard } from './auth/guards/auth.guard';  // Kaitseb marsruute
import { PartnersComponent } from './partners/partners.component';

export const routes: Routes = [
    { path: 'customer', component: CarListComponent },
    { path: 'reservations', component: ReservationComponent }, // Eemaldame canActivate
    { path: 'partners', component: PartnersComponent },
    { path: 'statistics', component: StatisticsComponent },
    { path: '', redirectTo: '/customer', pathMatch: 'full' }
  ];
  
 
 //Sama authentimisega
 
  // const routes: Routes = [
  //   { path: 'customer', component: CarListComponent },
  //   { path: 'reservations', component: ReservationsManagementComponent, canActivate: [AuthGuard] }, 
  //   { path: 'partners-management', component: PartnersManagementComponent, canActivate: [AuthGuard] },
  //   { path: 'statistics', component: StatisticsComponent, canActivate: [AuthGuard] },
  //   { path: '', redirectTo: '/customer', pathMatch: 'full' }
  // ];





//   { path: '', component: CarListComponent },   // Customer leht
//   { path: 'login', component: LoginComponent },
//   { path: 'reservations', component: ReservationComponent, canActivate: [AuthGuard] },  // Kaitstud marsruut
//  // { path: 'protected-route', component: ProtectedComponent, canActivate: [AuthGuard] }
//   // { path: 'statistics', component: StatisticsComponent }, // Statistics leht
//   { path: '**', redirectTo: '' } // Vaikimisi suunamine
// ];

// export const routes: Routes = [
//   { path: '', component: CarListComponent },
//   { path: '**', redirectTo: '' }
// ];see lisatud, tegelikkult tuleb lisada ka impordid