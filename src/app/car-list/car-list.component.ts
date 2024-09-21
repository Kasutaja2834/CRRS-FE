import { Component, OnInit, EventEmitter } from '@angular/core';
import { DataService } from '../data.service';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { CarDTO } from '../models/CarDTO';
import { HttpClient } from '@angular/common/http';  // Impordime HttpClient
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { NotificationService } from '../notification.service'; // Impordi NotificationService
import { AuthService } from '../auth/auth.service'; // Lisatud AuthService
import { CustomerDTO } from '../models/customerDTO';
import { CustomerService } from '../customer.service';
import { ReservationService } from '../reservation.service';
import { AppComponent } from '../app.component';  // Impordi AppComponent

@Component({
  selector: 'app-car-list',
  imports: [CommonModule, NgFor, FormsModule],
  standalone: true,
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})

export class CarListComponent implements OnInit {
  cars: CarDTO[] = [];
  selectedCar: CarDTO | null = null;
  city: string = ''; // City parameeter
  returnCity:string=''; //city to return car
  dateFrom: string = ''; // Kuupäeva algus
  dateTo: string = ''; // Kuupäeva lõpp
  cityList: string[] = ['Tallinn', 'Tartu', 'Narva', 'Pärnu', 'Viljandi', 'Kuressaare', 'Rakvere', 'Jõhvi', 'Paide', 'Võru'];
  selectedCarImageUrl: string | null = null; // Deklareerime selectedCarImageUrl
  returnCityManuallyChanged: boolean = false; // Märge, kas kasutaja on muutnud returnCity
  isLoggedIn: boolean = false; // Kliendi sisselogimise olek
  customerName: string = ''; // Kliendi nimi, kui sisse logitud
  showCustomerModal: boolean = false; // Kliendi andmete modaalakna juhtimine


  // Signup modaalakna ja andmete muutujad
  showSignupModal: boolean = false; // Lisatud registreerimise modaalakna juhtimine
  signupData = { username: '', password: '', userType: 'CUSTOMER' }; // Registreerimisvormi andmed

  // Andmed kliendi registreerimiseks
  customerData: CustomerDTO = {
    customerId: 0, // see võiks lihtsalt algväärtus olle
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    addressCity: '',
    addressCountry: 'Eesti',
    email: ''
  };





  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private authService: AuthService, // AuthService lisatud
    private customerService: CustomerService,
    private reservationService: ReservationService,
    private appComponent: AppComponent
  ) { }

  // const formattedDateFrom = new Date(this.dateFrom).toISOString().split('T')[0];
  // const formattedDateTo = new Date(this.dateTo).toISOString().split('T')[0];

  // const formattedDateFrom = this.dateFrom.toISOString().split('T')[0];
  // const formattedDateTo = this.dateTo.toISOString().split('T')[0];

  // Üks ngOnInit meetod, mis teeb vajalikud päringud ja kontrollib sisselogimist
  ngOnInit(): void {
    this.city = 'Tallinn'; // Määrame algselt linna
    console.log('ngOnInit käivitati'); // Testime, kas see funktsioon käivitub
    this.returnCity =this.city; // Algselt on returnCity sama, mis city
     const today = new Date().toISOString().split('T')[0]; // Tänane kuupäev
     this.dateFrom = today; // Määrame tänase päeva alguskuupäevaks
     this.dateTo = today; // Määrame tänase päeva lõppkuupäevaks
    this.searchCars(); // Laadime autode nimekirja sõltumata sisselogimisolekust

    // Listener login ja signup sündmustele
    this.appComponent.loginEvent.subscribe((response: { token: string, userId: number }) => {
      console.log('Login Event received: ', response);
      this.authService.setToken(response.token);
      this.loadCustomerData(); // Laadime kliendi andmed peale sisselogimist
    });

    this.appComponent.signupEvent.subscribe((data: { token: string, userId: number }) => {
      console.log("Signup response:", data);
      this.authService.setToken(data.token);
      this.loadCustomerData(); // Laadime kliendi andmed peale registreerimist
    });

  }

 // Kui kasutaja muudab linnavalikut
 onCityChange(): void {
  // if (!this.returnCityManuallyChanged) {
    this.returnCity = this.city; // Kui returnCity't pole käsitsi muudetud, siis muuda koos city'ga
    this.returnCityManuallyChanged = false; // ja taastame synnkroonsuse
  // }
  this.onParametersChange(); // Käivita autode uuesti pärimine või muu loogika
}
  // Kui kasutaja muudab returnCity valikut
  onReturnCityChange(): void {
    this.returnCityManuallyChanged = true; // Märgime, et kasutaja on käsitsi returnCity muutnud
    this.onParametersChange(); // Käivita autode uuesti pärimine või muu loogika
  }
  
  // Meetod kliendi andmete toomiseks (vajadusel backendist)
  loadCustomerData(): void {
    if (this.authService.isAuthenticated()) {
      // Kontrolli, kas on juba kliendi andmed. Kui mitte, siis ava modaal.
      this.customerService.getCustomerData(this.authService.getCurrentUserId()).subscribe({
        next: (customer) => {
          this.customerData = customer;
        },
        error: () => {
          this.openCustomerModal(); // Kui kliendi andmed puuduvad, avame modaalakna
        }
      });
    }
  }

  // registerCustomer() {
  //   // Emitteerime sündmuse koos 'CUSTOMER' väärtusega
  //   this.appComponent.signupEvent.emit('CUSTOMER');
  // }

  // Ava kliendi andmete modaalaken
  openCustomerModal(): void {
    this.showCustomerModal = true;
  }

  // Sulge kliendi andmete modaalaken
  closeCustomerModal(): void {
    this.showCustomerModal = false;
  }

  // Esitame kliendi andmed
  submitCustomer(): void {
    console.log('Kliendi andmed hakatakse salvestama');
    this.notificationService.setNotification('Kliendi andmed hakatakse salvestama')
    this.customerService.registerCustomer(this.customerData).subscribe({
      next: (response) => {
        console.log('Kliendi andmed edukalt salvestatud:', response);
        this.closeCustomerModal();
        this.notificationService.setNotification("Kliendi andmed edukalt salvestatud:")
        alert("Käivitame broneerimisprotsessi peale kliendi andmete salvestamist ");
        this.startReservationProcess(); // Käivitame broneerimisprotsessi peale salvestamist
      },
      error: (error) => {
        console.error('Kliendi andmete salvestamise viga:', error);
        this.notificationService.setNotification('Kliendi andmete salvestamise viga.');
      }
    });
  }

  startReservationProcess(): void {
   
    const formattedDateFrom = new Date(this.dateFrom);
    const formattedDateTo = new Date(this.dateTo);

    const customerId = Number(this.authService.getCurrentUserId()); // Muudame kasutaja ID arvuks
    if (!customerId) {
      this.notificationService.setNotification('Kasutaja pole sisse logitud.');
      return;
    }

    // Logime välja kuupäevad, et kontrollida nende väärtusi
    console.log("Date From:", this.dateFrom);
    console.log("Date To:", this.dateTo);

    if (!this.selectedCar) {
      console.error('Auto ei ole valitud');
      this.notificationService.setNotification('Palun valige auto enne broneerimist.');
      return;
    }

    this.notificationService.setNotification(
      `Kliendi ${this.customerData.firstName} ${this.customerData.lastName}, 
      ID: ${this.customerData.customerId}, // kas see on nüüd õige
        auto ${this.selectedCar.model}, ${this.selectedCar.brand} 
      on edukalt broneeritud ajavahemikul ${this.dateFrom} kuni ${this.dateTo}.`);

    // Saada broneeringu andmed serverisse
    this.reservationService.createReservation({
     //reservationId: 1,
      // dateOfBooking:todays,
      dateFrom: formattedDateFrom,
      dateTo: formattedDateTo,
      customerId: this.customerData.customerId, //this.authService.getCurrentUserId(),
      carId: this.selectedCar.carId, // Valitud auto ID,
      branchOfLoanId: 0, //0 - BE paneb tegeliku Branci ise kui on null 
      branchOfReturnId: 0, // baneme et tuuaks siia tagasi // this.returnCity, // Return city valik
      // branchOfReturnId: this.selectedReturnBranch,  // Kasutaja poolt valitud tagastuse branch
      amount: this.selectedCar.amount, //nupp
      loanId: 0, // hiiljem
      refundId: 0 //hiljem

    }).subscribe({
      next: (reservationResponse) => {
        console.log('Broneering edukalt loodud:', reservationResponse);
        // this.updateButtonAfterReservation();  // Muudame nupu peale edukat broneeringut
      },
      error: (error) => {
        console.error('Broneerimise viga:', error);
        this.notificationService.setNotification('Broneerimise käigus ilmnes viga.');
      }
    });
  }



  // updateButtonAfterReservation(): void {
  //   this.isButtonDisabled = true; // Teeme algse nupu inaktiivseks
  //   this.buttonLabel = 'Makstud'; // Muudame nupu teksti
  // }



  // Avame login modal, mis sisaldab ka signup võimalust
  openLoginModal(): void {
    this.authService.openLoginModal(); // Kasutame authService kaudu login-modaali avamiseks
  }

  onParametersChange() {
    this.fetchAvailableCars();
    console.log('City:', this.city);
    console.log('Return City:', this.returnCity);
  }

  // Päring autode saamiseks
  fetchAvailableCars() {
    this.dataService.getAvailableCars(this.city, this.dateFrom, this.dateTo).subscribe({
      next: (cars) => {
        this.cars = cars;
        if (this.cars.length === 0) {
          this.notificationService.setNotification('No cars available for the selected city and date range.');
        } else {
          this.notificationService.clearNotification();
        }
      },
      error: (error) => {
        console.error('Autode päring ebaõnnestus:', error);
        this.cars = [];
        this.notificationService.setNotification('Error fetching available cars.');
      }
    });
  }

  onSearch(): void {
    this.searchCars(); // Kutsub välja meetodi, mis teeb päringu
  }

  selectCar(car: CarDTO): void {
    console.log('Selected car:', car);
    this.selectedCar = car;
    this.loadCarImage(car.carId); // Laadib valitud auto pildi
  }

  searchCars(): void {
    this.dataService.getAvailableCars(this.city, this.dateFrom, this.dateTo).subscribe(data => {
      this.cars = data;
    });
  }

  // Broneerimisprotsess, mis kontrollib, kas klient on sisse logitud
  reserveCar(): void {
    if (this.authService.isAuthenticated()) {
      this.loadCustomerData(); // Laadime kliendi andmed, kui kasutaja on sisse logitud
      if (this.customerData.firstName && this.customerData.lastName) {
        this.createReservation();
      } else {
        this.openCustomerModal();
      }
    } else {
      this.openLoginModal();
    }
  }

  createReservation(): void {
    console.log('Fiktiivne broneering loodud');
    // Ajutine funktsioon, mida saab hiljem täiustada
  }

  // Kontrollime, kas kasutaja on sisse logitud
  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.customerName = 'Teie nimi';
    } else {
      this.customerName = '';
    }
  }

  confirmRental(): void {
    if (this.selectedCar) {
      alert(`Selected car: ${this.selectedCar.brand} ${this.selectedCar.model}`);
    }
  }

  loadCarImage(carId: number): void {
    const imageUrl = `${environment.baseUrl}/api/v1/branch/car/${carId}/image`;
    this.http.get(imageUrl, { responseType: 'blob' }).subscribe(
      (response: Blob) => {
        const objectURL = URL.createObjectURL(response); // Loome Object URL
        this.selectedCarImageUrl = objectURL; // Kasutame seda pildi kuvamiseks
      },
      error => {
        console.error('Error loading image', error);
        this.selectedCarImageUrl = null;
      }
    );
  }
}






// allpool töötav seis 19.09.2024

// import { Component, OnInit, EventEmitter } from '@angular/core';
// import { DataService } from '../data.service';
// import { NgFor } from '@angular/common';
// import { CommonModule } from '@angular/common';
// import { CarDTO } from '../models/CarDTO';
// import { HttpClient } from '@angular/common/http';  // Impordime HttpClient
// import { environment } from '../environments/environment';
// import { FormsModule } from '@angular/forms'; // Import FormsModule
// import { NotificationService } from '../notification.service'; // Impordi NotificationService
// import { AuthService } from '../auth/auth.service'; // Lisatud AuthService
// import { CustomerDTO } from '../models/customerDTO';
// import { CustomerService } from '../customer.service';
// import { ReservationService } from '../reservation.service';
// import { AppComponent } from '../app.component';  // Impordi AppComponent

// @Component({
//   selector: 'app-car-list',
//   imports: [CommonModule, NgFor, FormsModule],
//   standalone: true,
//   templateUrl: './car-list.component.html',
//   styleUrls: ['./car-list.component.scss']
// })

// export class CarListComponent implements OnInit {
//   cars: CarDTO[] = [];
//   selectedCar: CarDTO | null = null;
//   city: string = ''; // City parameeter
//   dateFrom: string = ''; // Kuupäeva algus
//   dateTo: string = ''; // Kuupäeva lõpp
//   cityList: string[] = ['Tallinn', 'Tartu', 'Narva', 'Pärnu', 'Viljandi', 'Kuressaare', 'Rakvere', 'Jõhvi', 'Paide', 'Võru'];
//   selectedCarImageUrl: string | null = null; // Deklareerime selectedCarImageUrl

//   isLoggedIn: boolean = false; // Kliendi sisselogimise olek
//   customerName: string = ''; // Kliendi nimi, kui sisse logitud
//   showCustomerModal: boolean = false; // Kliendi andmete modaalakna juhtimine

//   // Signup modaalakna ja andmete muutujad
//   showSignupModal: boolean = false; // Lisatud registreerimise modaalakna juhtimine
//   signupData = { username: '', password: '', userType: 'CUSTOMER' }; // Registreerimisvormi andmed

//   // Andmed kliendi registreerimiseks
//   customerData: CustomerDTO = {
//     firstName: '',
//     lastName: '',
//     address1: '',
//     address2: '',
//     addressCity: '',
//     addressCountry: 'Eesti',
//     email: ''
//   };

//   // showCustomerModal = false; duplicated

//   constructor(
//     private dataService: DataService,
//     private http: HttpClient,
//     private notificationService: NotificationService,
//     private authService: AuthService, // AuthService lisatud
//     private customerService: CustomerService,
//     private reservationService: ReservationService,
//     private appComponent: AppComponent
//   ) { }

//   // Üks ngOnInit meetod, mis teeb vajalikud päringud ja kontrollib sisselogimist
//   ngOnInit(): void {
//     this.city = 'Tallinn'; // Määrame algselt linna
//     console.log('ngOnInit käivitati'); // Testime, kas see funktsioon käivitub
//     this.city = 'Tallinn'; // Määrame algselt linna
//     const today = new Date().toISOString().split('T')[0]; // Tänane kuupäev
//     this.dateFrom = today; // Määrame tänase päeva alguskuupäevaks
//     this.dateTo = today; // Määrame tänase päeva lõppkuupäevaks
//        this.checkLoginStatus();// // Siin kontrollitakse, kas kasutaja on sisselogitud
//     this.searchCars();        // Autode otsimine on avalik funktsioon
//     this.searchCars(); // Alglaadimine vaikimisi andmetega
//     //this.checkIfCustomerDataExists(); // Kontrolli, kas kliendiandmed on olemas
//     this.loadCustomerData(); // Laadime kliendi andmed kui on sisselogitud
//     // Listener login ja signup sündmustele

//     this.appComponent.loginEvent.subscribe((response: { token: string, userId: number }) => {
//       console.log('Login Event received: ', response);
//     });
//     this.appComponent.signupEvent.subscribe((data: { token: string, userId: number }) => {
//       console.log("Signup response:", data);
//       // Kasuta 'token' ja 'userId' vastavalt vajaduse



//     }

//   // Meetod kliendi andmete toomiseks (vajadusel backendist)
//   loadCustomerData(): void {
//       if(this.isLoggedIn) {
//       // Kontrolli, kas on juba kliendi andmed. Kui mitte, siis ava modaal.
//       this.customerService.getCustomerData(this.authService.getCurrentUserId()).subscribe({
//         next: (customer) => {
//           this.customerData = customer;
//         },
//         error: () => {
//           this.openCustomerModal(); // Kui kliendi andmed puuduvad, avame modaalakna
//         }
//       });
//     }
//   }

//   registerCustomer() {


//     // Kutsu signup funktsioon ja edasta 'CUSTOMER'
//     // this.appComponent.signup('CUSTOMER');
//     // Emitteerime sündmuse koos 'CUSTOMER' väärtusega
//     this.appComponent.signupEvent.emit('CUSTOMER');
//     // // Kutsu app.component-i signup meetodit ja edasta 'CUSTOMER' väärtus
//     // const username = this.signupData.username;
//     // const password = this.signupData.password;

//     // // Kutsu signup funktsioon AuthService kaudu ja edasta 'CUSTOMER'
//     // this.authService.signupWithUserType(username, password, 'CUSTOMER').subscribe({
//     //   next: (response) => {
//     //     console.log('Registreerimine edukas:', response);
//     //     this.authService.setToken(response.token);
//     //   },
//     //   error: (error) => {
//     //     console.error('Registreerimise viga:', error);
//     //   }
//     // });
//   }


//   // Ava kliendi andmete modaalaken
//   openCustomerModal(): void {
//     this.showCustomerModal = true;
//   }

//   // Sulge kliendi andmete modaalaken
//   closeCustomerModal(): void {
//     this.showCustomerModal = false;
//   }

//   // // Saada kliendi andmed serverisse
//   // submitCustomerData(): void {
//   //   console.log('Kliendi andmed saadetud:', this.customerData);
//   //   this.closeCustomerModal(); // Sulge modaalaken peale andmete salvestamist
//   // }

//   // Esitame kliendi andmed
//   submitCustomer(): void {
//     console.log('Kliendi andmed hakatakse salvestama');
//     this.customerService.registerCustomer(this.customerData).subscribe({
//       next: (response) => {
//         console.log('Kliendi andmed edukalt salvestatud:', response);
//         this.closeCustomerModal();
//         alert("Käivitame broneerimisprotsessi peale kliendi andmete salvestamist ");
//         // this.createReservation(); // Käivitame broneerimisprotsessi peale kliendi andmete salvestamist
//       },
//       error: (error) => {
//         console.error('Kliendi andmete salvestamise viga:', error);
//       }
//     });
//   }
//   //   createReservation(): void {
//   //     if (this.selectedCar) {
//   //       const reservationData = {
//   //         carId: this.selectedCar.carId,
//   //         dateFrom: this.dateFrom,
//   //         dateTo: this.dateTo,
//   //         customerId: this.authService.getCurrentUserId() // Eeldame, et see meetod tagastab kasutaja ID
//   //       };
//   // //BE  return ResponseEntity.ok(customer);
//   //       this.dataService.createReservation(reservationData).subscribe({
//   //         next: (response) => {
//   //           this.notificationService.setNotification('Broneering on edukalt loodud!');
//   //         },
//   //         error: (error) => {
//   //           this.notificationService.setNotification('Broneerimise käigus ilmnes viga.');
//   //         }
//   //       });
//   //     }

//   //   }


//   // Avame login modal, mis sisaldab ka signup võimalust
//   openLoginModal(): void {
//     this.authService.openLoginModal(); // Kasutame authService kaudu login-modaali avamiseks
//   }


//   onParametersChange() {
//     // Kutsu API uuesti, kui linn või kuupäev muutub
//     // this.fetchAvailableCars(this.city, this.dateFrom, this.dateTo);
//     this.fetchAvailableCars();
//   }


//   // Näide, kuidas teade saata
//   notifyUser(): void {
//     this.notificationService.setNotification('Uuendus autode nimekirjas!'); // Teate seadmine
//   }

//   // Näide, kuidas teade tühjendada
//   clearNotification(): void {
//     this.notificationService.clearNotification(); // Teate tühjendamine
//   }

//   // Päring autode saamiseks
//   // fetchAvailableCars(city: string, dateFrom: string, dateTo: string)
//   fetchAvailableCars() {
//     this.dataService.getAvailableCars(this.city, this.dateFrom, this.dateTo).subscribe({
//       next: (cars) => {
//         this.cars = cars;

//         // Kui autosid pole saadaval, kuvame teate NotificationService'i kaudu
//         if (this.cars.length === 0) {
//           this.notificationService.setNotification('No cars available for the selected city and date range.');
//         } else {
//           // Kui autosid on saadaval, eemaldame teate
//           this.notificationService.clearNotification();
//         }
//       },
//       error: (error) => {
//         console.error('Autode päring ebaõnnestus:', error);
//         this.cars = [];
//         // Kuvame vea teate
//         this.notificationService.setNotification('Error fetching available cars.');
//       }
//     });
//   }
//   // Deklareerime onSearch meetodi
//   onSearch(): void {
//     this.searchCars(); // Kutsub välja meetodi, mis teeb päringu
//   }

//   selectCar(car: CarDTO): void {
//     console.log('Selected car:', car);
//     this.selectedCar = car;
//     this.loadCarImage(car.carId); // Laadib valitud auto pildi
//   }

//   searchCars(): void {
//     this.dataService.getAvailableCars(this.city, this.dateFrom, this.dateTo).subscribe(data => {
//       this.cars = data;
//     });
//   }

//   // HTML'st Broneerimisprotsess, mis kontrollib, kas klient on sisse logitud
//   reserveCar(): void {
//     if (this.authService.isAuthenticated()) {
//       if (this.customerData.firstName && this.customerData.lastName) {
//         // Kui kliendi andmed on olemas, jätkame broneerimisprotsessiga
//         this.createReservation();
//       } else {
//         // Kui kliendi andmeid ei ole, avame kliendi andmete sisestamise modaalakna
//         this.openCustomerModal();
//       }
//     } else {
//       // Kui kasutaja pole sisse logitud, avame login-modaali
//       this.openLoginModal();
//     }
//   }

//   // Registreerimisvormi avamine ja sulgemine
//   openSignupModal(): void {
//     this.showSignupModal = true;
//   }

//   closeSignupModal(): void {
//     this.showSignupModal = false;
//   }

//   createReservation(): void {

//     console.log('Fiktiivne broneering loodud');
//     // Ajutine fiktiivne funktsioon
//     // Kui oleme valmis, saame selle funktsiooni hiljem täiustada


//     // const reservationData: Reservation = {
//     //   reservationid: 0, // BE genereerib ID, kui see pole määratud
//     //   dateFrom: new Date(this.dateFrom),
//     //   dateTo: new Date(this.dateTo),
//     //   custimerId: this.authService.getCurrentUserId(),  // Praegune kasutaja ID
//     //   carId: this.selectedCar?.carId || 0,  // Kontrollime, et auto on valitud
//     //   branchOfLoanId: 1,  // Näide laenuvõtmise haru ID-st (täpsusta vastavalt)
//     //   branchOfReturnId: 1,  // Näide tagastusharu ID-st
//     //   amount: 100,  // Näidis summa, mida saab täpsustada
//     //   loanId: 0,  // Algväärtus, BE võib seda hallata
//     //   refundId: 0  // Algväärtus, BE võib seda hallata
//     // };

//     // this.reservationService.createReservation(reservationData).subscribe({
//     //   next: (response) => {
//     //     console.log('Broneering edukalt loodud:', response);
//     //   },
//     //   error: (error) => {
//     //     console.error('Broneeringu loomine ebaõnnestus:', error);
//     //   }
//     // });
//   }


//   // Kontrollime, kas kasutaja on sisse logitud
//   checkLoginStatus(): void {
//     this.isLoggedIn = this.authService.isAuthenticated();
//     if (this.isLoggedIn) {
//       this.customerName = 'Teie nimi';
//     } else {
//       this.customerName = '';
//     }
//   }

//   confirmRental(): void {
//     if (this.selectedCar) {
//       alert(`Selected car: ${this.selectedCar.brand} ${this.selectedCar.model}`);
//       // Siin võiks olla täiendav loogika rentimise kinnitamiseks
//     }
//   }

//   ///api/v1/branch/car/{carId}/image
//   loadCarImage(carId: number): void {
//     const imageUrl = `${environment.baseUrl}/api/v1/branch/car/${carId}/image`;

//     this.http.get(imageUrl, { responseType: 'blob' }).subscribe(
//       (response: Blob) => {
//         const objectURL = URL.createObjectURL(response); // Loome Object URL
//         this.selectedCarImageUrl = objectURL; // Kasutame seda pildi kuvamiseks
//       },
//       error => {
//         console.error('Error loading image', error);
//         this.selectedCarImageUrl = null;
//       }
//     );

//   }

// }